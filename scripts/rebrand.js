const fs = require('fs');
const path = require('path');

const replacements = [
  ['x Apparels Atelier', 'Hut Buzz Mart Atelier'],
  ['x Apparels Boutique', 'Hut Buzz Mart Boutique'],
  ['x Apparels Curators', 'Hut Buzz Mart Curators'],
  ['x Apparels Intelligence', 'Hut Buzz Mart Intelligence'],
  ['x Apparels Editorial', 'Hut Buzz Mart Editorial'],
  ['x Apparels Assistant', 'Hut Buzz Mart Assistant'],
  ['x Apparels CO.', 'Hut Buzz Mart CO.'],
  ['x Apparels Team', 'Hut Buzz Mart Team'],
  ['x Apparels AI', 'Hut Buzz Mart AI'],
  ['x Apparelsr', 'Hut Buzz Mart'],  // typo fix in manifest.ts
  ['x Apparels', 'Hut Buzz Mart'],
  ['xApparels', 'HutBuzzMart'],
  ['xapparels.com', 'hutbuzzmart.com'],
  ['xapparels', 'hutbuzzmart'],
];

const extensions = ['.ts', '.tsx', '.js', '.jsx'];

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory() && file !== 'node_modules' && file !== '.next') {
      walkDir(fullPath);
    } else if (stat.isFile() && extensions.includes(path.extname(file))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      for (const [from, to] of replacements) {
        content = content.split(from).join(to);
      }
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated:', fullPath.replace(process.cwd() + path.sep, ''));
      }
    }
  });
}

walkDir(path.join(process.cwd(), 'src'));
console.log('\nDone! All branding updated.');
