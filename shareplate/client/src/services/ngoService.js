// src/services/ngoService.js
// Service to fetch nearby NGOs using Overpass API

export const fetchNearbyNGOs = async (lat, lon, radius = 5000) => {
  const query = `
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
  try {
    const res = await fetch("https://overpass.kumi.systems/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "SharePlate/1.0" },
      body: "data=" + encodeURIComponent(query),
    });
    if (!res.ok) throw new Error("Failed to fetch NGOs");
    const data = await res.json();
    if (Array.isArray(data.elements) && data.elements.length > 0) return data.elements;
    // fallback to real demo dataset then default demo when Overpass returns empty
    try {
      const real = await import("../data/real_demo_ngos.json");
      return real.default.map((d) => ({ ...d, isDemo: true }));
    } catch (e) {
      const demo = await import("../data/demo_ngos.json");
      return demo.default.map((d) => ({ ...d, isDemo: true }));
    }
  } catch (err) {
    console.warn("Overpass fetch failed, returning demo data:", err.message);
    try {
      const real = await import("../data/real_demo_ngos.json");
      return real.default.map((d) => ({ ...d, isDemo: true }));
    } catch (e) {
      try {
        const demo = await import("../data/demo_ngos.json");
        return demo.default.map((d) => ({ ...d, isDemo: true }));
      } catch (ee) {
        return [];
      }
    }
  }
};
