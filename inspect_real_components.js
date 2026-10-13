const fs = require('fs');
const code = fs.readFileSync('downloaded_bundle.js', 'utf8');

// Find navbar component
const navIdx = code.indexOf('navbar-pill');
if (navIdx !== -1) {
  console.log('--- NAVBAR COMPONENT ---');
  console.log(code.substring(navIdx - 400, navIdx + 1200));
}

// Find map control card: "Tocá una provincia para ver sus sedes"
const mapControlIdx = code.indexOf('Tocá una provincia');
if (mapControlIdx !== -1) {
  console.log('\n--- MAP CONTROL CARD ---');
  console.log(code.substring(mapControlIdx - 200, mapControlIdx + 800));
}

// Find comparison card: "vs. resto del sistema"
const vsIdx = code.indexOf('vs. resto del sistema');
if (vsIdx !== -1) {
  console.log('\n--- VS CARD COMPONENT ---');
  console.log(code.substring(vsIdx - 300, vsIdx + 1500));
}
