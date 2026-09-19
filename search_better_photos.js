const https = require('https');

function searchCommons(query) {
  return new Promise((resolve) => {
    const url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=' + encodeURIComponent(query) + '&gsrnamespace=6&prop=imageinfo&iiprop=url|thumburl|dimensions&iiurlwidth=1280&format=json';
    https.get(url, { headers: { 'User-Agent': 'WeddingStudioApp/2.0 (info@example.com)' } }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(d);
          const p = Object.values(j.query.pages || {});
          resolve(p.filter(x => x.imageinfo && x.imageinfo[0] && (x.title.toLowerCase().endsWith('.jpg') || x.title.toLowerCase().endsWith('.jpeg'))).map(x => ({
            title: x.title,
            thumb: x.imageinfo[0].thumburl || x.imageinfo[0].url,
            url: x.imageinfo[0].url,
            w: x.imageinfo[0].width,
            h: x.imageinfo[0].height
          })));
        } catch(e) { resolve([]); }
      });
    }).on('error', () => resolve([]));
  });
}

(async () => {
  const queries = [
    'Hindu wedding couple mandap',
    'South Indian wedding couple ceremony',
    'Indian wedding couple portrait',
    'Indian bride groom garland'
  ];

  for (const q of queries) {
    const r = await searchCommons(q);
    console.log(`\n=== QUERY: ${q} ===`);
    r.slice(0, 6).forEach(x => {
      console.log(`- ${x.title} (${x.w}x${x.h})`);
      console.log(`  Thumb: ${x.thumb}`);
    });
  }
})();
