const fs = require('fs');
const code = fs.readFileSync('downloaded_bundle.js', 'utf8');

const emIdx = code.indexOf('function Em(');
console.log('function Em idx:', emIdx);
if (emIdx !== -1) {
  console.log(code.substring(emIdx, emIdx + 500));
}
