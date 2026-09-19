const https = require('https');
const zlib = require('zlib');

function fetchHtml(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = 'https://unsplash.com' + redirectUrl;
        }
        console.log('Redirecting to:', redirectUrl);
        return resolve(fetchHtml(redirectUrl));
      }
      console.log('Status:', res.statusCode, 'Encoding:', res.headers['content-encoding']);
      let stream = res;
      if (res.headers['content-encoding'] === 'gzip') {
        stream = res.pipe(zlib.createGunzip());
      } else if (res.headers['content-encoding'] === 'deflate') {
        stream = res.pipe(zlib.createInflate());
      }
      let data = '';
      stream.on('data', c => data += c);
      stream.on('end', () => resolve(data));
      stream.on('error', (e) => { console.error(e); resolve(''); });
    }).on('error', (e) => { console.error(e); resolve(''); });
  });
}

(async () => {
  const html = await fetchHtml('https://unsplash.com/s/photos/indian-wedding');
  const regex = /photo-([0-9]{13}-[a-z0-9]+)/g;
  let match;
  const urls = new Set();
  while ((match = regex.exec(html)) !== null) {
    urls.add('photo-' + match[1]);
  }
  console.log('IDs found:', Array.from(urls));
})();
