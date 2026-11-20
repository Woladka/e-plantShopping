export const demoProducts = [
  { id: 'plant_monstera', name: 'Monstera', emoji: '🌿', priceEur: 24.50, category: 'Indoor', description: 'A dramatic leafy indoor plant.' },
  { id: 'plant_sansevieria', name: 'Snake Plant', emoji: '🪴', priceEur: 19.90, category: 'Indoor', description: 'An easy-care upright plant.' },
  { id: 'plant_lavender', name: 'Lavender', emoji: '🌱', priceEur: 12.90, category: 'Outdoor', description: 'Fragrant purple blooms.' },
  { id: 'plant_cactus', name: 'Mini Cactus', emoji: '🌵', priceEur: 8.50, category: 'Indoor', description: 'Compact desert-inspired greenery.' },
];
export const formatEur = (n) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n);
