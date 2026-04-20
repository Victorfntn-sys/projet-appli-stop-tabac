const required = [
  'VAPID_SUBJECT',
  'VAPID_PUBLIC_KEY',
  'VAPID_PRIVATE_KEY',
  'ADMIN_API_KEY',
  'TWA_PACKAGE_NAME',
  'TWA_SHA256_CERT_FINGERPRINTS',
];

const optional = [
  'FEEDBACK_WEBHOOK_URL',
  'EXPORT_ADMIN_KEY',
];

function isEmpty(value) {
  return !value || String(value).trim().length === 0;
}

function checkEnv() {
  const missing = required.filter(name => isEmpty(process.env[name]));

  console.log('Release preflight report');
  console.log('------------------------');

  if (missing.length > 0) {
    console.error('Missing required environment variables:');
    for (const name of missing) {
      console.error(`- ${name}`);
    }
    process.exitCode = 1;
  } else {
    console.log('All required environment variables are present.');
  }

  const emptyOptional = optional.filter(name => isEmpty(process.env[name]));
  if (emptyOptional.length > 0) {
    console.log('Optional variables not set:');
    for (const name of emptyOptional) {
      console.log(`- ${name}`);
    }
  }

  const fp = process.env.TWA_SHA256_CERT_FINGERPRINTS || '';
  if (fp && !fp.includes(':')) {
    console.warn('Warning: TWA_SHA256_CERT_FINGERPRINTS should usually be colon-separated SHA-256 values.');
  }

  if (!isEmpty(process.env.EXPORT_ADMIN_KEY) && process.env.EXPORT_ADMIN_KEY === process.env.ADMIN_API_KEY) {
    console.warn('Warning: EXPORT_ADMIN_KEY and ADMIN_API_KEY are identical. Consider using separate secrets.');
  }

  if (!process.exitCode) {
    console.log('Preflight passed.');
  }
}

checkEnv();
