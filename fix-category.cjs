const fs = require('fs');

let ct = fs.readFileSync('src/types/category.types.ts', 'utf8');
ct = ct.replace('image?: string | null;', 'image?: { webView?: string } | string | null;');
// Need to do it for CategoryItem as well just in case
ct = ct.replace('image?: string | null;', 'image?: { webView?: string } | string | null;');
fs.writeFileSync('src/types/category.types.ts', ct);

console.log('Fixed category image type.');
