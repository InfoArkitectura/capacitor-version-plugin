import fs from 'fs';
import path from 'path';

function addJsExtensions(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      addJsExtensions(fullPath);
    } else if (file.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      // Add .js extensions to relative imports
      content = content.replace(
        /from ['"](\.\/.+?)(?<!\.js)['"]/g,
        "from '$1.js'"
      );
      content = content.replace(
        /import\(['"](\.\/.+?)(?<!\.js)['"]\)/g,
        "import('$1.js')"
      );
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

// Add .js extensions to ESM builds
if (fs.existsSync('./dist/esm')) {
  addJsExtensions('./dist/esm');
  console.log('Added .js extensions to ESM imports');
}
