const fs = require('fs');
const https = require('https');
const path = require('path');

// Twemoji 72x72 PNGs
const icons = {
  'burgers.png': '1f354',    // 🍔
  'pizza.png': '1f355',      // 🍕
  'drinks.png': '1f964',     // 🥤
  'wraps.png': '1f32f',      // 🌯
  'desserts.png': '1f370',   // 🍰
  'rice.png': '1f35a',       // 🍚
  'combo.png': '1f371',      // 🍱
  'biryani.png': '1f35b',    // 🍛
  'chicken.png': '1f357',    // 🍗
  'default.png': '1f37d'     // 🍽️
};

const baseUrl = 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/';
const targetDir = path.join(__dirname, 'src', 'assets', 'category-icons');

if (!fs.existsSync(targetDir)){
    fs.mkdirSync(targetDir, { recursive: true });
}

Object.entries(icons).forEach(([filename, code]) => {
  const file = fs.createWriteStream(path.join(targetDir, filename));
  const url = `${baseUrl}${code}.png`;
  
  https.get(url, function(response) {
    if (response.statusCode === 200) {
      response.pipe(file);
      console.log(`Downloaded ${filename}`);
    } else {
      console.log(`Failed to download ${filename} - HTTP ${response.statusCode}`);
      // Create a fallback empty file so it doesn't crash Vite imports
      fs.writeFileSync(path.join(targetDir, filename), '');
    }
  }).on('error', function(err) {
    console.error(`Error downloading ${filename}: ${err.message}`);
    fs.writeFileSync(path.join(targetDir, filename), '');
  });
});
