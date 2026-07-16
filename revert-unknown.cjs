const fs = require('fs');
const path = require('path');

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;

      // Revert type replacements that broke the build
      content = content.replace(/\(error: unknown\)/g, '(error: any)');
      content = content.replace(/\(err: unknown\)/g, '(err: any)');
      content = content.replace(/\(e: unknown\)/g, '(e: any)');
      content = content.replace(/catch \(error: unknown\)/g, 'catch (error: any)');
      content = content.replace(/catch \(e: unknown\)/g, 'catch (e: any)');
      content = content.replace(/\(data: unknown\)/g, '(data: any)');
      content = content.replace(/payload: Record<string, unknown>/g, 'payload: any');
      content = content.replace(/\(message: string, \.\.\.optionalParams: unknown\[\]\)/g, '(message: string, ...optionalParams: any[])');
      content = content.replace(/menu\?: unknown/g, 'menu?: any');
      content = content.replace(/results\?: unknown\[\]/g, 'results?: any[]');
      content = content.replace(/bill\?: unknown/g, 'bill?: any');
      content = content.replace(/session\?: unknown/g, 'session?: any');
      content = content.replace(/theme: unknown \| null/g, 'theme: any | null');
      content = content.replace(/\(theme: unknown\)/g, '(theme: any)');
      content = content.replace(/Promise<unknown>/g, 'Promise<any>');
      
      if (original !== content) {
        fs.writeFileSync(fullPath, content);
        console.log('Reverted: ' + fullPath);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
console.log('Revert complete!');
