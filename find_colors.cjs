const fs = require('fs');
const path = require('path');

const hexRegex = /#[0-9a-fA-F]{3,8}\b/g;
const exceptions = ['#FFFFFF', '#000000', '#fff', '#000'];
const results = [];

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
      if (fullPath.includes('colors.css')) continue; // Skip definitions
      const content = fs.readFileSync(fullPath, 'utf8');
      let match;
      while ((match = hexRegex.exec(content)) !== null) {
        if (!exceptions.includes(match[0].toUpperCase())) {
           results.push(`${fullPath}: ${match[0]}`);
        }
      }
    }
  }
}

scanDir(path.join(__dirname, 'src'));
fs.writeFileSync('hardcoded_colors.txt', results.join('\n'));
console.log(`Found ${results.length} hardcoded colors.`);
