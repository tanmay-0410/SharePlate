// scripts/overpass_test.js
const lat = process.argv[2] || '28.6448';
const lon = process.argv[3] || '77.2167';
const radius = process.argv[4] || 5000;

const q = `
[out:json][timeout:25];
(
  node["office"="ngo"](around:${radius},${lat},${lon});
  way["office"="ngo"](around:${radius},${lat},${lon});
  relation["office"="ngo"](around:${radius},${lat},${lon});

  node["amenity"="social_facility"](around:${radius},${lat},${lon});
  way["amenity"="social_facility"](around:${radius},${lat},${lon});
  relation["amenity"="social_facility"](around:${radius},${lat},${lon});
);

out center;
`;

(async () => {
  try {
    const res = await fetch('https://overpass.kumi.systems/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'SharePlateTest/1.0 (+https://example.com)'
      },
      body: 'data=' + encodeURIComponent(q),
    });
    const data = await res.json();
    console.log('count', data.elements.length);
    console.log(JSON.stringify(data.elements.slice(0,3), null, 2));
  } catch (e) {
    console.error('error', e.message);
  }
})();
