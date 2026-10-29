const https = require('https');

https.get('https://fastcaremart.com/product/newtech-blood-glucose-meter-accurate-sugar-level-monitor', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Find the wrapper around the product page
    const idx = data.indexOf('Product not found');
    const start = data.indexOf('<main');
    const end = data.indexOf('</main>');
    const mainContent = data.substring(start, end + 7);
    
    // Find all div tags and their classes in main
    const divMatches = mainContent.match(/<div[^>]*class="[^"]*"[^>]*>/g) || [];
    console.log('Divs inside <main> on live fastcaremart.com:');
    divMatches.slice(0, 10).forEach(d => console.log(d));
  });
});
