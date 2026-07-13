const fs = require('fs');
const data = fs.readFileSync('Owncart FrontFacing Api Json.md', 'utf8');
const urls = data.match(/https?:\/\/[^\s\\",]+/g) || [];
const unique = [...new Set(urls)];
const matched = unique.filter(u => u.toLowerCase().includes('order') || u.toLowerCase().includes('place') || u.toLowerCase().includes('checkout') || u.toLowerCase().includes('payment'));
console.log(matched);
