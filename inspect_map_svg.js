const fs = require('fs');
const code = fs.readFileSync('downloaded_bundle.js', 'utf8');

// Find SVG map
const svgIdx = code.indexOf('viewBox="0 0 620 900"');
console.log('svgIdx 620 900:', svgIdx);
if (svgIdx !== -1) {
  console.log(code.substring(svgIdx - 100, svgIdx + 2000));
}

// Find inset map or CABA / Zoom
const insetIdx = code.indexOf('inset');
console.log('insetIdx:', insetIdx);
const ambaIdx = code.indexOf('amba');
console.log('ambaIdx:', ambaIdx);

// Find Pesos / USD toggle
const usdIdx = code.indexOf('Pesos');
console.log('usdIdx:', usdIdx);
if (usdIdx !== -1) {
  console.log(code.substring(usdIdx - 100, usdIdx + 400));
}
