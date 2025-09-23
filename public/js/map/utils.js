export function cubeDistance(a, b) {
  return Math.max(
    Math.abs(a.q - b.q),
    Math.abs(a.r - b.r),
    Math.abs(a.s - b.s)
  );
}

export function getHexesInRadius(hexes, center, radius) {
  return hexes.filter(h => cubeDistance(h, center) <= radius);
}

export function normalize(val, min, max) {
  return (val - min) / (max - min);
}

export function weightedRandomFromDict(dict) {
  const total = Object.values(dict).reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;
  for (const [key, weight] of Object.entries(dict)) {
    if (roll < weight) return key;
    roll -= weight;
  }
}