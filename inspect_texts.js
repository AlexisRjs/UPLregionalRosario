const fs = require('fs');
const code = fs.readFileSync('downloaded_bundle.js', 'utf8');

// Search for modal titles, nav labels, footer text
console.log('--- SEARCHING LABELS & TEXTS ---');

const patterns = [
  /Universitarios por la Libertad/g,
  /Metodolog[ií]a/g,
  /Auditor[ií]as Universitarias/g,
  /Rankings/g,
  /Tasa de egreso/g,
  /Costo por graduado/g,
  /Sin materias/g
];

patterns.forEach(p => {
  const matches = [...code.matchAll(p)];
  console.log(`${p}: ${matches.length} matches`);
});

// Let's inspect some UI text blocks
function findContext(phrase, count = 2) {
  let idx = 0;
  let found = 0;
  console.log(`\n=== CONTEXT FOR "${phrase}" ===`);
  while ((idx = code.indexOf(phrase, idx)) !== -1 && found < count) {
    console.log(code.substring(Math.max(0, idx - 100), Math.min(code.length, idx + 300)));
    console.log('---');
    idx += phrase.length;
    found++;
  }
}

findContext('Metodología');
findContext('SPU');
findContext('serieEgresados');
findContext('rankings');
