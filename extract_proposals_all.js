const fs = require('fs');
const code = fs.readFileSync('downloaded_bundle.js', 'utf8');

// Find function wg()
const wgIdx = code.indexOf('function wg()');
if (wgIdx !== -1) {
  console.log(code.substring(wgIdx, wgIdx + 3500));
} else {
  // search for "examen de ingreso"
  const exIdx = code.indexOf('examen de ingreso');
  if (exIdx !== -1) {
    console.log(code.substring(exIdx - 200, exIdx + 2000));
  }
}
