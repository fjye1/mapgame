import { Hex, groundResources, TopSoil } from "./Hex.js";
import { TERRAIN_TYPES } from "./terrainConfig.js";
import { getDateFromDay } from "/js/dateUtils.js";



export function generateTemperature(q, r, s, height, dayOfYear, mapRadius = 32, minTemp = -20, maxTemp = 20) {
  console.log({ q, r, s, height, dayOfYear }); // <--- first check

  if ([q, r, s, height, dayOfYear].some(v => typeof v !== 'number')) {
    console.error("Invalid argument detected!");
    return 0; // fallback
  }

  const northSouth = r - s;
  let tempNorm = (northSouth + mapRadius) / (2 * mapRadius);
  tempNorm = Math.max(0, Math.min(1, tempNorm));

  let temp = minTemp + tempNorm * (maxTemp - minTemp);

  const totalDays = 1461;
  const phase = (dayOfYear / totalDays) * 2 * Math.PI;
  const seasonalAmplitude = 0.5 * (maxTemp - minTemp);
  temp += seasonalAmplitude * Math.sin(phase - Math.PI / 2);

  const heightModifier = (height / 1000) * 6.5;
  temp -= heightModifier;

  console.log("Temp calculated:", temp);

  return Math.floor(temp);
}

// height generation function
function generateHeight(q, r, seed = 1994, options = {}) {
  const { scale = 0.05, heightRange = 5000 } = options;

  const x = (3 / 2) * q;
  const y = Math.sqrt(3) * (r + q / 2);

  let height = 0;
  let amplitude = 1;
  let frequency = scale;

  for (let i = 0; i < 4; i++) {
    height +=
      Math.sin(x * frequency + seed) *
      Math.cos(y * frequency + seed * 2) *
      amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  height = (height + 2) / 4; // normalize roughly 0-1
  return Math.floor(height * heightRange);
}

function terrainWeightByHeight(height) {
  return {
    // Very high elevation (80-100)
    AlpineMeadow: height > 85 ? 0.8 : height > 80 ? 0.4 : 0.05,
    Tundra: height > 75 ? 0.7 : height > 70 ? 0.3 : 0.1,

    // High elevation (60-80)
    Taiga:
      height > 60 && height <= 75
        ? 0.6
        : height > 55 && height <= 80
        ? 0.3
        : 0.15,
    Plateau: height > 65 && height <= 85 ? 0.5 : 0.1,

    // Mid elevation (30-60)
    Steppe: height > 25 && height <= 55 ? 0.5 : 0.1,
    Valley: height > 15 && height <= 45 ? 0.4 : 0.1,

    // Low elevation (0-40)
    Lowland: height > 20 && height <= 50 ? 0.6 : 0.2,
    CoastalPlain: height <= 30 ? 0.5 : height <= 40 ? 0.2 : 0.05,

    // Very low elevation (0-25)
    RiverDelta: height <= 15 ? 0.7 : height <= 25 ? 0.3 : 0.05,
    Marsh: height <= 20 ? 0.4 : height <= 30 ? 0.2 : 0.02,
  };
}

function weightedRandomFromDict(dict) {
  const total = Object.values(dict).reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;
  for (const [key, weight] of Object.entries(dict)) {
    if (roll < weight) return key;
    roll -= weight;
  }
}

function randomInRange([min, max]) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMap(radius, dayOfYear) {
  const hexes = [];
  for (let q = -radius; q <= radius; q++) {
    for (let r = -radius; r <= radius; r++) {
      const s = -q - r;
      if (Math.abs(s) > radius) continue;
      // get height
      const height = generateHeight(q, r,undefined,  {
        scale: 0.03,
        heightRange: 5000,
      });
      //get temp
      const temp = generateTemperature(q, r, s, height, dayOfYear);

      // Get weights for this height
      const weights = terrainWeightByHeight(height);
      const terrain = weightedRandomFromDict(weights);

      // Now get terrain config
      const config = TERRAIN_TYPES[terrain];

      const groundConfig = config.groundResources || {
        stone: [0, 0],
        limestone: [0, 0],
        coal: [0, 0],
        iron: [0, 0],
        gold: [0, 0],
        salt: [0, 0],
      };
      const topConfig = config.topSoil || {
        wood: [0, 0],
        food: [0, 0],
        meat: [0, 0],
        soil: [0, 0],
        sand: [0, 0],
        clay: [0, 0],
      };

      const ground = new groundResources(
        randomInRange(groundConfig.stone),
        randomInRange(groundConfig.limestone),
        randomInRange(groundConfig.coal),
        randomInRange(groundConfig.iron),
        randomInRange(groundConfig.gold),
        randomInRange(groundConfig.salt)
      );

      const topSoil = new TopSoil(
        randomInRange(topConfig.wood),
        randomInRange(topConfig.food),
        randomInRange(topConfig.meat),
        randomInRange(topConfig.soil),
        randomInRange(topConfig.sand),
        randomInRange(topConfig.clay)
      );

      const hex = new Hex(q, r, s, terrain, config.terrainColor, height, temp);
      hex.groundResources = ground;
      hex.topSoil = topSoil;

      hexes.push(hex);
    }
  }
  return hexes;
}
