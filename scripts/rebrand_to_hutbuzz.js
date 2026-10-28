const fs = require('fs');
const path = require('path');

const replacements = [
  // Email and domain with space or special cases
  ['concierge@hutbuzzmart.com', 'concierge@hutbuzzmart.com'],
  ['concierge@hutbuzzmart.com', 'concierge@hutbuzzmart.com'],
  ['concierge@hutbuzzmart.com', 'concierge@hutbuzzmart.com'],
  ['concierge@hutbuzzmart.com', 'concierge@hutbuzzmart.com'],
  ['support@hutbuzzmart.com', 'support@hutbuzzmart.com'],
  ['support@hutbuzzmart.com', 'support@hutbuzzmart.com'],
  ['support@hutbuzzmart.com', 'support@hutbuzzmart.com'],
  ['support@hutbuzzmart.com', 'support@hutbuzzmart.com'],
  ['info@hutbuzzmart.com', 'info@hutbuzzmart.com'],
  ['info@hutbuzzmart.com', 'info@hutbuzzmart.com'],
  ['info@hutbuzzmart.com', 'info@hutbuzzmart.com'],
  ['info@hutbuzzmart.com', 'info@hutbuzzmart.com'],

  // Web domains
  ['https://www.hutbuzzmart.com', 'https://www.hutbuzzmart.com'],
  ['http://www.hutbuzzmart.com', 'http://www.hutbuzzmart.com'],
  ['www.hutbuzzmart.com', 'www.hutbuzzmart.com'],
  ['hutbuzzmart.com', 'hutbuzzmart.com'],
  ['hutbuzzmart.com', 'hutbuzzmart.com'],
  ['hutbuzzmart.com', 'hutbuzzmart.com'],
  ['hutbuzzmart.com', 'hutbuzzmart.com'],

  // Sub-brands and specific compound phrases
  ['Hut Buzz Mart Atelier', 'Hut Buzz Mart Atelier'],
  ['Hut Buzz Mart Boutique', 'Hut Buzz Mart Boutique'],
  ['Hut Buzz Mart Curators', 'Hut Buzz Mart Curators'],
  ['Hut Buzz Mart Intelligence', 'Hut Buzz Mart Intelligence'],
  ['Hut Buzz Mart Editorial', 'Hut Buzz Mart Editorial'],
  ['Hut Buzz Mart Assistant', 'Hut Buzz Mart Assistant'],
  ['Hut Buzz Mart CO.', 'Hut Buzz Mart CO.'],
  ['Hut Buzz Mart Team', 'Hut Buzz Mart Team'],
  ['Hut Buzz Mart AI', 'Hut Buzz Mart AI'],
  ['Hut Buzz Mart Health Pro', 'Hut Buzz Mart Health Pro'],
  ['Hut Buzz Mart Location', 'Hut Buzz Mart Location'],
  ['Hut Buzz Mart Essentials', 'Hut Buzz Mart Essentials'],
  ['Hut Buzz Mart Order', 'Hut Buzz Mart Order'],
  ['Hut Buzz Mart Logo', 'Hut Buzz Mart Logo'],
  ['Hut Buzz Mart Avenue', 'Hut Buzz Mart Avenue'],

  // Specific caches and identifiers
  ['Hut-Buzz-Mart-cache-v1', 'Hut-Buzz-Mart-cache-v1'],
  ['HutBuzzMartshop-dev-only-insecure-key-32', 'HutBuzzMartshop-dev-only-insecure-key-32'],
  ['hutbuzzmart-app', 'hutbuzzmart-app'],

  // Case variants
  ['HUT BUZZ MART', 'HUT BUZZ MART'],
  ['Hut Buzz Mart', 'Hut Buzz Mart'],
  ['hut buzz mart', 'hut buzz mart'],
  ['HUTBUZZMART', 'HUTBUZZMART'],
  ['HutBuzzMart', 'HutBuzzMart'],
  ['hutBuzzMart', 'hutBuzzMart'],
  ['hutbuzzmart', 'hutbuzzmart'],
  ['HUT-BUZZ-MART', 'HUT-BUZZ-MART'],
  ['Hut-Buzz-Mart', 'Hut-Buzz-Mart'],
  ['hut-buzz-mart', 'hut-buzz-mart'],
  ['HUT_BUZZ_MART', 'HUT_BUZZ_MART'],
  ['Hut_Buzz_Mart', 'Hut_Buzz_Mart'],
  ['hut_buzz_mart', 'hut_buzz_mart'],

  // Old leftover fallbacks
  ['"Hut Buzz Mart"', '"Hut Buzz Mart"'],
  ["'Hut Buzz Mart'", "'Hut Buzz Mart'"],
];

const extensions = [
  '.ts', '.tsx', '.js', '.jsx', '.json', '.yml', '.yaml', '.md', '.env', '.local'
];

const excludedDirs = ['node_modules', '.next', '.git'];

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!excludedDirs.includes(file)) {
        walkDir(fullPath);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(file);
      const isTargetFile = extensions.includes(ext) || file === '.env.local' || file === 'Dockerfile';

      if (isTargetFile) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let original = content;

        for (const [from, to] of replacements) {
          if (content.includes(from)) {
            content = content.split(from).join(to);
          }
        }

        if (content !== original) {
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log('Updated:', path.relative(process.cwd(), fullPath));
        }
      }
    }
  });
}

walkDir(process.cwd());
console.log('\nDone! Rebranding to Hut Buzz Mart completed.');
