#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');

const root = path.join(__dirname, '..');

let hasFailure = false;
let hasWarning = false;

function pass(label) {
  console.log(`PASS ${label}`);
}

function warn(label) {
  hasWarning = true;
  console.log(`WARN ${label}`);
}

function fail(label) {
  hasFailure = true;
  console.error(`FAIL ${label}`);
}

async function exists(relPath) {
  try {
    await fs.access(path.join(root, relPath));
    return true;
  } catch {
    return false;
  }
}

async function readJson(relPath) {
  const fullPath = path.join(root, relPath);
  const raw = await fs.readFile(fullPath, 'utf8');
  return JSON.parse(raw);
}

function isHttpsUrl(value) {
  return typeof value === 'string' && /^https:\/\//i.test(value);
}

async function main() {
  console.log('\nPlay Store readiness checks');
  console.log('--------------------------');

  const requiredFiles = [
    'twa-manifest.json',
    'manifest.webmanifest',
    'icon-192.png',
    'icon-512.png',
    'privacy.html',
    'build-android.ps1',
    'PLAYSTORE_DEPLOYMENT.md',
  ];

  for (const file of requiredFiles) {
    if (await exists(file)) {
      pass(`${file} exists`);
    } else {
      fail(`${file} is missing`);
    }
  }

  let twaManifest = null;
  let webManifest = null;

  try {
    twaManifest = await readJson('twa-manifest.json');
    pass('twa-manifest.json is valid JSON');
  } catch {
    fail('twa-manifest.json is not valid JSON');
  }

  try {
    webManifest = await readJson('manifest.webmanifest');
    pass('manifest.webmanifest is valid JSON');
  } catch {
    fail('manifest.webmanifest is not valid JSON');
  }

  if (twaManifest) {
    if (typeof twaManifest.packageId === 'string' && twaManifest.packageId.includes('.')) {
      pass('twa packageId is set');
    } else {
      fail('twa packageId missing or invalid');
    }

    if (typeof twaManifest.host === 'string' && twaManifest.host.trim().length > 0) {
      pass('twa host is set');
    } else {
      fail('twa host is missing');
    }

    if (isHttpsUrl(twaManifest.webManifestUrl)) {
      pass('twa webManifestUrl uses HTTPS');
    } else {
      fail('twa webManifestUrl must use HTTPS');
    }

    if (isHttpsUrl(twaManifest.iconUrl)) {
      pass('twa iconUrl uses HTTPS');
    } else {
      fail('twa iconUrl must use HTTPS');
    }
  }

  if (webManifest) {
    if (webManifest.name && webManifest.short_name) {
      pass('web manifest name and short_name are set');
    } else {
      fail('web manifest missing name/short_name');
    }

    const icons = Array.isArray(webManifest.icons) ? webManifest.icons : [];
    const has192 = icons.some(icon => icon.sizes === '192x192');
    const has512 = icons.some(icon => icon.sizes === '512x512');

    if (has192 && has512) {
      pass('web manifest has 192x192 and 512x512 icons');
    } else {
      fail('web manifest must include 192x192 and 512x512 icons');
    }
  }

  if (process.env.ADMIN_API_KEY) {
    pass('ADMIN_API_KEY is set in current environment');
  } else {
    warn('ADMIN_API_KEY is not set in current environment (required in production)');
  }

  if (process.env.TWA_PACKAGE_NAME && process.env.TWA_SHA256_CERT_FINGERPRINTS) {
    pass('TWA_PACKAGE_NAME and TWA_SHA256_CERT_FINGERPRINTS are set');
  } else {
    warn('TWA_PACKAGE_NAME / TWA_SHA256_CERT_FINGERPRINTS not set in current environment');
  }

  console.log('--------------------------');
  if (hasFailure) {
    console.error('Play Store readiness: FAILED');
    process.exit(1);
  }

  if (hasWarning) {
    console.log('Play Store readiness: PASS with warnings');
    process.exit(0);
  }

  console.log('Play Store readiness: PASS');
}

main().catch(() => {
  console.error('Play Store readiness: FAILED (unexpected error)');
  process.exit(1);
});
