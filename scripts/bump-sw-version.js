/**
 * Bumps the CACHE_NAME version in sw.js to prevent stale cache after deployments.
 * Uses the current date (YYYYMMDD) + hour as version string.
 * Run: node scripts/bump-sw-version.js
 * Or add to deploy: npm run bump-sw && git add sw.js
 */
const fs = require('fs');
const path = require('path');

const swPath = path.join(__dirname, '..', 'sw.js');
const content = fs.readFileSync(swPath, 'utf8');

const now = new Date();
const version = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}`;
const newCacheName = `stop-smoking-cache-v${version}`;

const updated = content.replace(
  /const CACHE_NAME = 'stop-smoking-cache-v[^']+';/,
  `const CACHE_NAME = '${newCacheName}';`
);

if (updated === content) {
  console.log('sw.js: CACHE_NAME pattern not found, nothing changed.');
  process.exit(1);
}

fs.writeFileSync(swPath, updated, 'utf8');
console.log(`sw.js: CACHE_NAME updated to '${newCacheName}'`);
