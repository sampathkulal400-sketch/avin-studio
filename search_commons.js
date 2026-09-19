const https = require('https');
const fs = require('fs');
const path = require('path');

function searchCommonsPhotos(query) {
  return new Promise((resolve) => {
    const url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=' + encodeURIComponent(query) + '&gsrnamespace=6&prop=imageinfo&iiprop=url|thumburl|dimensions&iiurlwidth=1200&format=json';
    https.get(url, { headers: { 'User-Agent': 'WeddingStudio/1.0 (info@example.com)' } }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(d);
          const p = Object.values(j.query.pages || {});
          resolve(p.filter(x => x.imageinfo && x.imageinfo[0] && (x.title.toLowerCase().endsWith('.jpg') || x.title.toLowerCase().endsWith('.jpeg') || x.title.toLowerCase().endsWith('.png'))).map(x => ({
            title: x.title,
            thumburl: x.imageinfo[0].thumburl || x.imageinfo[0].url,
            url: x.imageinfo[0].url,
            width: x.imageinfo[0].width,
            height: x.imageinfo[0].height
          })));
        } catch(e) { resolve([]); }
      });
    }).on('error', () => resolve([]));
  });
}

(async () => {
  const queries = [
    'South Indian wedding',
    'Indian bride jewelry',
    'Hindu wedding rituals',
    'Indian wedding garland',
    'Haldi ceremony India',
    'Mehndi bride Indian',
    'Indian groom traditional'
  ];

  for (const q of queries) {
    const results = await searchCommonsPhotos(q);
    console.log(`\n=== QUERY: ${q} ===`);
    results.slice(0, 5).forEach(r => {
      console.log(`- Title: ${r.title}`);
      console.log(`  Thumb: ${r.thumburl}`);
      console.log(`  Size: ${r.width}x${r.height}`);
    });
  }
})();
