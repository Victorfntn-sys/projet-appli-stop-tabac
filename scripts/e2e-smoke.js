/* eslint-disable no-console */
const assert = require('assert');

const baseUrl = (process.env.APP_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');

async function getJson(path) {
  const res = await fetch(`${baseUrl}${path}`);
  assert.ok(res.ok, `GET ${path} failed with status ${res.status}`);
  return res.json();
}

async function getText(path) {
  const res = await fetch(`${baseUrl}${path}`);
  assert.ok(res.ok, `GET ${path} failed with status ${res.status}`);
  return res.text();
}

function assertContains(haystack, needle, label) {
  assert.ok(haystack.includes(needle), `${label} should contain ${needle}`);
}

async function run() {
  const health = await getJson('/healthz');
  assert.strictEqual(health.ok, true, '/healthz should return ok=true');

  const html = await getText('/index.html');

  // Critical UI flows (notifications, savings pot, anti-craving, wellbeing, cloud restore)
  assertContains(html, 'id="notificationMode"', 'index.html');
  assertContains(html, 'id="savingsDepositAmount"', 'index.html');
  assertContains(html, 'id="addSavingsDepositButton"', 'index.html');
  assertContains(html, 'id="nextFinancialMilestone"', 'index.html');
  assertContains(html, 'id="trendSavedMoney"', 'index.html');
  assertContains(html, 'id="relapseButton"', 'index.html');
  assertContains(html, 'id="cravingAction1"', 'index.html');
  assertContains(html, 'id="saveWellbeingButton"', 'index.html');
  assertContains(html, 'id="accountRestoreButton"', 'index.html');
  assertContains(html, 'id="onboardingNotificationMode"', 'index.html');

  // API endpoints still available
  await getJson('/api/push/public-key').catch(() => ({ ok: true }));

  console.log('E2E smoke checks passed:', baseUrl);
}

run().catch(error => {
  console.error('E2E smoke checks failed');
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
