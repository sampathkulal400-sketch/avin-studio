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
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AVINWeddingStudio/2.0 (contact: info@avin.local)',
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

const images = [
  { name: 'hero_wedding.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Indian_Wedding_Ritual_-_Jaimala_or_Varmala_%2801%29.jpg/1280px-Indian_Wedding_Ritual_-_Jaimala_or_Varmala_%2801%29.jpg' },
  { name: 'bride_portrait.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Indian_UttarPradesh_Bride_Images_%2803%29.jpg/1280px-Indian_UttarPradesh_Bride_Images_%2803%29.jpg' },
  { name: 'garland_ceremony.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Indian_Wedding_Ritual_-_Jaimala_or_Varmala_%2802%29.jpg/1280px-Indian_Wedding_Ritual_-_Jaimala_or_Varmala_%2802%29.jpg' },
  { name: 'haldi_ceremony.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Haldi_ceremony_in_India.jpg/1280px-Haldi_ceremony_in_India.jpg' },
  { name: 'wedding_couple.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Indian_Hindu_marrige.jpg/1280px-Indian_Hindu_marrige.jpg' },
  { name: 'family_pooja.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Traditional_Indian_Wedding_Family_Photo_with_Pooja_items.jpg/1280px-Traditional_Indian_Wedding_Family_Photo_with_Pooja_items.jpg' },
  { name: 'bridal_studio.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Indian_Traditional_Wedding_Images_%2840%29.jpg/1280px-Indian_Traditional_Wedding_Images_%2840%29.jpg' },
  { name: 'sacred_rituals.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/A_Hindu_wedding_ritual_in_progress_b.jpg/1280px-A_Hindu_wedding_ritual_in_progress_b.jpg' },
  { name: 'couple_outdoor.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Indian_malayali_couples_exchanging_garlands.JPG/1280px-Indian_malayali_couples_exchanging_garlands.JPG' },
  { name: 'milestone_haldi.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Haldi_ceremony_7.jpg/1280px-Haldi_ceremony_7.jpg' },
  { name: 'mehndi_portrait.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Indian_Mehndi_Culture_%281%29_01.jpg/1280px-Indian_Mehndi_Culture_%281%29_01.jpg' },
  { name: 'story_wedding.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Local_Indian_bride_and_groom.jpg/1280px-Local_Indian_bride_and_groom.jpg' },
  { name: 'about_studio.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Indian_Culture_Wedding_%285%29_09.jpg/1280px-Indian_Culture_Wedding_%285%29_09.jpg' },
  { name: 'grid_groom.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Indian_groom_on_it%27s_way_to_meet_his_bride.jpg/1280px-Indian_groom_on_it%27s_way_to_meet_his_bride.jpg' },
  { name: 'grid_bride.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Indian_Culture_Wedding_%285%29_01.jpg/1280px-Indian_Culture_Wedding_%285%29_01.jpg' },
  { name: 'grid_haldi.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Raw_turmeric_paste_for_haldi_ceremony_in_Indian_wedding.jpg/1280px-Raw_turmeric_paste_for_haldi_ceremony_in_Indian_wedding.jpg' },
  { name: 'grid_mehndi.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Indian_Mehndi_Culture_%281%29_02.jpg/1280px-Indian_Mehndi_Culture_%281%29_02.jpg' },
  { name: 'grid_celebration.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Indian_Culture_Wedding_%285%29_03.jpg/1280px-Indian_Culture_Wedding_%285%29_03.jpg' },
  { name: 'grid_rituals.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Hindu_Wedding_Rituals_in_Kolkata_04.jpg/960px-Hindu_Wedding_Rituals_in_Kolkata_04.jpg' }
];

(async () => {
  for (const item of images) {
    const fp = path.join(imgDir, item.name);
    if (fs.existsSync(fp) && fs.statSync(fp).size > 10000) {
      console.log(`[Already have] ${item.name} (${fs.statSync(fp).size} bytes)`);
      continue;
    }
    let success = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Downloading ${item.name} (attempt ${attempt})...`);
        await sleep(2500); // 2.5s delay
        const p = await downloadImage(item.url, item.name);
        const s = fs.statSync(p);
        console.log(`✓ Success: ${item.name} (${s.size} bytes)`);
        success = true;
        break;
      } catch (e) {
        console.warn(`  Attempt ${attempt} failed: ${e.message}`);
        await sleep(3000);
      }
    }
    if (!success) {
      console.error(`✗ FAILED completely: ${item.name}`);
    }
  }
  console.log('--- Finished checking all images ---');
})();
