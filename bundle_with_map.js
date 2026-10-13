const fs = require('fs');

const regionalData = require('./data.js');
const nationalData = require('./universities_data.json');
const mapData = require('./argentina_map_data.json');

const fullBundle = `// Bundle completo con datos regionales de Rosario, base nacional de 62 universidades y mapa vectorial
const UPL_DATA = ${JSON.stringify(regionalData, null, 2)};
const NATIONAL_UNIVERSITIES = ${JSON.stringify(nationalData, null, 2)};
const ARGENTINA_MAP = ${JSON.stringify(mapData, null, 2)};
`;

fs.writeFileSync('data_bundle.js', fullBundle, 'utf8');
console.log('Updated data_bundle.js successfully with map data! Size:', (fullBundle.length / 1024).toFixed(1), 'KB');
