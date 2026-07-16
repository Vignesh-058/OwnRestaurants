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

      // Type replacements
      content = content.replace(/\(error: any\)/g, '(error: unknown)');
      content = content.replace(/\(err: any\)/g, '(err: unknown)');
      content = content.replace(/\(e: any\)/g, '(e: unknown)');
      content = content.replace(/catch \(error: any\)/g, 'catch (error: unknown)');
      content = content.replace(/catch \(e: any\)/g, 'catch (e: unknown)');
      content = content.replace(/\(data: any\)/g, '(data: unknown)');
      content = content.replace(/payload: any/g, 'payload: Record<string, unknown>');
      content = content.replace(/\(message: string, \.\.\.optionalParams: any\[\]\)/g, '(message: string, ...optionalParams: unknown[])');
      content = content.replace(/menu\?: any/g, 'menu?: unknown');
      content = content.replace(/results\?: any\[\]/g, 'results?: unknown[]');
      content = content.replace(/bill\?: any/g, 'bill?: unknown');
      content = content.replace(/session\?: any/g, 'session?: unknown');
      content = content.replace(/theme: any \| null/g, 'theme: unknown | null');
      content = content.replace(/\(theme: any\)/g, '(theme: unknown)');
      content = content.replace(/Promise<any>/g, 'Promise<unknown>');
      content = content.replace(/\(cat: any\)/g, '(cat: any)'); // Can't blindly replace this if it needs specific types
      
      // Specifically target ProductCard and ProductDrawer payloads
      content = content.replace(/const payload: Record<string, unknown> = \{/g, 'const payload: Record<string, unknown> = {');
      
      if (original !== content) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated: ' + fullPath);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
console.log('Phase 1 & 2 Cleanup complete!');
