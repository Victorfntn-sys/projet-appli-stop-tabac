const { spawn } = require('child_process');
const net = require('net');

const appRoot = require('path').resolve(__dirname, '..');
const preferredPort = Number(process.env.SECURITY_CHECK_PORT || 3310);
let selectedPort = preferredPort;
const adminKey = (process.env.ADMIN_API_KEY || 'security-check-admin-key').trim();

function getBaseUrl() {
  return `http://127.0.0.1:${selectedPort}`;
}

function findAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.unref();
    server.on('error', reject);
    server.listen(startPort, '127.0.0.1', () => {
      const address = server.address();
      const openPort = typeof address === 'object' && address ? address.port : startPort;
      server.close(error => {
        if (error) {
          reject(error);
          return;
        }
        resolve(openPort);
      });
    });
  });
}

function pass(label) {
  console.log(`PASS ${label}`);
}

function fail(label, details) {
  console.error(`FAIL ${label}${details ? ` - ${details}` : ''}`);
  process.exitCode = 1;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForServerReady(maxAttempts = 40) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const response = await fetch(`${getBaseUrl()}/healthz`);
      if (response.ok) {
        return true;
      }
    } catch {
      // Server not ready yet.
    }
    await sleep(250);
  }
  return false;
}

async function request(pathname, options = {}) {
  const response = await fetch(`${getBaseUrl()}${pathname}`, options);
  const bodyText = await response.text();
  let json = null;
  try {
    json = JSON.parse(bodyText);
  } catch {
    json = null;
  }
  return { response, bodyText, json };
}

async function expectRateLimit(label, attempts, requestFactory) {
  let sawRateLimit = false;

  for (let index = 0; index < attempts; index += 1) {
    const currentAttempt = await requestFactory(index);
    if (currentAttempt.response.status === 429) {
      sawRateLimit = true;
      break;
    }
  }

  if (sawRateLimit) {
    pass(label);
  } else {
    fail(label, 'no 429 observed after burst traffic');
  }
}

async function runChecks() {
  const staticData = await request('/data/subscriptions.json');
  if (staticData.response.status === 404) {
    pass('data files are not publicly exposed');
  } else {
    fail('data files are not publicly exposed', `status=${staticData.response.status}`);
  }

  const serverSource = await request('/server.js');
  if (serverSource.response.status === 404) {
    pass('server source is not publicly exposed');
  } else {
    fail('server source is not publicly exposed', `status=${serverSource.response.status}`);
  }

  const queryKeyAttempt = await request(`/api/admin/status?key=${encodeURIComponent(adminKey)}`);
  if (queryKeyAttempt.response.status === 403) {
    pass('admin query-string key is rejected');
  } else {
    fail('admin query-string key is rejected', `status=${queryKeyAttempt.response.status}`);
  }

  const headerKeyAttempt = await request('/api/admin/status', {
    headers: {
      'x-admin-key': adminKey,
    },
  });
  if (headerKeyAttempt.response.ok && headerKeyAttempt.json?.ok === true) {
    pass('admin header key is accepted');
  } else {
    fail('admin header key is accepted', `status=${headerKeyAttempt.response.status}`);
  }

  await expectRateLimit('feedback endpoint is rate-limited', 12, index => request('/api/feedback', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      message: `security-check-message-${index}-valid`,
      contact: 'security-check@example.test',
      clientId: `security-check-client-${index}`,
    }),
  }));

  await expectRateLimit('user-state endpoint is rate-limited', 12, index => request('/api/user-state', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      clientId: `security-check-user-state-${index}`,
      quitDate: '2026-01-01',
      cigsPerDay: 10,
      cigsPerPack: 20,
      pricePerPack: 12,
    }),
  }));

  await expectRateLimit('push-state endpoint is rate-limited', 12, index => request('/api/push/state', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      endpoint: `https://example.invalid/subscription-${index}`,
      userState: {
        clientId: `security-check-push-${index}`,
      },
    }),
  }));
}

async function main() {
  console.log('Security checks (local)');
  console.log('-----------------------');

  selectedPort = await findAvailablePort(preferredPort);

  const serverProcess = spawn('node', ['server.js'], {
    cwd: appRoot,
    env: {
      ...process.env,
      PORT: String(selectedPort),
      ADMIN_API_KEY: adminKey,
      VAPID_SUBJECT: '',
      VAPID_PUBLIC_KEY: '',
      VAPID_PRIVATE_KEY: '',
      RATE_LIMIT_WINDOW_MS: '60000',
      RATE_LIMIT_FEEDBACK_MAX_REQUESTS: '5',
      RATE_LIMIT_USER_STATE_MAX_REQUESTS: '5',
      RATE_LIMIT_PUSH_MAX_REQUESTS: '5',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  serverProcess.stdout.on('data', chunk => process.stdout.write(String(chunk)));
  serverProcess.stderr.on('data', chunk => process.stderr.write(String(chunk)));

  try {
    const ready = await waitForServerReady();
    if (!ready) {
      fail('server startup', 'healthz did not become ready in time');
      return;
    }

    pass('server startup');
    await runChecks();
  } finally {
    if (!serverProcess.killed) {
      serverProcess.kill();
    }
  }
}

main().catch(error => {
  console.error(error?.stack || error?.message || String(error));
  process.exit(1);
});
