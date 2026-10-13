const mapData = require('./argentina_map_data.json');
const cabaPins = mapData.pines.filter(p => p.provincia === 'Ciudad Autónoma de Buenos Aires' || p.ciudad === 'CABA' || (p.x >= 499 && p.x <= 504 && p.y >= 304 && p.y <= 309));
console.log('CABA pins count:', cabaPins.length);
cabaPins.forEach(p => console.log(p.sigla, p.nombre, p.x, p.y, p.tieneFicha));
