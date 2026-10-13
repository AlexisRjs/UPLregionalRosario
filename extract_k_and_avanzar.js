const fs = require('fs');
const code = fs.readFileSync('downloaded_bundle.js', 'utf8');

const tgIdx = code.indexOf('function Tg()');
console.log('Tg():\n', code.substring(tgIdx, tgIdx + 2000));

// Check kirchneristas page logic
const kirchIdx = code.indexOf('/universidades-kirchneristas');
console.log('\nKirchneristas logic:\n', code.substring(kirchIdx - 100, kirchIdx + 2500));
