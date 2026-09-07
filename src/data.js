// FANWEAR FORGE™ and BOOMBOX KIDS™ are confirmed. Concept names mirror the approved
// reference and must stay labeled as placeholders until explicitly approved.
export const generators = [
  { id: 'fanwear-forge', name: 'FANWEAR FORGE™', category: 'sports', image: 'fanwear', confirmed: true },
  { id: 'embellishment-house', name: 'THE EMBELLISHMENT HOUSE™', category: 'fashion', image: 'embellishment', confirmed: false },
  { id: 'boombox-kids', name: 'BOOMBOX KIDS™', category: 'kids', image: 'kids', confirmed: true },
  { id: 'bizgen', name: 'BIZGEN™', category: 'business', image: 'business', confirmed: false },
  { id: 'seasoned-celebrated', name: 'SEASONED & CELEBRATED™', category: 'holiday', image: 'seasonal', confirmed: false },
];
export const categories = [
  { id: 'sports', label: 'Sports & Fanwear', icon: 'shirt' },
  { id: 'fashion', label: 'Fashion & Apparel', icon: 'dress' },
  { id: 'craft', label: 'DTF & Crafting', icon: 'diamond' },
  { id: 'kids', label: 'Kids & Characters', icon: 'bear' },
  { id: 'business', label: 'Business & Marketing', icon: 'case' },
  { id: 'art', label: 'Art & Illustration', icon: 'palette' },
  { id: 'holiday', label: 'Holiday & Seasonal', icon: 'gift' },
  { id: 'all', label: 'All Generators', icon: 'grid' },
];
export function filterGenerators(category, query) {
  return generators.filter(item => (category === 'all' || item.category === category) && item.name.toLowerCase().includes(query.trim().toLowerCase()));
}
