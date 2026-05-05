/**
 * Tests unitaires — fonctions critiques du serveur et du service worker.
 * Lancement : node scripts/test-unit.js
 */
'use strict';

const assert = require('assert');

let passed = 0;
let failed = 0;

function test(label, fn) {
  try {
    fn();
    console.log(`  PASS  ${label}`);
    passed++;
  } catch (err) {
    console.error(`  FAIL  ${label}`);
    console.error(`        ${err.message}`);
    failed++;
  }
}

// ---------------------------------------------------------------------------
// Copie locale des fonctions testées (identiques à server.js)
// ---------------------------------------------------------------------------

function isValidPushEndpoint(endpoint) {
  try {
    const url = new URL(endpoint);
    if (url.protocol !== 'https:') return false;
    const hostname = url.hostname;
    if (hostname === 'localhost') return false;
    if (/^127\./.test(hostname)) return false;
    if (/^10\./.test(hostname)) return false;
    if (/^192\.168\./.test(hostname)) return false;
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(hostname)) return false;
    if (/^::1$/.test(hostname)) return false;
    if (/^0\./.test(hostname)) return false;
    return hostname.includes('.');
  } catch {
    return false;
  }
}

function parseTimeToMinutes(value, fallbackMinutes) {
  const match = /^(\d{2}):(\d{2})$/.exec(String(value || '').trim());
  if (!match) return fallbackMinutes;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return fallbackMinutes;
  }
  return (hours * 60) + minutes;
}

function isWithinQuietHours(localDate, quietStart, quietEnd) {
  const startMinutes = parseTimeToMinutes(quietStart, 21 * 60 + 30);
  const endMinutes = parseTimeToMinutes(quietEnd, 8 * 60);
  if (startMinutes === endMinutes) return false;
  const nowMinutes = (localDate.getHours() * 60) + localDate.getMinutes();
  if (startMinutes < endMinutes) {
    return nowMinutes >= startMinutes && nowMinutes < endMinutes;
  }
  return nowMinutes >= startMinutes || nowMinutes < endMinutes;
}

function isAllowedDayByFrequency(localDate, frequency, weeklyDay) {
  const day = localDate.getDay();
  if (frequency === 'weekdays') return day >= 1 && day <= 5;
  if (frequency === 'weekly') return day === Number(weeklyDay);
  return true;
}

function isNearReminderTime(localDate, reminderTime) {
  const reminderMinutes = parseTimeToMinutes(reminderTime, 9 * 60);
  const nowMinutes = (localDate.getHours() * 60) + localDate.getMinutes();
  return Math.abs(nowMinutes - reminderMinutes) <= 5;
}

function parsePositiveIntEnv(raw, fallback) {
  if (raw === undefined || raw === null || raw === '') return fallback;
  const parsed = Number.parseInt(String(raw), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

// ---------------------------------------------------------------------------
// Tests isValidPushEndpoint
// ---------------------------------------------------------------------------
console.log('\nisValidPushEndpoint');

test('accepts valid push service endpoint', () => {
  assert.strictEqual(isValidPushEndpoint('https://fcm.googleapis.com/fcm/send/abc123'), true);
});
test('accepts valid mozilla push endpoint', () => {
  assert.strictEqual(isValidPushEndpoint('https://updates.push.services.mozilla.com/push/v1/abc'), true);
});
test('rejects http endpoint', () => {
  assert.strictEqual(isValidPushEndpoint('http://example.com/push'), false);
});
test('rejects localhost', () => {
  assert.strictEqual(isValidPushEndpoint('https://localhost/push'), false);
});
test('rejects 127.0.0.1', () => {
  assert.strictEqual(isValidPushEndpoint('https://127.0.0.1/push'), false);
});
test('rejects 192.168.x.x', () => {
  assert.strictEqual(isValidPushEndpoint('https://192.168.1.100/push'), false);
});
test('rejects 10.x.x.x', () => {
  assert.strictEqual(isValidPushEndpoint('https://10.0.0.1/push'), false);
});
test('rejects 172.16.x.x (private range)', () => {
  assert.strictEqual(isValidPushEndpoint('https://172.16.0.1/push'), false);
});
test('rejects 172.31.x.x (private range)', () => {
  assert.strictEqual(isValidPushEndpoint('https://172.31.255.255/push'), false);
});
test('accepts 172.32.x.x (public range)', () => {
  assert.strictEqual(isValidPushEndpoint('https://172.32.0.1/push'), true);
});
test('rejects garbage string', () => {
  assert.strictEqual(isValidPushEndpoint('not-a-url'), false);
});
test('rejects empty string', () => {
  assert.strictEqual(isValidPushEndpoint(''), false);
});

// ---------------------------------------------------------------------------
// Tests parseTimeToMinutes
// ---------------------------------------------------------------------------
console.log('\nparseTimeToMinutes');

test('parses "09:00" correctly', () => {
  assert.strictEqual(parseTimeToMinutes('09:00', 0), 9 * 60);
});
test('parses "21:30" correctly', () => {
  assert.strictEqual(parseTimeToMinutes('21:30', 0), 21 * 60 + 30);
});
test('uses fallback for invalid format', () => {
  assert.strictEqual(parseTimeToMinutes('9:00', 999), 999);
});
test('uses fallback for out-of-range hours', () => {
  assert.strictEqual(parseTimeToMinutes('25:00', 999), 999);
});
test('uses fallback for out-of-range minutes', () => {
  assert.strictEqual(parseTimeToMinutes('09:60', 999), 999);
});

// ---------------------------------------------------------------------------
// Tests isWithinQuietHours
// ---------------------------------------------------------------------------
console.log('\nisWithinQuietHours');

function makeDate(h, m) {
  const d = new Date(2026, 0, 1, h, m, 0);
  return d;
}

test('returns true when inside quiet window (22:00 -> 08:00, now=23:00)', () => {
  assert.strictEqual(isWithinQuietHours(makeDate(23, 0), '22:00', '08:00'), true);
});
test('returns true when inside quiet window overnight (midnight)', () => {
  assert.strictEqual(isWithinQuietHours(makeDate(0, 30), '22:00', '08:00'), true);
});
test('returns false when outside quiet window (09:00)', () => {
  assert.strictEqual(isWithinQuietHours(makeDate(9, 0), '22:00', '08:00'), false);
});
test('returns false when start === end', () => {
  assert.strictEqual(isWithinQuietHours(makeDate(10, 0), '10:00', '10:00'), false);
});
test('returns true for daytime window (10:00->12:00, now=11:00)', () => {
  assert.strictEqual(isWithinQuietHours(makeDate(11, 0), '10:00', '12:00'), true);
});
test('returns false outside daytime window (now=13:00)', () => {
  assert.strictEqual(isWithinQuietHours(makeDate(13, 0), '10:00', '12:00'), false);
});

// ---------------------------------------------------------------------------
// Tests isAllowedDayByFrequency
// ---------------------------------------------------------------------------
console.log('\nisAllowedDayByFrequency');

// getDay(): 0=Sun, 1=Mon, ..., 5=Fri, 6=Sat
test('daily allows any day', () => {
  assert.strictEqual(isAllowedDayByFrequency(makeDate(10, 0), 'daily', 1), true);
});
test('weekdays allows Monday', () => {
  const monday = new Date(2026, 3, 27); // known Monday
  assert.strictEqual(isAllowedDayByFrequency(monday, 'weekdays', 0), true);
});
test('weekdays rejects Sunday', () => {
  const sunday = new Date(2026, 3, 26); // known Sunday
  assert.strictEqual(isAllowedDayByFrequency(sunday, 'weekdays', 0), false);
});
test('weekly allows correct day', () => {
  const monday = new Date(2026, 3, 27); // getDay()=1
  assert.strictEqual(isAllowedDayByFrequency(monday, 'weekly', 1), true);
});
test('weekly rejects wrong day', () => {
  const monday = new Date(2026, 3, 27); // getDay()=1
  assert.strictEqual(isAllowedDayByFrequency(monday, 'weekly', 3), false);
});

// ---------------------------------------------------------------------------
// Tests isNearReminderTime
// ---------------------------------------------------------------------------
console.log('\nisNearReminderTime');

test('returns true when exactly at reminder time', () => {
  assert.strictEqual(isNearReminderTime(makeDate(9, 0), '09:00'), true);
});
test('returns true within 5 min before', () => {
  assert.strictEqual(isNearReminderTime(makeDate(8, 55), '09:00'), true);
});
test('returns true within 5 min after', () => {
  assert.strictEqual(isNearReminderTime(makeDate(9, 5), '09:00'), true);
});
test('returns false when 6 min away', () => {
  assert.strictEqual(isNearReminderTime(makeDate(9, 6), '09:00'), false);
});

// ---------------------------------------------------------------------------
// Tests parsePositiveIntEnv
// ---------------------------------------------------------------------------
console.log('\nparsePositiveIntEnv');

test('returns parsed value for valid string', () => {
  assert.strictEqual(parsePositiveIntEnv('42', 10), 42);
});
test('returns fallback for empty string', () => {
  assert.strictEqual(parsePositiveIntEnv('', 10), 10);
});
test('returns fallback for zero', () => {
  assert.strictEqual(parsePositiveIntEnv('0', 10), 10);
});
test('returns fallback for negative', () => {
  assert.strictEqual(parsePositiveIntEnv('-5', 10), 10);
});
test('returns fallback for non-numeric', () => {
  assert.strictEqual(parsePositiveIntEnv('abc', 10), 10);
});
test('returns fallback for undefined', () => {
  assert.strictEqual(parsePositiveIntEnv(undefined, 10), 10);
});

// ---------------------------------------------------------------------------
// Résumé
// ---------------------------------------------------------------------------
console.log(`\n${'─'.repeat(40)}`);
console.log(`  ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
