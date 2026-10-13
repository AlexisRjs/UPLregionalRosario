const fs = require('fs');
const code = fs.readFileSync('downloaded_bundle.js', 'utf8');

// The path in content.md was: d="M349.09,124.41L352.1
const sampleD = '349.09,124.41';
const idx = code.indexOf(sampleD);
console.log('Sample path in bundle:', idx);

if (idx !== -1) {
  // Let's see what is around this idx
  console.log(code.substring(idx - 150, idx + 400));
}

// Find provinces or map definitions
const provMatches = code.match(/provincias|provinciasPaths|mapaArgentina/i);
console.log('provMatches:', provMatches);
