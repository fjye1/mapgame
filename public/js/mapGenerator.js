import { Hex, groundResources, TopSoil } from "./Hex.js";
import { TERRAIN_TYPES } from "./terrainConfig.js";
import { getDateFromDay } from "/js/dateUtils.js";



export function generateTemperature(
  q,
  r,
  s,
  height,
  dayOfYear,
  mapRadius = 32,
  minTemp = -20,
  maxTemp = 20
) {
  console.log({ q, r, s, height, dayOfYear }); // <--- first check

  if ([q, r, s, height, dayOfYear].some(v => typeof v !== "number")) {
    console.error("Invalid argument detected!");
    return 0; // fallback
  }

  // Base temperature from latitude
  const northSouth = r - s;
  let tempNorm = (northSouth + mapRadius) / (2 * mapRadius);
  tempNorm = Math.max(0, Math.min(1, tempNorm));
  let temp = minTemp + tempNorm * (maxTemp - minTemp);

  // Seasonal variation
  const totalDays = 1461;
  const phase = (dayOfYear / totalDays) * 2 * Math.PI;
  let seasonalFactor = Math.sin(phase - Math.PI / 2);

  // Coastal moderation (dampen swing if very low-lying)
  if (height < 100) {
    seasonalFactor *= 0.95; // shrink swing range
  }

  const seasonalAmplitude = 0.5 * (maxTemp - minTemp);
  temp += seasonalAmplitude * seasonalFactor;

  // Height adjustment (lapse rate)
  const heightModifier = (height / 1000) * 6.5;
  temp -= heightModifier;

  console.log("Temp calculated:", temp);

  return Math.floor(temp);
}

// height generation function
function generateHeight(q, r, seed = 78654, options = {}) {
  const { scale = 0.05, minHeight = -1000, maxHeight = 5000 } = options;

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

  // Normalize from approx -2 → +2 into 0 → 1
  let norm = (height + 2) / 4;

  // Map 0 → 1 into minHeight → maxHeight
  return Math.floor(minHeight + norm * (maxHeight - minHeight));
}

function terrainWeightByHeight(height) {
  return {
    // Deep ocean (-1000 to -200)
    DeepOcean: height < -200 ? 0.8 : height < -100 ? 0.4 : 0.1,

    // Shallow seas (-200 to -20)
    ShallowSea: height >= -200 && height < -20 ? 0.6 : 0.1,

    // Coast (-20 to 0)
    Coast: height >= -20 && height <= 0 ? 0.8 : 0.2,

    // Lowland plains (0 to 1000)
    Lowland: height > 0 && height <= 1000 ? 0.6 : 0.2,
    RiverDelta: height <= 200 && height >= 0 ? 0.7 : 0.1,
    Marsh: height <= 300 && height > 0 ? 0.5 : 0.1,

    // Mid elevations (1000–3000)
    Valley: height > 1000 && height <= 2000 ? 0.5 : 0.1,
    Steppe: height > 800 && height <= 2500 ? 0.5 : 0.1,
    Plateau: height > 1500 && height <= 3000 ? 0.5 : 0.1,

    // High elevations (3000–4000)
    Taiga: height > 2500 && height <= 3500 ? 0.5 : 0.1,
    Tundra: height > 3000 && height <= 4000 ? 0.6 : 0.1,

    // Alpine (4000–5000)
    AlpineMeadow: height > 4000 ? 0.7 : 0.1,
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

export function generatePrecipitation(hexMap, options = {}) {
  const {
    seaLevel = 0,
    maxCoastalRain = 200,  // mm/year, or arbitrary units
    inlandDropoff = 5,      // rain reduction per hex inland
    mountainThreshold = 2000, // height above which mountains influence rain
    minRain = 0,
    maxRain = 250,
  } = options;

  // Helper: cube distance between two hexes
  function cubeDistance(a, b) {
  if (!a || !b) {
    console.warn("cubeDistance got null hex:", a, b);
    return Infinity; // safe fallback
  }
  return Math.max(Math.abs(a.q - b.q), Math.abs(a.r - b.r), Math.abs(a.s - b.s));
}

  // Helper: find nearest coastal hex
  const coastHexes = hexMap.filter(h => h.height <= seaLevel);

  function getNearestCoast(hex) {
    let minDist = Infinity;
    let nearest = null;
    for (const coast of coastHexes) {
      const dist = cubeDistance(hex, coast);
      if (dist < minDist) {
        minDist = dist;
        nearest = coast;
      }
    }
    return { nearest, distance: minDist };
  }

  // Helper: simple line interpolation between two hexes
  function cubeLerp(a, b, t) {
    return {
      q: a.q + (b.q - a.q) * t,
      r: a.r + (b.r - a.r) * t,
      s: a.s + (b.s - a.s) * t,
    };
  }

  function cubeLine(a, b) {
    const N = cubeDistance(a, b);
    const line = [];
    for (let i = 0; i <= N; i++) {
      const t = N === 0 ? 0 : i / N;
      line.push(cubeLerp(a, b, t));
    }
    return line;
  }

  // Check if mountains block line to coast
  function hasMountainBarrier(hex, coastHex) {
    const line = cubeLine(hex, coastHex);
    for (const point of line) {
      const mapHex = hexMap.find(h => h.q === Math.round(point.q) && h.r === Math.round(point.r));
      if (mapHex && mapHex.height > mountainThreshold) return true;
    }
    return false;
  }

  // Assign precipitation to each hex
for (const hex of hexMap) {
  if (hex.height <= seaLevel) {
    hex.precipitation = 0; // water tile
    continue;
  }

  const { nearest, distance } = getNearestCoast(hex);

  if (!nearest) {
    // no coast exists, assign minimum rain and skip further checks
    hex.precipitation = minRain;
    continue;
  }

  let baseRain = maxCoastalRain - distance * inlandDropoff;

  if (hasMountainBarrier(hex, nearest)) {
    baseRain *= 0.3; // rain shadow
  } else if (hex.height > mountainThreshold) {
    baseRain *= 1.5; // windward bonus
  }

  hex.precipitation = Math.max(minRain, Math.min(maxRain, baseRain));
}

return hexMap;
}

// Generate the map 
export function generateMap(radius, dayOfYear) {
  const hexes = [];
  for (let q = -radius; q <= radius; q++) {
    for (let r = -radius; r <= radius; r++) {
      const s = -q - r;
      if (Math.abs(s) > radius) continue;
      // get height
      const height = generateHeight(q, r,undefined,  {
        scale: 0.03,
        minHeight: -1000,
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

      const hex = new Hex(q, r, s, terrain, config.terrainColor, height, undefined, temp);
      hex.groundResources = ground;
      hex.topSoil = topSoil;

      hexes.push(hex);
    }
  }
  generatePrecipitation(hexes)
  return hexes;
  
}

