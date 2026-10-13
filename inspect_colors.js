const fs = require('fs');
const css = fs.readFileSync('downloaded_bundle.css', 'utf8');

const classNames = [
  'bg-upl-principal',
  'bg-upl-principal-light',
  'bg-upl-secundario',
  'bg-upl-resaltador',
  'bg-upl-amarillo',
  'bg-upl-crema',
  'text-upl-resaltador',
  'text-upl-amarillo'
];

for (const name of classNames) {
  const regex = new RegExp(`\\.${name}[^{]*\\{([^}]+)\\}`, 'g');
  let match;
  while ((match = regex.exec(css)) !== null) {
    console.log(`${match[0]}`);
  }
}

// Check font definitions
const fontSans = css.match(/--font-sans:[^;]+;/);
const fontDisplay = css.match(/--font-display:[^;]+;/);
console.log('fontSans:', fontSans ? fontSans[0] : null);
console.log('fontDisplay:', fontDisplay ? fontDisplay[0] : null);
