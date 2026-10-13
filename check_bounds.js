const fs = require('fs');
const mapData = require('./argentina_map_data.json');

console.log('Original viewBox in mapData:', mapData.viewBox);
let minX = 9999, minY = 9999, maxX = -9999, maxY = -9999;

mapData.provincias.forEach(p => {
  if (p.bbox) {
    minX = Math.min(minX, p.bbox[0]);
    minY = Math.min(minY, p.bbox[1]);
    maxX = Math.max(maxX, p.bbox[2]);
    maxY = Math.max(maxY, p.bbox[3]);
  }
});

console.log(`Bounds across all provinces: minX: ${minX}, minY: ${minY}, maxX: ${maxX}, maxY: ${maxY}`);

// Check Capital Federal path
const caba = mapData.provincias.find(p => p.nombre === 'Capital Federal');
console.log('Capital Federal found:', !!caba);
if (caba) console.log('CABA bbox:', caba.bbox);

// Check Santa Fe path
const santafe = mapData.provincias.find(p => p.nombre === 'Santa Fe');
console.log('Santa Fe found:', !!santafe);
if (santafe) console.log('Santa Fe bbox:', santafe.bbox);
