const http = require('http');

function testUrl(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ path, status: res.statusCode, contentType: res.headers['content-type'], length: data.length });
      });
    }).on('error', reject);
  });
}

async function main() {
  const paths = ['/', '/index.css', '/app.js', '/data_bundle.js', '/logo.jpg'];
  for (const p of paths) {
    try {
      const res = await testUrl(p);
      console.log(`[PASS] ${res.path} -> Status: ${res.status}, Type: ${res.contentType}, Bytes: ${res.length}`);
    } catch (e) {
      console.log(`[FAIL] ${p} -> ${e.message}`);
    }
  }
}

main();
