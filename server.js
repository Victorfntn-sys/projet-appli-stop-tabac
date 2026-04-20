require('dotenv').config();

const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const ExcelJS = require('exceljs');
const webPush = require('web-push');

const app = express();
const port = Number(process.env.PORT) || 3000;
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
const twaPackageName = process.env.TWA_PACKAGE_NAME || 'com.victorfntn.stoptabac';
const twaSha256Fingerprints = (process.env.TWA_SHA256_CERT_FINGERPRINTS || '')
  .split(',')
  .map(value => value.trim())
  .filter(Boolean);

if (vapidPublicKey && vapidPrivateKey) {
  webPush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

app.use(express.json());
app.use(express.static(__dirname));

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
  const nextSubscriptions = [];

  for (const record of subscriptions) {
    let keepRecord = true;
    const userState = record.userState || {};

    if (userState.isPaused && record.lastPausePushAt !== todayIso) {
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
    if (keepRecord && savedPacks > (record.lastNotifiedPackCount || 0)) {
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

app.post('/api/push/run-now', async (req, res) => {
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

app.get('/api/user-state/export-all', async (req, res) => {
  try {
    const providedKey = typeof req.query?.key === 'string' ? req.query.key.trim() : '';
    if (!exportAdminKey || providedKey !== exportAdminKey) {
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
    const providedKey = typeof req.query?.key === 'string' ? req.query.key.trim() : '';
    if (!exportAdminKey || providedKey !== exportAdminKey) {
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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

Promise.all([ensureDataFile(), ensureFeedbackFile(), ensureUserStatesCsvFile(), ensureUserStatesXlsxFile()]).then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  setInterval(() => {
    sendScheduledNotifications().catch(error => console.error('Scheduled push failed', error));
  }, 60 * 1000);
}).catch(error => {
  console.error('Server start failed', error);
  process.exit(1);
});

