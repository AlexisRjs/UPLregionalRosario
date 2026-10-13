const mapData = require('./argentina_map_data.json');
const santafe = mapData.provincias.find(p => p.nombre === 'Santa Fe');

console.log('Santa Fe path length:', santafe.d.length);
console.log('Santa Fe bbox:', santafe.bbox);

// Let's test the coordinates of Rosario inside Santa Fe
const rosarioX = 456.42;
const rosarioY = 267.65;
console.log(`Rosario pin: x=${rosarioX}, y=${rosarioY}`);
console.log(`Inside bbox X: ${rosarioX >= santafe.bbox[0] && rosarioX <= santafe.bbox[2]}`);
console.log(`Inside bbox Y: ${rosarioY >= santafe.bbox[1] && rosarioY <= santafe.bbox[3]}`);
