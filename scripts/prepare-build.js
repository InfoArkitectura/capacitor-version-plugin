// Simple script to skip docgen for now and focus on building
import fs from 'fs';

// Create dist directory if it doesn't exist
if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist');
}

// Create empty docs.json for now
fs.writeFileSync('./dist/docs.json', '{}');

console.log('Build preparation complete');
