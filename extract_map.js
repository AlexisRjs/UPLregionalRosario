const fs = require('fs');

const content = fs.readFileSync('C:/Users/alexi/.gemini/antigravity-ide/brain/81ebeba0-e6a7-405f-afb5-0d8328bf289b/.system_generated/steps/8/content.md', 'utf8');

const svgStart = content.indexOf('<svg viewBox="0 0 620 900"');
console.log('svgStart in content.md:', svgStart);
if (svgStart !== -1) {
  const svgEnd = content.indexOf('</svg>', svgStart);
  console.log('svgEnd:', svgEnd);
  console.log('SVG length:', svgEnd - svgStart);
  const svgContent = content.substring(svgStart, svgEnd + 6);
  fs.writeFileSync('argentina_map.svg', svgContent, 'utf8');
  console.log('Saved argentina_map.svg successfully!');
}
