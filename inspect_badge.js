const fs = require('fs');
const code = fs.readFileSync('downloaded_bundle.js', 'utf8');

const matches = [...code.matchAll(/sigla:[a-zA-Z0-9_.]+,size:[`'"][a-zA-Z0-9_-]+[`'"]/g)];
console.log('sigla and size matches:', matches.slice(0, 5));
if (matches.length > 0) {
  const idx = matches[0].index;
  console.log(code.substring(idx - 200, idx + 400));
}
