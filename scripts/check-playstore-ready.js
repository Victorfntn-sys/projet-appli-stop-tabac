#!/usr/bin/env node

const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const strictMode = process.argv.includes('--strict');

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

function isValidPackageId(value) {
  return typeof value === 'string' && /^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+$/i.test(value);
}

function readPngDimensions(relPath) {
  const filePath = path.join(root, relPath);
  const buffer = fsSync.readFileSync(filePath);
  if (buffer.length < 24) {
    throw new Error('invalid-png');
  }
  const signature = buffer.subarray(0, 8).toString('hex');
  if (signature !== '89504e470d0a1a0a') {
    throw new Error('invalid-png-signature');
  }
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return { width, height };
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
    if (isValidPackageId(twaManifest.packageId)) {
      pass('twa packageId is set');
    } else {
      fail('twa packageId missing or invalid');
    }

    if (typeof twaManifest.host === 'string' && twaManifest.host.trim().length > 0) {
      pass('twa host is set');
    } else {
      fail('twa host is missing');
    }

    if (String(twaManifest.host || '').includes('localhost')) {
      fail('twa host cannot be localhost for Play Store');
    } else {
      pass('twa host is not localhost');
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

    if (Number.isInteger(twaManifest.appVersionCode) && twaManifest.appVersionCode > 0) {
      pass('twa appVersionCode is a positive integer');
    } else {
      fail('twa appVersionCode must be a positive integer');
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

    const startUrl = String(webManifest.start_url || '');
    if (startUrl.includes('index.html')) {
      pass('web manifest start_url points to index.html');
    } else {
      warn('web manifest start_url is unusual (expected index.html)');
    }
  }

  try {
    const icon192 = readPngDimensions('icon-192.png');
    if (icon192.width === 192 && icon192.height === 192) {
      pass('icon-192.png dimensions are exactly 192x192');
    } else {
      fail(`icon-192.png dimensions must be 192x192 (found ${icon192.width}x${icon192.height})`);
    }
  } catch {
    fail('icon-192.png cannot be parsed as PNG');
  }

  try {
    const icon512 = readPngDimensions('icon-512.png');
    if (icon512.width === 512 && icon512.height === 512) {
      pass('icon-512.png dimensions are exactly 512x512');
    } else {
      fail(`icon-512.png dimensions must be 512x512 (found ${icon512.width}x${icon512.height})`);
    }
  } catch {
    fail('icon-512.png cannot be parsed as PNG');
  }

  if (process.env.ADMIN_API_KEY) {
    pass('ADMIN_API_KEY is set in current environment');
  } else {
    strictMode
      ? fail('ADMIN_API_KEY is not set in current environment (required in strict mode)')
      : warn('ADMIN_API_KEY is not set in current environment (required in production)');
  }

  if (process.env.TWA_PACKAGE_NAME && process.env.TWA_SHA256_CERT_FINGERPRINTS) {
    pass('TWA_PACKAGE_NAME and TWA_SHA256_CERT_FINGERPRINTS are set');
  } else {
    strictMode
      ? fail('TWA_PACKAGE_NAME / TWA_SHA256_CERT_FINGERPRINTS not set in strict mode')
      : warn('TWA_PACKAGE_NAME / TWA_SHA256_CERT_FINGERPRINTS not set in current environment');
  }

  console.log('--------------------------');
  if (hasFailure) {
    console.error('Play Store readiness: FAILED');
    process.exit(1);
  }

  if (hasWarning) {
    console.log(`Play Store readiness: PASS with warnings${strictMode ? ' (strict mode not enforced on warnings)' : ''}`);
    process.exit(0);
  }

  console.log('Play Store readiness: PASS');
}

main().catch(() => {
  console.error('Play Store readiness: FAILED (unexpected error)');
  process.exit(1);
});
