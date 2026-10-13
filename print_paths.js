const fs = require('fs');
const code = fs.readFileSync('downloaded_bundle.js', 'utf8');

const sampleD = '349.09,124.41';
const idx = code.indexOf(sampleD);
console.log('Sample path in bundle idx:', idx);

if (idx !== -1) {
  // Let's print 500 chars before and 2000 chars after
  const before = code.substring(Math.max(0, idx - 500), idx);
  console.log('=== BEFORE ===\n', before);
  const after = code.substring(idx, idx + 1000);
  console.log('=== AFTER ===\n', after);
}
