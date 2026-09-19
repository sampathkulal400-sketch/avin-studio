const https = require('https');

function searchCommons(query) {
  return new Promise((resolve) => {
    const url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=' + encodeURIComponent(query) + '&gsrnamespace=6&prop=imageinfo&iiprop=url|thumburl|dimensions&iiurlwidth=1280&format=json';
    https.get(url, { headers: { 'User-Agent': 'WeddingStudioApp/3.0 (info@example.com)' } }, (res) => {
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
    'Indian baby birthday',
    'Indian child traditional',
    'Indian baby photoshoot',
    'Seemantham ceremony',
    'Upanayana ceremony',
    'Annaprashana ceremony',
    'Namakarana ceremony'
  ];

  for (const q of queries) {
    const r = await searchCommons(q);
    console.log(`\n=== QUERY: ${q} ===`);
    r.slice(0, 5).forEach(x => {
      console.log(`- ${x.title}`);
      console.log(`  Thumb: ${x.thumb}`);
      console.log(`  Size: ${x.w}x${x.h}`);
    });
  }
})();
