const fs = require('fs');

const regionalData = require('./data.js');
const nationalData = require('./universities_data.json');

const fullBundle = `// Bundle completo con datos regionales de Rosario y base nacional de 62 universidades
const UPL_DATA = ${JSON.stringify(regionalData, null, 2)};
const NATIONAL_UNIVERSITIES = ${JSON.stringify(nationalData, null, 2)};
`;

fs.writeFileSync('data_bundle.js', fullBundle, 'utf8');
console.log('Created data_bundle.js successfully, size:', (fullBundle.length / 1024).toFixed(1), 'KB');
