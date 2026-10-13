const fs = require('fs');
const code = fs.readFileSync('downloaded_bundle.js', 'utf8');

// Find where map is rendered in jsx
const mapRenderIdx = code.indexOf('viewBox');
console.log('viewBox occurrences:');
let idx = 0;
while ((idx = code.indexOf('viewBox', idx)) !== -1) {
  console.log(code.substring(idx - 50, idx + 250));
  console.log('---');
  idx += 7;
}
