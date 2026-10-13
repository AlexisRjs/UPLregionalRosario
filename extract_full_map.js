const fs = require('fs');
const code = fs.readFileSync('downloaded_bundle.js', 'utf8');

const marker = 'gm={viewBox:`0 0 800 900`';
const idxStart = code.indexOf(marker);
console.log('marker idx:', idxStart);

if (idxStart !== -1) {
  const braceStart = code.indexOf('{', idxStart);
  
  // Find where gm ends
  let depth = 0;
  let inString = null;
  let endIdx = -1;
  
  for (let i = braceStart; i < code.length; i++) {
    const char = code[i];
    const prevChar = code[i - 1];
    
    if (inString) {
      if (char === inString && prevChar !== '\\') {
        inString = null;
      }
    } else {
      if (char === '`' || char === '"' || char === "'") {
        inString = char;
      } else if (char === '{') {
        depth++;
      } else if (char === '}') {
        depth--;
        if (depth === 0) {
          endIdx = i;
          break;
        }
      }
    }
  }
  
  console.log('endIdx:', endIdx);
  if (endIdx !== -1) {
    const rawMap = code.substring(braceStart, endIdx + 1);
    console.log('rawMap length:', rawMap.length);
    fs.writeFileSync('raw_map.js', 'module.exports = ' + rawMap + ';');
    console.log('Saved raw_map.js');
    
    // Now require it and save as json
    const mapData = require('./raw_map.js');
    fs.writeFileSync('argentina_map_data.json', JSON.stringify(mapData, null, 2), 'utf8');
    console.log('Saved argentina_map_data.json successfully! Provinces:', mapData.provincias.length);
  }
}
