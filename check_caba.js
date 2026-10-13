const mapData = require('./argentina_map_data.json');
const caba = mapData.provincias.find(p => p.nombre === 'Capital Federal');
console.log('CABA path d:', caba ? caba.d : 'Not found');
