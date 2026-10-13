const fs = require('fs');
const mapData = require('./argentina_map_data.json');

console.log('Map keys:', Object.keys(mapData));
if (mapData.pines) {
  console.log('Total pines count:', mapData.pines.length);
  console.log('Sample pines:', mapData.pines.slice(0, 10));
  
  // Find pines for Santa Fe / Rosario / UNR
  const rosarioPines = mapData.pines.filter(p => p.id && (p.id.includes('rosario') || p.id.includes('unr')));
  console.log('Rosario pines:', rosarioPines);
} else {
  console.log('No mapData.pines found directly in json');
}
