export function generateHeight(q, r, seed = 78654, options = {}) {
  const { scale = 0.05, minHeight = -1000, maxHeight = 5000 } = options;

  const x = (3 / 2) * q;
  const y = Math.sqrt(3) * (r + q / 2);

  let height = 0, amplitude = 1, frequency = scale;

  for (let i = 0; i < 4; i++) {
    height += Math.sin(x * frequency + seed) *
              Math.cos(y * frequency + seed * 2) *
              amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  const norm = (height + 2) / 4; // normalize -2..2 → 0..1
  return Math.floor(minHeight + norm * (maxHeight - minHeight));
}