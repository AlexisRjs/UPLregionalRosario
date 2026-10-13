const fs = require('fs');
const css = fs.readFileSync('downloaded_bundle.css', 'utf8');

const targetClasses = [
  'glass',
  'glass-strong',
  'glass-chip',
  'glass-flat',
  'blob',
  'btn'
];

targetClasses.forEach(cls => {
  const regex = new RegExp(`\\.${cls}[^{]*\\{([^}]+)\\}`, 'g');
  let match;
  console.log(`=== CLASS .${cls} ===`);
  while ((match = regex.exec(css)) !== null) {
    console.log(match[0]);
  }
});
