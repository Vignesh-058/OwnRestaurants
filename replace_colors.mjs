import fs from 'fs';
import path from 'path';

function replaceInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('255,107,0') || content.includes('255, 107, 0')) {
    const newContent = content.replace(/255,\s*107,\s*0/g, '233, 30, 99');
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Replaced in ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
      replaceInFile(fullPath);
    }
  }
}

walkDir('src');
