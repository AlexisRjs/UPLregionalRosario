const fs = require('fs');
const css = fs.readFileSync('downloaded_bundle.css', 'utf8');

// Find color hexes
const hexes = [...new Set(css.match(/#[0-9a-fA-F]{3,8}/g))];
console.log('Hex colors:', hexes.slice(0, 30));

// Find classes with "upl-"
const uplClasses = [...new Set(css.match(/\.[\w-]*upl-[\w-]*/g))];
console.log('UPL classes:', uplClasses);

// Search for font-family
const fonts = [...new Set(css.match(/font-family:[^;]+/g))];
console.log('Fonts:', fonts);
