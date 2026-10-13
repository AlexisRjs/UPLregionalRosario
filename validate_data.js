const fs = require('fs');

try {
  const data = require('./raw_universities.js');
  const keys = Object.keys(data);
  console.log(`Successfully loaded ${keys.length} universities!`);
  console.log('Sample keys:', keys.slice(0, 5));
  
  // Save as clean json
  fs.writeFileSync('universities_data.json', JSON.stringify(data, null, 2), 'utf8');
  console.log('Saved universities_data.json successfully!');
  
  // Check Santa Fe / Rosario / UNR
  console.log('\n--- ROSARIO DATA ---');
  console.log('UNR:', data.rosario ? data.rosario.nombre : 'Not found');
  console.log('UNR metrics:', {
    estudiantes2024: data.rosario?.estudiantes2024,
    egresados2024: data.rosario?.egresados2024,
    tasaCohorte: data.rosario?.tasaCohorte,
    costoPorGraduado: data.rosario?.costoPorGraduado,
    presupuesto2024: data.rosario?.presupuesto2024,
    sinMaterias2024: data.rosario?.sinMaterias2024,
    notas: data.rosario?.notas
  });
  
  // Check all universities in Santa Fe province
  const santaFeUnis = Object.entries(data).filter(([k, u]) => u.provincia === 'Santa Fe');
  console.log('\nUniversities in Santa Fe province:', santaFeUnis.map(([k, u]) => `${u.sigla} (${u.ciudad})`));
  
} catch (err) {
  console.error('Error requiring raw_universities.js:', err.message);
}
