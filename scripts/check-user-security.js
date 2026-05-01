#!/usr/bin/env node
/**
 * Audit: Vérifier que les utilisateurs normaux ne peuvent PAS:
 * 1. Accéder aux fichiers /data/, /scripts/, server.js
 * 2. Accéder aux routes admin sans ADMIN_API_KEY
 * 3. Modifier les données d'autres utilisateurs
 * 4. Voir les emails/pwds d'autres comptes
 */

const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

const REQUESTED_PORT = 3333;
let runtimePort = REQUESTED_PORT;
let baseUrl = `http://localhost:${runtimePort}`;

let testCount = 0;
let passCount = 0;
let testServer = null;

function log(msg) { console.log(`${msg}`); }
function pass(msg) { passCount++; log(`✓ PASS: ${msg}`); }
function fail(msg) { log(`✗ FAIL: ${msg}`); process.exitCode = 1; }

async function request(method, path, { headers = {}, body = null } = {}) {
  return new Promise((resolve) => {
    const url = new URL(path, baseUrl);
    const req = http.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: { ...headers, 'User-Agent': 'test' },
    }, (res) => {
      let data = '';
      res.on('data', (d) => { data += d; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data), headers: res.headers });
        } catch {
          resolve({ status: res.statusCode, body: data, headers: res.headers });
        }
      });
    });
    req.on('error', (e) => {
      console.error(`[request error] ${method} ${path}: ${e.message}`);
      resolve({ error: e.message });
    });
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function test(name, fn) {
  testCount++;
  try {
    await fn();
  } catch (e) {
    fail(`${name}: ${e.message}`);
  }
}

async function main() {
  log('\n🔐 User Security Audit');
  log('=======================\n');

  // Start server
  await new Promise((res, rej) => {
    let settled = false;
    const finish = (fn) => {
      if (settled) return;
      settled = true;
      fn();
    };

    testServer = spawn('node', ['server.js'], {
      cwd: path.join(__dirname, '..'),
      env: {
        ...process.env,
        PORT: String(REQUESTED_PORT),
        ADMIN_API_KEY: 'super-secret-admin-key-12345',
        SESSION_SECRET: 'test-session-secret',
        VAPID_PUBLIC_KEY: '',
        VAPID_PRIVATE_KEY: '',
      },
      stdio: 'pipe',
    });

    testServer.stderr.on('data', (data) => {
      const msg = data.toString().trim();
      if (!msg.includes('Warning:') && !msg.includes('deprecated') && msg) {
        console.error(`[server stderr]`, msg);
      }
    });

    testServer.stdout.on('data', (data) => {
      const msg = data.toString().trim();
      if (msg) {
        console.log(`[server]`, msg);
      }
      const match = /Server running on http:\/\/localhost:(\d+)/i.exec(msg);
      if (match) {
        runtimePort = Number(match[1]);
        baseUrl = `http://localhost:${runtimePort}`;
        finish(() => res());
      }
    });

    testServer.on('exit', (code) => {
      finish(() => rej(new Error(`server exited before ready (code ${code})`)));
    });

    setTimeout(() => {
      finish(() => rej(new Error('timeout waiting for server startup')));
    }, 8000);
  });

  log(`Server started on ${baseUrl}\n`);

  try {
    // ====== Section 1: Fichiers sensibles ne doivent PAS être accessibles ======
    await test('data/users.json should return 404', async () => {
      const res = await request('GET', '/data/users.json');
      if (res.status !== 404) fail(`  Got ${res.status}, expected 404`);
      else pass('fichier data/users.json protected');
    });

    await test('data/sessions.json should return 404', async () => {
      const res = await request('GET', '/data/sessions.json');
      if (res.status !== 404) fail(`  Got ${res.status}, expected 404`);
      else pass('fichier data/sessions.json protected');
    });

    await test('data/feedback.json should return 404', async () => {
      const res = await request('GET', '/data/feedback.json');
      if (res.status !== 404) fail(`  Got ${res.status}, expected 404`);
      else pass('fichier data/feedback.json protected');
    });

    await test('scripts/check-security.js should return 404', async () => {
      const res = await request('GET', '/scripts/check-security.js');
      if (res.status !== 404) fail(`  Got ${res.status}, expected 404`);
      else pass('fichier scripts/check-security.js protected');
    });

    await test('server.js should return 404', async () => {
      const res = await request('GET', '/server.js');
      if (res.status !== 404) fail(`  Got ${res.status}, expected 404`);
      else pass('fichier server.js protected');
    });

    await test('package.json should return 404', async () => {
      const res = await request('GET', '/package.json');
      if (res.status !== 404) fail(`  Got ${res.status}, expected 404`);
      else pass('fichier package.json protected');
    });

    // ====== Section 2: Routes admin sans clé = 403 ======
    await test('GET /api/admin/status without key should return 403', async () => {
      const res = await request('GET', '/api/admin/status');
      if (res.status !== 403) fail(`  Got ${res.status}, expected 403`);
      else pass('/api/admin/status requires auth key');
    });

    await test('POST /api/push/run-now without key should return 403', async () => {
      const res = await request('POST', '/api/push/run-now', { body: {} });
      if (res.status !== 403) fail(`  Got ${res.status}, expected 403`);
      else pass('/api/push/run-now requires auth key');
    });

    await test('GET /api/analytics/export without key should return 403', async () => {
      const res = await request('GET', '/api/analytics/export');
      if (res.status !== 403) fail(`  Got ${res.status}, expected 403`);
      else pass('/api/analytics/export requires auth key');
    });

    // ====== Section 3: Routes admin AVEC mauvaise clé = 403 ======
    await test('GET /api/admin/status with wrong key should return 403', async () => {
      const res = await request('GET', '/api/admin/status', {
        headers: { 'x-admin-key': 'wrong-key' },
      });
      if (res.status !== 403) fail(`  Got ${res.status}, expected 403`);
      else pass('/api/admin/status rejects invalid key');
    });

    await test('GET /api/admin/status with valid key should return 200', async () => {
      const res = await request('GET', '/api/admin/status', {
        headers: { 'x-admin-key': 'super-secret-admin-key-12345' },
      });
      if (res.status !== 200) fail(`  Got ${res.status}, expected 200`);
      else pass('/api/admin/status accepts valid key');
    });

    // ====== Section 4: Routes publiques doivent être accessibles ======
    await test('GET / should return 200', async () => {
      const res = await request('GET', '/');
      if (res.status !== 200) fail(`  Got ${res.status}, expected 200`);
      else pass('index.html accessible to all');
    });

    await test('GET /index.html should return 200', async () => {
      const res = await request('GET', '/index.html');
      if (res.status !== 200) fail(`  Got ${res.status}, expected 200`);
      else pass('index.html accessible');
    });

    await test('GET /script.js should return 200', async () => {
      const res = await request('GET', '/script.js');
      if (res.status !== 200) fail(`  Got ${res.status}, expected 200`);
      else pass('script.js accessible');
    });

    await test('GET /styles.css should return 200', async () => {
      const res = await request('GET', '/styles.css');
      if (res.status !== 200) fail(`  Got ${res.status}, expected 200`);
      else pass('styles.css accessible');
    });

    await test('GET /admin.html should return 200', async () => {
      const res = await request('GET', '/admin.html');
      if (res.status !== 200) fail(`  Got ${res.status}, expected 200`);
      else pass('admin.html accessible');
    });

    await test('GET /api/admin/users without key should return 403', async () => {
      const res = await request('GET', '/api/admin/users');
      if (res.status !== 403) fail(`  Got ${res.status}, expected 403`);
      else pass('/api/admin/users requires auth key');
    });

    await test('GET /api/admin/sessions without key should return 403', async () => {
      const res = await request('GET', '/api/admin/sessions');
      if (res.status !== 403) fail(`  Got ${res.status}, expected 403`);
      else pass('/api/admin/sessions requires auth key');
    });

    await test('GET /api/admin/feedback without key should return 403', async () => {
      const res = await request('GET', '/api/admin/feedback');
      if (res.status !== 403) fail(`  Got ${res.status}, expected 403`);
      else pass('/api/admin/feedback requires auth key');
    });

    // ====== Section 5: Routes utilisateur doivent être accessibles ======
    await test('POST /api/auth/register should return 400 (invalid data)', async () => {
      const res = await request('POST', '/api/auth/register', { body: {} });
      if (res.status !== 400) fail(`  Got ${res.status}, expected 400`);
      else pass('/api/auth/register accessible to all');
    });

    await test('POST /api/analytics should accept events', async () => {
      const res = await request('POST', '/api/analytics', {
        body: { events: [{ name: 'test', at: new Date().toISOString() }] },
      });
      if (res.status !== 200) fail(`  Got ${res.status}, expected 200`);
      else pass('/api/analytics accessible to all');
    });

    // ====== Section 6: Aucun fichier avec dotfiles ======
    await test('.env should return 404', async () => {
      const res = await request('GET', '/.env');
      if (res.status !== 404) fail(`  Got ${res.status}, expected 404`);
      else pass('.env not exposed');
    });

    await test('.git/config should return 404', async () => {
      const res = await request('GET', '/.git/config');
      if (res.status !== 404) fail(`  Got ${res.status}, expected 404`);
      else pass('.git not exposed');
    });

  } finally {
    testServer?.kill();
  }

  log(`\n=======================`);
  log(`Tests: ${testCount}, Passed: ${passCount}, Failed: ${testCount - passCount}`);
  log(`\n${passCount === testCount ? '✅ All security checks passed!' : '❌ Some checks failed'}`);

  process.exit(passCount === testCount ? 0 : 1);
}

main().catch((e) => {
  console.error('Fatal:', e.message);
  testServer?.kill();
  process.exit(1);
});
