// src/lib/ngoUtils.js
// Helpers to extract human-friendly NGO info from Overpass elements

export function getDisplayName(ngo) {
  const tags = ngo.tags || {};
  // common name fields
  return (
    tags.name || tags['name:en'] || tags.official_name || tags.operator || tags.org || tags.organization || tags.organisation || tags['contact:person'] || null
  );
}

export function getAddress(tags) {
  if (!tags) return null;
  return (
    tags['addr:full'] ||
    [tags['addr:housenumber'], tags['addr:street'], tags['addr:city']].filter(Boolean).join(', ') ||
    tags['addr:street'] ||
    tags['addr:city'] ||
    null
  );
}

export function normalizeWebsite(url) {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
}
