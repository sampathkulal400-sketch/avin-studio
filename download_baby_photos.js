const https = require('https');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'images');

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
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
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AVINStudioBot/4.0',
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

const newPhotos = [
  // 1. South Indian Baby Naming Ceremony (Namakarana / Noolkettu / Cradle Ceremony)
  {
    name: 'baby_ceremony.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/NoolKettu.JPG/1280px-NoolKettu.JPG'
  },
  // 2. Baby Annaprashana / 1st Birthday Rice milestone
  {
    name: 'baby_annaprashana.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/AnnaPrashan_%28Anna_Prashan%29_-_Hindu_First_Rice_Eating_Ceremony.JPG/1280px-AnnaPrashan_%28Anna_Prashan%29_-_Hindu_First_Rice_Eating_Ceremony.JPG'
  },
  // 3. Upanayana (Sacred Thread Ceremony / Munji)
  {
    name: 'upanayana_ceremony.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Upanayana_krish.jpg/1280px-Upanayana_krish.jpg'
  },
  // 4. Tamil / South Indian Wedding Welcome
  {
    name: 'south_welcome.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Tamil_Wedding_-_Groom_Welcome.jpg/1280px-Tamil_Wedding_-_Groom_Welcome.jpg'
  }
];

(async () => {
  for (const item of newPhotos) {
    try {
      console.log(`Downloading ${item.name}...`);
      await sleep(1500);
      const p = await downloadImage(item.url, item.name);
      const s = fs.statSync(p);
      console.log(`✓ Success: ${item.name} (${s.size} bytes)`);
    } catch(e) {
      console.error(`✗ Failed ${item.name}: ${e.message}`);
    }
  }
})();
