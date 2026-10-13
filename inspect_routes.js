const fs = require('fs');
const code = fs.readFileSync('downloaded_bundle.js', 'utf8');

// Find routes
const routes = [...code.matchAll(/path:["'`]([^"'`]+)["'`]/g)].map(m => m[1]);
console.log('Unique paths/routes:', [...new Set(routes)]);

// Find nav links / titles
const titles = [...code.matchAll(/title:["'`]([^"'`]+)["'`]/g)].map(m => m[1]);
console.log('Sample titles:', [...new Set(titles)].slice(0, 20));

// Find components or headings
const headings = [...code.matchAll(/<h[1-4][^>]*>([^<]+)<\/h[1-4]>/g)].map(m => m[1]);
console.log('Headings found:', headings.slice(0, 15));

// Find rankings categories
const rankingMatches = code.match(/lm=\{([^}]+)\}/);
if (rankingMatches) console.log('Ranking categories (lm):', rankingMatches[1]);

// Let's find CSS classes or theme colors
const css = fs.readFileSync('downloaded_bundle.css', 'utf8');
const rootVars = css.match(/:root\{([^}]+)\}/);
console.log('Root CSS vars:', rootVars ? rootVars[1] : 'none');
const uplColors = css.match(/--upl-[^;:]+:[^;]+/g);
console.log('UPL color vars:', uplColors);
