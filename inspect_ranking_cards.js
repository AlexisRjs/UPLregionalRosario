const fs = require('fs');
const code = fs.readFileSync('downloaded_bundle.js', 'utf8');

// Find "De peor a mejor"
const peorIdx = code.indexOf('De peor a mejor');
console.log('peorIdx:', peorIdx);
if (peorIdx !== -1) {
  console.log(code.substring(peorIdx - 200, peorIdx + 2000));
}
