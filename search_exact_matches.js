const https = require('https');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'images');

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function searchCommons(query) {
  return new Promise((resolve) => {
    const url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=' + encodeURIComponent(query) + '&gsrnamespace=6&prop=imageinfo&iiprop=url|thumburl|dimensions&iiurlwidth=1280&format=json';
    https.get(url, { headers: { 'User-Agent': 'WeddingStudioApp/6.0 (contact@example.com)' } }, (res) => {
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

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(imgDir, filename);

    function get(u, redirects = 0) {
      if (redirects > 5) return reject(new Error('Too many redirects'));
      
      const parsed = new URL(u);
      const req = https.get({
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AVINStudioBot/6.0',
          'Accept': 'image/jpeg,image/png,image/*;q=0.8',
          'Referer': 'https://commons.wikimedia.org/'
        }
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          let nextUrl = res.headers.location;
          if (!nextUrl.startsWith('http')) {
            nextUrl = 'https://' + parsed.hostname + nextUrl;
          }
          return get(nextUrl, redirects + 1);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Status ${res.statusCode}`));
        }
        const tempPath = filePath + '.tmp';
        const fileStream = fs.createWriteStream(tempPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close(() => {
            fs.renameSync(tempPath, filePath);
            resolve(filePath);
          });
        });
      });
      req.on('error', (err) => reject(err));
    }

    get(url);
  });
}

(async () => {
  const queries = [
    'South Indian wedding',
    'Indian bride saree',
    'Indian bride portrait',
    'Indian wedding mandap',
    'Varmala wedding'
  ];

  for (const q of queries) {
    const results = await searchCommons(q);
    console.log(`\n=== QUERY: ${q} ===`);
    results.slice(0, 6).forEach(x => {
      console.log(`- ${x.title}`);
      console.log(`  Thumb: ${x.thumb}`);
    });
  }
})();
