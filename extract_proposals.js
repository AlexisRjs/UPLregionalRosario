const fs = require('fs');
const code = fs.readFileSync('downloaded_bundle.js', 'utf8');

// Find proposals array
const propIdx = code.indexOf('Qué proponemos');
if (propIdx !== -1) {
  console.log('Context around Qué proponemos:\n', code.substring(propIdx - 1000, propIdx + 1500));
}

// Search for Becas AvanzAR or regularidad
const avanzIdx = code.indexOf('AvanzAR');
if (avanzIdx !== -1) {
  console.log('\nContext around AvanzAR:\n', code.substring(avanzIdx - 200, avanzIdx + 800));
}
