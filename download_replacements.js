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
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AVINStudioBot/3.0',
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

const updates = [
  // 1. Featured story: Beautiful wide angle couple wedding photo
  {
    name: 'story_wedding.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Best_Wedding_Photography_Picture_about_Professional_Photographers.jpg/1280px-Best_Wedding_Photography_Picture_about_Professional_Photographers.jpg'
  },
  // 2. Studio portrait: South Indian bride portrait
  {
    name: 'studio_portrait.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/South_Indian_wedding_2.jpg/1280px-South_Indian_wedding_2.jpg'
  },
  // 3. Kanyadaan / Rituals: High resolution authentic ritual
  {
    name: 'kanyadaan_ritual.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Kanyadaan_Ceremony_in_a_Gujarati%2C_Hindu_Wedding_Ceremony.jpg/1280px-Kanyadaan_Ceremony_in_a_Gujarati%2C_Hindu_Wedding_Ceremony.jpg'
  },
  // 4. Sindoor ritual:
  {
    name: 'sindoor_ritual.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sindoor_ceremony_at_an_Indian_wedding.jpg/1280px-Sindoor_ceremony_at_an_Indian_wedding.jpg'
  }
];

(async () => {
  for (const item of updates) {
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
