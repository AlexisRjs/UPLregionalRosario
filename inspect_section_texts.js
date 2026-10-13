const fs = require('fs');
const code = fs.readFileSync('downloaded_bundle.js', 'utf8');

// Let's find occurrences of strings in Propuestas
function searchSection(title, len=1500) {
  let idx = 0;
  console.log(`\n================= SEARCH "${title}" =================`);
  while ((idx = code.indexOf(title, idx)) !== -1) {
    console.log(code.substring(Math.max(0, idx - 50), Math.min(code.length, idx + len)));
    idx += title.length + 500;
  }
}

searchSection('propuestas de reforma');
searchSection('Presentación');
searchSection('Universitarios por la Libertad');
