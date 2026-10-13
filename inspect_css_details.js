const fs = require('fs');
const css = fs.readFileSync('downloaded_bundle.css', 'utf8');

// Search for comparison card styles
const searchSnippets = [
  'vs',
  'navbar',
  'peor',
  'pines',
  'active'
];

searchSnippets.forEach(term => {
  const matches = [...css.matchAll(new RegExp(`[^}{;]*${term}[^}{;]*\\{[^}]+\\}`, 'gi'))];
  console.log(`Term "${term}": ${matches.length} matches`);
  if (matches.length > 0) {
    console.log('Sample:', matches[0][0]);
  }
});
