const fs = require('fs');
const code = fs.readFileSync('downloaded_bundle.js', 'utf8');

function extractAround(term, len = 2000) {
  let idx = code.indexOf(term);
  console.log(`\n=================== SEARCH FOR "${term}" ===================`);
  while (idx !== -1) {
    console.log(code.substring(Math.max(0, idx - 100), Math.min(code.length, idx + len)));
    idx = code.indexOf(term, idx + len);
  }
}

extractAround('/propuestas');
extractAround('/presentacion');
