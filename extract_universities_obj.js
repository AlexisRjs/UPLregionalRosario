const fs = require('fs');
const code = fs.readFileSync('downloaded_bundle.js', 'utf8');

// Find the object containing universities. Notice in bundle: Zp or where uba, unlp, etc are defined.
// Let's find where 'rosario:{nombre:`Universidad Nacional de Rosario`' is located and extract the object.
const marker = 'uba:{nombre:`Universidad de Buenos Aires`';
const idxStart = code.indexOf(marker);
console.log('uba marker idx:', idxStart);

if (idxStart !== -1) {
  // Let's find the starting brace before uba
  let braceStart = code.lastIndexOf('{', idxStart);
  console.log('braceStart:', braceStart);
  
  // Let's find where this object ends by bracket counter
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
    const rawObj = code.substring(braceStart, endIdx + 1);
    console.log('rawObj length:', rawObj.length);
    fs.writeFileSync('raw_universities.js', 'module.exports = ' + rawObj + ';');
    console.log('Saved raw_universities.js');
  }
}
