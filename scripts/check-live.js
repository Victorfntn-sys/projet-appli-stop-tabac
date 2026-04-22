const baseUrl = (process.env.APP_BASE_URL || process.argv[2] || '').trim().replace(/\/$/, '');
const adminKey = (process.env.ADMIN_API_KEY || '').trim();

if (!baseUrl) {
  console.error('Usage: APP_BASE_URL=https://your-app.onrender.com npm run check:live');
  process.exit(1);
}

async function getJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  let json = null;

  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }

  return {
    ok: response.ok,
    status: response.status,
    contentType: response.headers.get('content-type') || '',
    text,
    json,
  };
}

function pass(label) {
  console.log(`PASS ${label}`);
}

function fail(label, details) {
  console.error(`FAIL ${label}${details ? ` - ${details}` : ''}`);
  process.exitCode = 1;
}

async function main() {
  console.log(`Live validation for ${baseUrl}`);
  console.log('--------------------------------');

  const health = await getJson(`${baseUrl}/healthz`);
  if (!health.ok || !health.json?.ok) {
    fail('/healthz', `status=${health.status}`);
  } else {
    pass('/healthz reachable');
    if (health.json.vapidConfigured) {
      pass('/healthz vapidConfigured=true');
    } else {
      fail('/healthz vapidConfigured', 'expected true');
    }
  }

  const manifest = await getJson(`${baseUrl}/manifest.webmanifest`);
  if (!manifest.ok || !manifest.json?.name) {
    fail('/manifest.webmanifest', `status=${manifest.status}`);
  } else {
    pass('/manifest.webmanifest reachable');
  }

  const privacy = await fetch(`${baseUrl}/privacy.html`);
  if (!privacy.ok) {
    fail('/privacy.html', `status=${privacy.status}`);
  } else {
    pass('/privacy.html reachable');
  }

  const assetlinks = await getJson(`${baseUrl}/.well-known/assetlinks.json`);
  if (!assetlinks.ok) {
    fail('/.well-known/assetlinks.json', `status=${assetlinks.status}`);
  } else if (!assetlinks.contentType.includes('application/json')) {
    fail('/.well-known/assetlinks.json content-type', assetlinks.contentType || 'missing');
  } else if (!Array.isArray(assetlinks.json) || !assetlinks.json[0]?.target?.package_name) {
    fail('/.well-known/assetlinks.json payload', 'invalid JSON structure');
  } else {
    pass('/.well-known/assetlinks.json reachable');
  }

  if (adminKey) {
    const admin = await getJson(`${baseUrl}/api/admin/status`, {
      headers: { 'x-admin-key': adminKey },
    });

    if (!admin.ok) {
      fail('/api/admin/status', `status=${admin.status}`);
    } else if (!admin.contentType.includes('application/json')) {
      fail('/api/admin/status content-type', admin.contentType || 'missing');
    } else if (!admin.json?.ok) {
      fail('/api/admin/status payload', 'invalid JSON structure');
    } else {
      pass('/api/admin/status reachable');
      if (admin.json.adminConfigured) {
        pass('/api/admin/status adminConfigured=true');
      } else {
        fail('/api/admin/status adminConfigured', 'expected true');
      }
      if (admin.json.assetLinksConfigured) {
        pass('/api/admin/status assetLinksConfigured=true');
      } else {
        fail('/api/admin/status assetLinksConfigured', 'expected true');
      }
    }
  } else {
    console.log('SKIP /api/admin/status (ADMIN_API_KEY not provided)');
  }

  if (!process.exitCode) {
    console.log('--------------------------------');
    console.log('Live validation passed.');
  }
}

main().catch(error => {
  console.error(error.message || error);
  process.exit(1);
});
