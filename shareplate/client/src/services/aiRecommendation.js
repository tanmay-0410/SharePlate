// src/services/aiRecommendation.js
// Placeholder for future AI recommendation system

export async function recommendNGO(donationDetails, ngos) {
  // For now, a simple heuristic: return nearest NGO that matches basic keywords.
  // Later: plug in ML model or external AI to analyze donation intent.
  if (!donationDetails || !ngos?.length) return null;
  // prefer NGOs with 'food' in tags
  const candidates = ngos.filter(n => JSON.stringify(n.tags || {}).toLowerCase().includes('food'));
  return (candidates.length ? candidates : ngos)[0] || null;
}
