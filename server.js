require('dotenv').config();

const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const ExcelJS = require('exceljs');
const webPush = require('web-push');
const { randomBytes, createHmac, scrypt: scryptCallback, timingSafeEqual } = require('crypto');
const { promisify } = require('util');
const scrypt = promisify(scryptCallback);

const app = express();
app.disable('x-powered-by');
app.set('etag', false);
const port = Number(process.env.PORT) || 3000;
const publicStaticFiles = new Set([
  '/index.html',
  '/admin.html',
  '/admin.js',
  '/privacy.html',
  '/styles.css',
  '/script.js',
  '/sw.js',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-192.svg',
  '/icon-512.svg',
]);
const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'subscriptions.json');
const feedbackFile = path.join(dataDir, 'feedback.json');
const userStatesCsvFile = path.join(dataDir, 'user-states.csv');
const userStatesXlsxFile = path.join(dataDir, 'user-states.xlsx');
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:contact@example.com';
const feedbackWebhookUrl = process.env.FEEDBACK_WEBHOOK_URL || '';
const exportAdminKey = process.env.EXPORT_ADMIN_KEY || '';
const adminApiKey = process.env.ADMIN_API_KEY || exportAdminKey || '';
const twaPackageName = process.env.TWA_PACKAGE_NAME || 'com.victorfntn.stoptabac';
const twaSha256Fingerprints = (process.env.TWA_SHA256_CERT_FINGERPRINTS || '')
  .split(',')
  .map(value => value.trim())
  .filter(Boolean);

if (!process.env.SESSION_SECRET) {
  console.warn('Warning: SESSION_SECRET not set. Sessions will be invalidated on server restart. Set SESSION_SECRET in production.');
}
const SESSION_SECRET = process.env.SESSION_SECRET || randomBytes(32).toString('hex');
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const usersFile = path.join(dataDir, 'users.json');
const sessionsFile = path.join(dataDir, 'sessions.json');
const accountStatesFile = path.join(dataDir, 'account-states.json');
const analyticsFile = path.join(dataDir, 'analytics.json');

if (vapidPublicKey && vapidPrivateKey) {
  webPush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

function getClientIp(req) {
  const forwardedFor = typeof req.headers['x-forwarded-for'] === 'string'
    ? req.headers['x-forwarded-for'].split(',')[0].trim()
    : '';
  return forwardedFor || req.ip || 'unknown';
}

function parsePositiveIntEnv(name, fallback) {
  const raw = process.env[name];
  if (raw === undefined || raw === null || raw === '') {
    return fallback;
  }
  const parsed = Number.parseInt(String(raw), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
}

function createRateLimiter({ windowMs, maxRequests }) {
  const buckets = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = `${getClientIp(req)}:${req.path}`;
    const current = buckets.get(key);

    if (!current || current.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    if (current.count >= maxRequests) {
      const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
      res.setHeader('Retry-After', String(retryAfterSeconds));
      res.status(429).json({ error: 'too-many-requests' });
      return;
    }

    current.count += 1;

    if (buckets.size > 5000) {
      for (const [bucketKey, bucketValue] of buckets.entries()) {
        if (bucketValue.resetAt <= now) {
          buckets.delete(bucketKey);
        }
      }
    }

    next();
  };
}

function isAllowedStaticRequest(reqPath) {
  if (!reqPath || reqPath === '/') {
    return true;
  }
  if (reqPath.startsWith('/api/') || reqPath === '/healthz' || reqPath === '/.well-known/assetlinks.json') {
    return true;
  }

  // Reject dotfiles (e.g., /.env, /.git/config)
  if (reqPath.includes('/.')) {
    return false;
  }

  const extension = path.extname(reqPath);
  if (!extension) {
    return true;
  }

  return publicStaticFiles.has(reqPath);
}

const rateLimitWindowMs = parsePositiveIntEnv('RATE_LIMIT_WINDOW_MS', 10 * 60 * 1000);
const pushWriteLimiter = createRateLimiter({
  windowMs: rateLimitWindowMs,
  maxRequests: parsePositiveIntEnv('RATE_LIMIT_PUSH_MAX_REQUESTS', 300),
});
const userStateLimiter = createRateLimiter({
  windowMs: rateLimitWindowMs,
  maxRequests: parsePositiveIntEnv('RATE_LIMIT_USER_STATE_MAX_REQUESTS', 120),
});
const feedbackLimiter = createRateLimiter({
  windowMs: rateLimitWindowMs,
  maxRequests: parsePositiveIntEnv('RATE_LIMIT_FEEDBACK_MAX_REQUESTS', 25),
});
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: parsePositiveIntEnv('RATE_LIMIT_AUTH_MAX_REQUESTS', 10),
});
const analyticsLimiter = createRateLimiter({
  windowMs: rateLimitWindowMs,
  maxRequests: parsePositiveIntEnv('RATE_LIMIT_ANALYTICS_MAX_REQUESTS', 30),
});

// --- Auth helpers ---

async function readJsonDataFile(filePath, defaultValue) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

async function writeJsonDataFile(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

async function readUsers() {
  const data = await readJsonDataFile(usersFile, []);
  return Array.isArray(data) ? data : [];
}

async function readSessions() {
  const data = await readJsonDataFile(sessionsFile, []);
  return Array.isArray(data) ? data : [];
}

async function readAccountStates() {
  const data = await readJsonDataFile(accountStatesFile, {});
  return (typeof data === 'object' && data !== null && !Array.isArray(data)) ? data : {};
}

async function readAnalyticsEvents() {
  const data = await readJsonDataFile(analyticsFile, []);
  return Array.isArray(data) ? data : [];
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

async function verifyPassword(password, stored) {
  const parts = String(stored || '').split(':');
  if (parts.length !== 2) return false;
  const [salt, keyHex] = parts;
  try {
    const derivedKey = await scrypt(password, salt, 64);
    const storedKey = Buffer.from(keyHex, 'hex');
    if (derivedKey.length !== storedKey.length) return false;
    return timingSafeEqual(derivedKey, storedKey);
  } catch {
    return false;
  }
}

function generateSessionToken() {
  return randomBytes(32).toString('hex');
}

function hashToken(token) {
  return createHmac('sha256', SESSION_SECRET).update(token).digest('hex');
}

async function getSessionUser(req) {
  const authHeader = typeof req.get('authorization') === 'string' ? req.get('authorization').trim() : '';
  const bearerPrefix = 'Bearer ';
  if (!authHeader.startsWith(bearerPrefix)) return null;
  const token = authHeader.slice(bearerPrefix.length).trim();
  if (!token) return null;
  const tokenHash = hashToken(token);
  const sessions = await readSessions();
  const now = Date.now();
  const session = sessions.find(s => s.tokenHash === tokenHash && s.expiresAt > now);
  if (!session) return null;
  const users = await readUsers();
  return users.find(u => u.id === session.userId) || null;
}

function requireUserAuth(req, res, next) {
  getSessionUser(req).then(user => {
    if (!user) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }
    req.user = user;
    next();
  }).catch(() => res.status(500).json({ error: 'auth-error' }));
}

app.use(express.json({ limit: '200kb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "form-action 'self'",
    "script-src 'self' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https:",
    "connect-src 'self'",
    "worker-src 'self'",
  ].join('; '));
  next();
});
app.use((req, res, next) => {
  if ((req.method === 'GET' || req.method === 'HEAD') && !isAllowedStaticRequest(req.path)) {
    res.status(404).send('Not found');
    return;
  }
  next();
});
app.use(express.static(__dirname, { index: false, dotfiles: 'deny' }));
app.use(['/api/push/subscribe', '/api/push/state', '/api/push/unsubscribe'], pushWriteLimiter);
app.use('/api/user-state', userStateLimiter);
app.use('/api/feedback', feedbackLimiter);

async function ensureDataFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, '[]', 'utf8');
  }
}

async function ensureFeedbackFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(feedbackFile);
  } catch {
    await fs.writeFile(feedbackFile, '[]', 'utf8');
  }
}

async function ensureUserStatesCsvFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(userStatesCsvFile);
  } catch {
    const header = [
      'createdAt',
      'clientId',
      'quitDate',
      'cigsPerDay',
      'cigsPerPack',
      'pricePerPack',
      'goalName',
      'goalAmount',
      'isPaused',
      'pausedDaysTotal',
      'daysWithoutSmoking',
      'savedCigarettes',
      'savedMoney',
      'dailyCost',
      'source',
      'userAgent',
    ].join(',');
    await fs.writeFile(userStatesCsvFile, `${header}\n`, 'utf8');
  }
}

async function ensureUserStatesXlsxFile() {
  await fs.mkdir(dataDir, { recursive: true });
  const workbook = new ExcelJS.Workbook();
  let fileExists = true;

  try {
    await fs.access(userStatesXlsxFile);
    await workbook.xlsx.readFile(userStatesXlsxFile);
  } catch {
    fileExists = false;
  }

  let workbookChanged = false;

  let userStatesWorksheet = workbook.getWorksheet('UserStates');
  if (!userStatesWorksheet) {
    userStatesWorksheet = workbook.addWorksheet('UserStates');
    workbookChanged = true;
  }
  userStatesWorksheet.columns = [
    { header: 'createdAt', key: 'createdAt', width: 28 },
    { header: 'clientId', key: 'clientId', width: 38 },
    { header: 'quitDate', key: 'quitDate', width: 14 },
    { header: 'cigsPerDay', key: 'cigsPerDay', width: 12 },
    { header: 'cigsPerPack', key: 'cigsPerPack', width: 12 },
    { header: 'pricePerPack', key: 'pricePerPack', width: 14 },
    { header: 'goalName', key: 'goalName', width: 26 },
    { header: 'goalAmount', key: 'goalAmount', width: 14 },
    { header: 'isPaused', key: 'isPaused', width: 10 },
    { header: 'pausedDaysTotal', key: 'pausedDaysTotal', width: 16 },
    { header: 'daysWithoutSmoking', key: 'daysWithoutSmoking', width: 18 },
    { header: 'savedCigarettes', key: 'savedCigarettes', width: 16 },
    { header: 'savedMoney', key: 'savedMoney', width: 14 },
    { header: 'dailyCost', key: 'dailyCost', width: 12 },
    { header: 'source', key: 'source', width: 28 },
    { header: 'userAgent', key: 'userAgent', width: 48 },
  ];
  userStatesWorksheet.getRow(1).font = { bold: true };

  let feedbackWorksheet = workbook.getWorksheet('Feedback');
  if (!feedbackWorksheet) {
    feedbackWorksheet = workbook.addWorksheet('Feedback');
    workbookChanged = true;
  }
  feedbackWorksheet.columns = [
    { header: 'createdAt', key: 'createdAt', width: 28 },
    { header: 'clientId', key: 'clientId', width: 38 },
    { header: 'message', key: 'message', width: 80 },
    { header: 'contact', key: 'contact', width: 38 },
    { header: 'source', key: 'source', width: 28 },
    { header: 'userAgent', key: 'userAgent', width: 48 },
  ];
  feedbackWorksheet.getRow(1).font = { bold: true };

  if (!fileExists || workbookChanged) {
    await workbook.xlsx.writeFile(userStatesXlsxFile);
  }
}

async function readSubscriptions() {
  await ensureDataFile();
  const raw = await fs.readFile(dataFile, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeSubscriptions(subscriptions) {
  await ensureDataFile();
  await fs.writeFile(dataFile, JSON.stringify(subscriptions, null, 2), 'utf8');
}

async function readFeedbackEntries() {
  await ensureFeedbackFile();
  const raw = await fs.readFile(feedbackFile, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeFeedbackEntries(entries) {
  await ensureFeedbackFile();
  await fs.writeFile(feedbackFile, JSON.stringify(entries, null, 2), 'utf8');
}

function getSubscriptionId(subscription) {
  return subscription?.endpoint || '';
}

function getProvidedAdminKey(req) {
  const headerKey = typeof req.get('x-admin-key') === 'string' ? req.get('x-admin-key').trim() : '';
  if (headerKey) {
    return headerKey;
  }

  const authorization = typeof req.get('authorization') === 'string' ? req.get('authorization').trim() : '';
  const bearerPrefix = 'Bearer ';
  if (authorization.startsWith(bearerPrefix) && authorization.length > bearerPrefix.length) {
    return authorization.slice(bearerPrefix.length).trim();
  }

  return '';
}

function isAdminAuthorized(req) {
  if (!adminApiKey) {
    return false;
  }
  const providedKey = getProvidedAdminKey(req);
  return providedKey === adminApiKey;
}

function requireAdminAuth(req, res, next) {
  if (!adminApiKey) {
    res.status(503).json({ error: 'admin-key-not-configured' });
    return;
  }
  if (!isAdminAuthorized(req)) {
    res.status(403).json({ error: 'forbidden' });
    return;
  }
  next();
}

function csvEscape(value) {
  if (value === null || value === undefined) {
    return '""';
  }
  const stringValue = String(value).replace(/"/g, '""');
  return `"${stringValue}"`;
}

async function appendUserStateCsvRow(entry) {
  await ensureUserStatesCsvFile();
  const row = [
    entry.createdAt,
    entry.clientId,
    entry.quitDate,
    entry.cigsPerDay,
    entry.cigsPerPack,
    entry.pricePerPack,
    entry.goalName,
    entry.goalAmount,
    entry.isPaused,
    entry.pausedDaysTotal,
    entry.daysWithoutSmoking,
    entry.savedCigarettes,
    entry.savedMoney,
    entry.dailyCost,
    entry.source,
    entry.userAgent,
  ].map(csvEscape).join(',');
  await fs.appendFile(userStatesCsvFile, `${row}\n`, 'utf8');
}

async function appendUserStateXlsxRow(entry) {
  await ensureUserStatesXlsxFile();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(userStatesXlsxFile);

  let worksheet = workbook.getWorksheet('UserStates');
  if (!worksheet) {
    worksheet = workbook.addWorksheet('UserStates');
  }

  worksheet.addRow({
    createdAt: entry.createdAt,
    clientId: entry.clientId,
    quitDate: entry.quitDate,
    cigsPerDay: entry.cigsPerDay,
    cigsPerPack: entry.cigsPerPack,
    pricePerPack: entry.pricePerPack,
    goalName: entry.goalName,
    goalAmount: entry.goalAmount,
    isPaused: entry.isPaused,
    pausedDaysTotal: entry.pausedDaysTotal,
    daysWithoutSmoking: entry.daysWithoutSmoking,
    savedCigarettes: entry.savedCigarettes,
    savedMoney: entry.savedMoney,
    dailyCost: entry.dailyCost,
    source: entry.source,
    userAgent: entry.userAgent,
  });

  await workbook.xlsx.writeFile(userStatesXlsxFile);
}

async function appendFeedbackXlsxRow(entry) {
  await ensureUserStatesXlsxFile();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(userStatesXlsxFile);

  let worksheet = workbook.getWorksheet('Feedback');
  if (!worksheet) {
    worksheet = workbook.addWorksheet('Feedback');
    worksheet.columns = [
      { header: 'createdAt', key: 'createdAt', width: 28 },
      { header: 'clientId', key: 'clientId', width: 38 },
      { header: 'message', key: 'message', width: 80 },
      { header: 'contact', key: 'contact', width: 38 },
      { header: 'source', key: 'source', width: 28 },
      { header: 'userAgent', key: 'userAgent', width: 48 },
    ];
    worksheet.getRow(1).font = { bold: true };
  }

  worksheet.addRow({
    createdAt: entry.createdAt,
    clientId: entry.clientId,
    message: entry.message,
    contact: entry.contact,
    source: entry.source,
    userAgent: entry.userAgent,
  });

  await workbook.xlsx.writeFile(userStatesXlsxFile);
}

function getTodayIso() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString().split('T')[0];
}

function getPauseMessage(dateIso) {
  const messages = [
    'Chaque jour sans cigarette est une victoire. Tu peux reprendre aujourd\'hui.',
    'Respire un grand coup. Ta pause peut devenir un nouveau depart.',
    'Une envie passe. Ton objectif, lui, peut rester.',
    'Reprendre aujourd\'hui, c\'est deja avancer.',
    'Ton corps apprecie chaque cigarette evitee. Continue.'
  ];
  const hash = Array.from(dateIso).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return messages[hash % messages.length];
}

function parseTimeToMinutes(value, fallbackMinutes) {
  const match = /^(\d{2}):(\d{2})$/.exec(String(value || '').trim());
  if (!match) {
    return fallbackMinutes;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return fallbackMinutes;
  }
  return (hours * 60) + minutes;
}

function getDateInUserTimezone(now, timezoneOffsetMinutes) {
  const offset = Number(timezoneOffsetMinutes);
  if (!Number.isFinite(offset)) {
    return new Date(now.getTime());
  }
  return new Date(now.getTime() - (offset * 60 * 1000));
}

function isWithinQuietHours(localDate, quietStart, quietEnd) {
  const startMinutes = parseTimeToMinutes(quietStart, 21 * 60 + 30);
  const endMinutes = parseTimeToMinutes(quietEnd, 8 * 60);
  if (startMinutes === endMinutes) {
    return false;
  }

  const nowMinutes = (localDate.getHours() * 60) + localDate.getMinutes();
  if (startMinutes < endMinutes) {
    return nowMinutes >= startMinutes && nowMinutes < endMinutes;
  }

  return nowMinutes >= startMinutes || nowMinutes < endMinutes;
}

function isAllowedDayByFrequency(localDate, frequency, weeklyDay) {
  const day = localDate.getDay();
  if (frequency === 'weekdays') {
    return day >= 1 && day <= 5;
  }
  if (frequency === 'weekly') {
    return day === Number(weeklyDay);
  }
  return true;
}

function isNearReminderTime(localDate, reminderTime) {
  const reminderMinutes = parseTimeToMinutes(reminderTime, 9 * 60);
  const nowMinutes = (localDate.getHours() * 60) + localDate.getMinutes();
  return Math.abs(nowMinutes - reminderMinutes) <= 5;
}

function canSendPushForUser(userState, now = new Date()) {
  const notificationPrefs = userState?.notificationPrefs || {};
  const frequency = notificationPrefs.frequency || 'daily';
  const quietStart = notificationPrefs.quietStart || '21:30';
  const quietEnd = notificationPrefs.quietEnd || '08:00';
  const reminderTime = notificationPrefs.reminderTime || '09:00';
  const weeklyDay = String(notificationPrefs.weeklyDay ?? '1');
  const localDate = getDateInUserTimezone(now, userState?.timezoneOffsetMinutes);

  if (isWithinQuietHours(localDate, quietStart, quietEnd)) {
    return false;
  }

  if (!isAllowedDayByFrequency(localDate, frequency, weeklyDay)) {
    return false;
  }

  if (!isNearReminderTime(localDate, reminderTime)) {
    return false;
  }

  return true;
}

function getSavedPacks(userState) {
  const cigsPerDay = Number(userState.cigsPerDay) || 0;
  const cigsPerPack = Number(userState.cigsPerPack) || 1;
  const quitDate = new Date(userState.quitDate);
  if (!Number.isFinite(quitDate.getTime())) {
    return 0;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  quitDate.setHours(0, 0, 0, 0);
  const elapsedDays = Math.max(0, Math.floor((today - quitDate) / 86400000));
  const pausedDaysTotal = Number(userState.pausedDaysTotal) || 0;
  let pausedDaysCurrent = 0;
  if (userState.isPaused && userState.pauseStartedAt) {
    const pauseStartedAt = new Date(userState.pauseStartedAt);
    if (Number.isFinite(pauseStartedAt.getTime())) {
      pauseStartedAt.setHours(0, 0, 0, 0);
      pausedDaysCurrent = Math.max(0, Math.floor((today - pauseStartedAt) / 86400000));
    }
  }
  const activeDays = Math.max(0, elapsedDays - pausedDaysTotal - pausedDaysCurrent);
  const savedCigarettes = activeDays * cigsPerDay;
  return Math.floor(savedCigarettes / cigsPerPack);
}

async function sendPushNotification(subscription, payload) {
  if (!vapidPublicKey || !vapidPrivateKey) {
    return { ok: false, reason: 'missing-vapid' };
  }
  try {
    await webPush.sendNotification(subscription, JSON.stringify(payload));
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: error.statusCode || 'push-error' };
  }
}

async function sendScheduledNotifications() {
  const subscriptions = await readSubscriptions();
  const todayIso = getTodayIso();
  const now = new Date();
  const nextSubscriptions = [];

  for (const record of subscriptions) {
    let keepRecord = true;
    const userState = record.userState || {};

    const canSendNow = canSendPushForUser(userState, now);

    if (canSendNow && userState.isPaused && record.lastPausePushAt !== todayIso) {
      const result = await sendPushNotification(record.subscription, {
        title: 'Calculateur d\'economies',
        body: getPauseMessage(todayIso),
        tag: `pause-${todayIso}`,
      });
      if (result.ok) {
        record.lastPausePushAt = todayIso;
      } else if (result.reason === 404 || result.reason === 410) {
        keepRecord = false;
      }
    }

    const savedPacks = getSavedPacks(userState);
    if (keepRecord && canSendNow && savedPacks > (record.lastNotifiedPackCount || 0)) {
      const newPacks = savedPacks - (record.lastNotifiedPackCount || 0);
      const result = await sendPushNotification(record.subscription, {
        title: 'Calculateur d\'economies',
        body: `Bravo ! ${newPacks} paquet${newPacks > 1 ? 's' : ''} economise${newPacks > 1 ? 's' : ''} depuis le dernier rappel.`,
        tag: `packs-${savedPacks}`,
      });
      if (result.ok) {
        record.lastNotifiedPackCount = savedPacks;
      } else if (result.reason === 404 || result.reason === 410) {
        keepRecord = false;
      }
    }

    if (keepRecord) {
      nextSubscriptions.push(record);
    }
  }

  await writeSubscriptions(nextSubscriptions);
}

app.get('/healthz', async (req, res) => {
  try {
    await ensureDataFile();
    res.json({
      ok: true,
      vapidConfigured: Boolean(vapidPublicKey && vapidPrivateKey),
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(500).json({ ok: false });
  }
});

app.get('/api/admin/status', requireAdminAuth, async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.json({
    ok: true,
    environment: process.env.NODE_ENV || 'development',
    isProduction,
    vapidConfigured: Boolean(vapidPublicKey && vapidPrivateKey),
    adminConfigured: Boolean(adminApiKey),
    assetLinksConfigured: Boolean(twaPackageName && twaSha256Fingerprints.length > 0),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/admin/users', requireAdminAuth, async (req, res) => {
  try {
    const users = await readUsers();
    res.json(users.map(u => ({
      id: u.id,
      email: u.email,
      createdAt: u.createdAt,
    })));
  } catch {
    res.status(500).json({ error: 'admin-users-failed' });
  }
});

app.get('/api/admin/sessions', requireAdminAuth, async (req, res) => {
  try {
    const sessions = await readSessions();
    res.json(sessions.map(s => ({
      tokenHash: s.tokenHash.slice(0, 16),
      userId: s.userId,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
    })));
  } catch {
    res.status(500).json({ error: 'admin-sessions-failed' });
  }
});

app.get('/api/admin/feedback', requireAdminAuth, async (req, res) => {
  try {
    const data = await fs.promises.readFile(feedbackFile, 'utf-8');
    const feedback = JSON.parse(data || '[]');
    res.json(feedback);
  } catch {
    res.json([]);
  }
});

app.get('/api/push/public-key', (req, res) => {
  if (!vapidPublicKey) {
    res.status(503).json({ error: 'missing-vapid-keys' });
    return;
  }
  res.json({ publicKey: vapidPublicKey });
});

app.post('/api/push/subscribe', async (req, res) => {
  const { subscription, userState, lastPausePushAt, lastNotifiedPackCount } = req.body || {};
  if (!subscription?.endpoint) {
    res.status(400).json({ error: 'invalid-subscription' });
    return;
  }
  const subscriptions = await readSubscriptions();
  const id = getSubscriptionId(subscription);
  const existingIndex = subscriptions.findIndex(item => getSubscriptionId(item.subscription) === id);
  const record = {
    subscription,
    userState: userState || {},
    lastPausePushAt: existingIndex >= 0 ? subscriptions[existingIndex].lastPausePushAt || lastPausePushAt || '' : lastPausePushAt || '',
    lastNotifiedPackCount: existingIndex >= 0 ? subscriptions[existingIndex].lastNotifiedPackCount || Number(lastNotifiedPackCount) || 0 : Number(lastNotifiedPackCount) || 0,
    updatedAt: new Date().toISOString(),
  };
  if (existingIndex >= 0) {
    subscriptions[existingIndex] = record;
  } else {
    subscriptions.push(record);
  }
  await writeSubscriptions(subscriptions);
  res.json({ ok: true });
});

app.post('/api/push/state', async (req, res) => {
  const { endpoint, userState } = req.body || {};
  if (!endpoint) {
    res.status(400).json({ error: 'missing-endpoint' });
    return;
  }
  const subscriptions = await readSubscriptions();
  const existingIndex = subscriptions.findIndex(item => getSubscriptionId(item.subscription) === endpoint);
  if (existingIndex < 0) {
    res.status(404).json({ error: 'subscription-not-found' });
    return;
  }
  subscriptions[existingIndex].userState = userState || {};
  subscriptions[existingIndex].updatedAt = new Date().toISOString();
  await writeSubscriptions(subscriptions);
  res.json({ ok: true });
});

app.post('/api/push/unsubscribe', async (req, res) => {
  const { endpoint } = req.body || {};
  if (!endpoint) {
    res.status(400).json({ error: 'missing-endpoint' });
    return;
  }
  const subscriptions = await readSubscriptions();
  const nextSubscriptions = subscriptions.filter(item => getSubscriptionId(item.subscription) !== endpoint);
  await writeSubscriptions(nextSubscriptions);
  res.json({ ok: true });
});

app.post('/api/push/run-now', requireAdminAuth, async (req, res) => {
  await sendScheduledNotifications();
  res.json({ ok: true });
});

app.post('/api/feedback', async (req, res) => {
  try {
    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
    const contact = typeof req.body?.contact === 'string' ? req.body.contact.trim() : '';
    const clientId = typeof req.body?.clientId === 'string' ? req.body.clientId.trim().slice(0, 80) : '';

    if (!message || message.length < 5) {
      res.status(400).json({ error: 'message-too-short' });
      return;
    }

    if (message.length > 600) {
      res.status(400).json({ error: 'message-too-long' });
      return;
    }

    if (contact && contact.length > 200) {
      res.status(400).json({ error: 'contact-too-long' });
      return;
    }

    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      message,
      contact,
      clientId,
      createdAt: new Date().toISOString(),
      userAgent: req.get('user-agent') || '',
      source: req.get('origin') || req.get('host') || '',
    };

    const entries = await readFeedbackEntries();
    entries.push(entry);
    await writeFeedbackEntries(entries);
    await appendFeedbackXlsxRow(entry);

    if (feedbackWebhookUrl) {
      fetch(feedbackWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      }).catch(() => undefined);
    }

    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'feedback-save-failed' });
  }
});

app.post('/api/user-state', async (req, res) => {
  try {
    const body = req.body || {};
    const entry = {
      createdAt: new Date().toISOString(),
      clientId: typeof body.clientId === 'string' ? body.clientId.trim().slice(0, 80) : '',
      quitDate: typeof body.quitDate === 'string' ? body.quitDate.trim().slice(0, 40) : '',
      cigsPerDay: Number(body.cigsPerDay) || 0,
      cigsPerPack: Number(body.cigsPerPack) || 0,
      pricePerPack: Number(body.pricePerPack) || 0,
      goalName: typeof body.goalName === 'string' ? body.goalName.trim().slice(0, 150) : '',
      goalAmount: Number(body.goalAmount) || 0,
      isPaused: Boolean(body.isPaused),
      pausedDaysTotal: Number(body.pausedDaysTotal) || 0,
      daysWithoutSmoking: Number(body.daysWithoutSmoking) || 0,
      savedCigarettes: Number(body.savedCigarettes) || 0,
      savedMoney: Number(body.savedMoney) || 0,
      dailyCost: Number(body.dailyCost) || 0,
      source: req.get('origin') || req.get('host') || '',
      userAgent: req.get('user-agent') || '',
    };

    if (!entry.clientId) {
      res.status(400).json({ error: 'missing-client-id' });
      return;
    }

    await appendUserStateCsvRow(entry);
    await appendUserStateXlsxRow(entry);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'user-state-save-failed' });
  }
});

app.post('/api/backup/state', (req, res) => {
  res.status(410).json({
    error: 'backup-feature-disabled',
    message: 'Backup feature is disabled in this production build.',
  });
});

app.get('/api/backup/state/:clientId', (req, res) => {
  res.status(410).json({
    error: 'backup-feature-disabled',
    message: 'Backup feature is disabled in this production build.',
  });
});

app.get('/api/backup/versions/:clientId', (req, res) => {
  res.status(410).json({
    error: 'backup-feature-disabled',
    message: 'Backup feature is disabled in this production build.',
  });
});

app.get('/api/user-state/export-all', async (req, res) => {
  try {
    if (!isAdminAuthorized(req)) {
      res.status(403).json({ error: 'forbidden' });
      return;
    }

    await ensureUserStatesCsvFile();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="all-user-states.csv"');
    res.sendFile(userStatesCsvFile);
  } catch {
    res.status(500).json({ error: 'user-state-export-failed' });
  }
});

app.get('/api/user-state/export-all.xlsx', async (req, res) => {
  try {
    if (!isAdminAuthorized(req)) {
      res.status(403).json({ error: 'forbidden' });
      return;
    }

    await ensureUserStatesXlsxFile();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="all-user-states.xlsx"');
    res.sendFile(userStatesXlsxFile);
  } catch {
    res.status(500).json({ error: 'user-state-export-failed' });
  }
});

app.get('/.well-known/assetlinks.json', (req, res) => {
  if (!twaPackageName || twaSha256Fingerprints.length === 0) {
    res.status(404).json({
      error: 'asset-links-not-configured',
      hint: 'Set TWA_PACKAGE_NAME and TWA_SHA256_CERT_FINGERPRINTS in environment variables.',
    });
    return;
  }

  res.json([
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: twaPackageName,
        sha256_cert_fingerprints: twaSha256Fingerprints,
      },
    },
  ]);
});

// --- Auth rate limiting ---
app.use(['/api/auth/register', '/api/auth/login'], authLimiter);
app.use('/api/analytics', analyticsLimiter);

// --- Auth endpoints ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase().slice(0, 200) : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: 'invalid-email' });
      return;
    }
    if (!password || password.length < 8 || password.length > 200) {
      res.status(400).json({ error: 'invalid-password' });
      return;
    }
    const users = await readUsers();
    if (users.some(u => u.email === email)) {
      res.status(409).json({ error: 'email-already-used' });
      return;
    }
    const newUser = {
      id: randomBytes(12).toString('hex'),
      email,
      passwordHash: await hashPassword(password),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    await writeJsonDataFile(usersFile, users);

    const token = generateSessionToken();
    const sessions = await readSessions();
    sessions.push({ tokenHash: hashToken(token), userId: newUser.id, createdAt: new Date().toISOString(), expiresAt: Date.now() + SESSION_TTL_MS });
    await writeJsonDataFile(sessionsFile, sessions);
    res.status(201).json({ ok: true, token, user: { id: newUser.id, email: newUser.email } });
  } catch {
    res.status(500).json({ error: 'register-failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase().slice(0, 200) : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!email || !password) {
      res.status(400).json({ error: 'missing-credentials' });
      return;
    }
    const users = await readUsers();
    const user = users.find(u => u.email === email);
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      res.status(401).json({ error: 'invalid-credentials' });
      return;
    }
    const token = generateSessionToken();
    const sessions = await readSessions();
    sessions.push({ tokenHash: hashToken(token), userId: user.id, createdAt: new Date().toISOString(), expiresAt: Date.now() + SESSION_TTL_MS });
    await writeJsonDataFile(sessionsFile, sessions);
    res.json({ ok: true, token, user: { id: user.id, email: user.email } });
  } catch {
    res.status(500).json({ error: 'login-failed' });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  try {
    const authHeader = typeof req.get('authorization') === 'string' ? req.get('authorization').trim() : '';
    const bearerPrefix = 'Bearer ';
    if (authHeader.startsWith(bearerPrefix)) {
      const token = authHeader.slice(bearerPrefix.length).trim();
      const sessions = await readSessions();
      await writeJsonDataFile(sessionsFile, sessions.filter(s => s.tokenHash !== hashToken(token)));
    }
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'logout-failed' });
  }
});

app.get('/api/auth/me', requireUserAuth, (req, res) => {
  res.json({ ok: true, user: { id: req.user.id, email: req.user.email } });
});

// --- Account state sync ---

app.get('/api/account/state', requireUserAuth, async (req, res) => {
  try {
    const states = await readAccountStates();
    res.json({ ok: true, state: states[req.user.id] || null });
  } catch {
    res.status(500).json({ error: 'account-state-read-failed' });
  }
});

app.put('/api/account/state', requireUserAuth, async (req, res) => {
  try {
    const body = req.body || {};
    const safeState = {
      quitDate: typeof body.quitDate === 'string' ? body.quitDate.trim().slice(0, 40) : '',
      cigsPerDay: Number(body.cigsPerDay) || 0,
      cigsPerPack: Number(body.cigsPerPack) || 0,
      pricePerPack: Number(body.pricePerPack) || 0,
      goalName: typeof body.goalName === 'string' ? body.goalName.trim().slice(0, 150) : '',
      goalAmount: Number(body.goalAmount) || 0,
      trackingState: {
        isPaused: Boolean(body.trackingState?.isPaused),
        pauseStartedAt: typeof body.trackingState?.pauseStartedAt === 'string' ? body.trackingState.pauseStartedAt.slice(0, 40) : null,
        pausedDaysTotal: Number(body.trackingState?.pausedDaysTotal) || 0,
      },
      notificationPrefs: (typeof body.notificationPrefs === 'object' && body.notificationPrefs !== null) ? body.notificationPrefs : {},
      updatedAt: new Date().toISOString(),
    };
    const states = await readAccountStates();
    states[req.user.id] = safeState;
    await writeJsonDataFile(accountStatesFile, states);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'account-state-save-failed' });
  }
});

// --- Analytics ---

app.post('/api/analytics', async (req, res) => {
  try {
    const incomingEvents = Array.isArray(req.body?.events) ? req.body.events : [];
    if (incomingEvents.length === 0) {
      res.json({ ok: true, saved: 0 });
      return;
    }
    const sanitized = incomingEvents.slice(0, 200).map(e => ({
      name: typeof e.name === 'string' ? e.name.trim().slice(0, 80) : 'unknown',
      meta: (typeof e.meta === 'object' && e.meta !== null) ? e.meta : {},
      clientId: typeof e.clientId === 'string' ? e.clientId.trim().slice(0, 80) : '',
      at: typeof e.at === 'string' ? e.at.slice(0, 40) : new Date().toISOString(),
      receivedAt: new Date().toISOString(),
      userAgent: (req.get('user-agent') || '').slice(0, 200),
    }));
    const existing = await readAnalyticsEvents();
    const combined = [...existing, ...sanitized];
    const MAX_STORED = 50000;
    await writeJsonDataFile(analyticsFile, combined.length > MAX_STORED ? combined.slice(combined.length - MAX_STORED) : combined);
    res.json({ ok: true, saved: sanitized.length });
  } catch {
    res.status(500).json({ error: 'analytics-save-failed' });
  }
});

app.get('/api/analytics/export', requireAdminAuth, async (req, res) => {
  try {
    const events = await readAnalyticsEvents();
    res.json({ ok: true, count: events.length, events });
  } catch {
    res.status(500).json({ error: 'analytics-export-failed' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

Promise.all([ensureDataFile(), ensureFeedbackFile(), ensureUserStatesCsvFile(), ensureUserStatesXlsxFile()]).then(() => {
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  
  // Handle port already in use - try next port
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      console.warn(`Port ${port} is already in use, trying ${nextPort}...`);
      const retryServer = app.listen(nextPort, () => {
        console.log(`Server running on http://localhost:${nextPort}`);
      });
      retryServer.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.error(`Ports ${port} and ${nextPort} are both in use. Please free a port or set PORT env var.`);
          process.exit(1);
        }
        throw err;
      });
    } else {
      throw error;
    }
  });

  setInterval(() => {
    sendScheduledNotifications().catch(error => console.error('Scheduled push failed', error));
  }, 60 * 1000);
}).catch(error => {
  console.error('Server start failed', error);
  process.exit(1);
});

