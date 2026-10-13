const fs = require('fs');
const code = fs.readFileSync('downloaded_bundle.js', 'utf8');

// Find rosario: { ... }
const rosarioIdx = code.indexOf('rosario:{nombre:`Universidad Nacional de Rosario`');
if (rosarioIdx !== -1) {
  // Let's find the closing of rosario object
  const snippet = code.substring(rosarioIdx, rosarioIdx + 4000);
  console.log('UNR snippet:\n', snippet);
} else {
  console.log('Not exact match for rosario object start');
}

// Find all university keys
const matchKeys = code.match(/([a-z0-9_]+):\{nombre:`[^`]+`,sigla:`[^`]+`/g);
console.log('\nFound university keys count:', matchKeys ? matchKeys.length : 0);
if (matchKeys) {
  console.log('First 10 keys:', matchKeys.slice(0, 10));
}
