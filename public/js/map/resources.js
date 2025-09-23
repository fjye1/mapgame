// --- helpers ---
export function cubeDistance(a, b) {
  return Math.max(
    Math.abs(a.q - b.q),
    Math.abs(a.r - b.r),
    Math.abs(a.s - b.s)
  );
}

function getHexesInRadius(hexes, center, radius) {
  return hexes.filter((h) => cubeDistance(h, center) <= radius);
}

// Resource deposit maxes (tonnes)
const MAX_DEPOSITS = {
  stone: 1000000,
  limestone: 1500000,
  coal: 750000,
  iron: 1000000,
  gold: 100,
  salt: 600000,
};

// Resource cluster parameters
const RESOURCE_CONFIG = {
  stone: { freq: 0.3, radius: 4 },
  limestone: { freq: 0.25, radius: 3 },
  coal: { freq: 0.2, radius: 3 },
  iron: { freq: 0.15, radius: 4 },
  gold: { freq: 0.1, radius: 2 },
  salt: { freq: 0.1, radius: 3 },
};

// --- resources ---
export function generateAllResources(hexes) {
  const hVals = hexes.map((h) => h.height);
  const tVals = hexes.map((h) => h.temp);
  const pVals = hexes.map((h) => h.precipitation);

  const hMin = Math.min(...hVals),
    hMax = Math.max(...hVals);
  const tMin = Math.min(...tVals),
    tMax = Math.max(...tVals);
  const pMin = Math.min(...pVals),
    pMax = Math.max(...pVals);

  for (const hex of hexes) {
    const hN = (hex.height - hMin) / (hMax - hMin); // 0–1 height
    const tN = (hex.temp - tMin) / (tMax - tMin); // 0–1 temp
    const pN = (hex.precipitation - pMin) / (pMax - pMin); // 0–1 precip

    // STONE
    if (Math.random() < RESOURCE_CONFIG.stone.freq) {
      const clusterCenter = hex;
      const nearby = getHexesInRadius(
        hexes,
        clusterCenter,
        RESOURCE_CONFIG.stone.radius
      );
      for (const h of nearby) {
        const dist = cubeDistance(h, clusterCenter);
        const factor = 1 - dist / RESOURCE_CONFIG.stone.radius;
        h.groundResources.stone.amount = Math.floor(
          Math.random() * MAX_DEPOSITS.stone * (0.3 + 0.7 * hN) * factor
        );
      }
    }

    // LIMESTONE (warm, low)
    if (
      hN < 0.3 &&
      tN > 0.6 &&
      Math.random() < RESOURCE_CONFIG.limestone.freq
    ) {
      const clusterCenter = hex;
      const nearby = getHexesInRadius(
        hexes,
        clusterCenter,
        RESOURCE_CONFIG.limestone.radius
      );
      for (const h of nearby) {
        const dist = cubeDistance(h, clusterCenter);
        const factor = 1 - dist / RESOURCE_CONFIG.limestone.radius;
        h.groundResources.limestone.amount = Math.floor(
          Math.random() * MAX_DEPOSITS.limestone * factor
        );
      }
    }

    // COAL (near limestone + high precip)
    if (
      hex.groundResources.limestone.amount > 0 &&
      pN > 0.7 &&
      Math.random() < RESOURCE_CONFIG.coal.freq
    ) {
      const clusterCenter = hex;
      const nearby = getHexesInRadius(
        hexes,
        clusterCenter,
        RESOURCE_CONFIG.coal.radius
      );
      for (const h of nearby) {
        const dist = cubeDistance(h, clusterCenter);
        const factor = 1 - dist / RESOURCE_CONFIG.coal.radius;
        h.groundResources.coal.amount = Math.floor(
          Math.random() * MAX_DEPOSITS.coal * factor
        );
      }
    }

    // IRON (mountains, esp near limestone)
    if (hN > 0.5 && Math.random() < RESOURCE_CONFIG.iron.freq) {
      const clusterCenter = hex;
      const nearby = getHexesInRadius(
        hexes,
        clusterCenter,
        RESOURCE_CONFIG.iron.radius
      );
      for (const h of nearby) {
        const dist = cubeDistance(h, clusterCenter);
        const factor = 1 - dist / RESOURCE_CONFIG.iron.radius;
        h.groundResources.iron.amount = Math.floor(
          Math.random() * MAX_DEPOSITS.iron * factor
        );
      }
    }

    // GOLD (rare, peaks)
    if (hN > 0.8 && Math.random() < RESOURCE_CONFIG.gold.freq) {
      const clusterCenter = hex;
      const nearby = getHexesInRadius(
        hexes,
        clusterCenter,
        RESOURCE_CONFIG.gold.radius
      );
      for (const h of nearby) {
        const dist = cubeDistance(h, clusterCenter);
        const factor = 1 - dist / RESOURCE_CONFIG.gold.radius;
        h.groundResources.gold.amount = Math.floor(
          Math.random() * MAX_DEPOSITS.gold * factor
        );
      }
    }

    // SALT (low, hot, dry)
    if (
      hN < 0.15 &&
      tN > 0.7 &&
      pN < 0.3 &&
      Math.random() < RESOURCE_CONFIG.salt.freq
    ) {
      const clusterCenter = hex;
      const nearby = getHexesInRadius(
        hexes,
        clusterCenter,
        RESOURCE_CONFIG.salt.radius
      );
      for (const h of nearby) {
        const dist = cubeDistance(h, clusterCenter);
        const factor = 1 - dist / RESOURCE_CONFIG.salt.radius;
        h.groundResources.salt.amount = Math.floor(
          Math.random() * MAX_DEPOSITS.salt * factor
        );
      }
    }
  }

  return hexes;
}
