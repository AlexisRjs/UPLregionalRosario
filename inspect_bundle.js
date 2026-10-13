const fs = require('fs');

const code = fs.readFileSync('downloaded_bundle.js', 'utf8');
console.log('Bundle length:', code.length);

// Search for keywords
const keywords = ['universidades', 'Universidad Nacional de Rosario', 'UNR', 'costoPorGraduado', 'egresados', 'estudiantes', 'materias'];

for (const kw of keywords) {
  let idx = code.indexOf(kw);
  console.log(`Keyword "${kw}": found at index ${idx}`);
  if (idx !== -1) {
    console.log(`Context:`, code.substring(Math.max(0, idx - 150), Math.min(code.length, idx + 250)));
    console.log('-----------------------------------');
  }
}
