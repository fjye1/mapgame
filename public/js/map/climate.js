export function generateTemperature(q, r, s, height, dayOfYear, mapRadius = 32, minTemp = -20, maxTemp = 20) {
  const northSouth = r - s;
  let tempNorm = (northSouth + mapRadius) / (2 * mapRadius);
  tempNorm = Math.max(0, Math.min(1, tempNorm));
  let temp = minTemp + tempNorm * (maxTemp - minTemp);

  const totalDays = 1461;
  const phase = (dayOfYear / totalDays) * 2 * Math.PI;
  let seasonalFactor = Math.sin(phase - Math.PI / 2);

  if (height < 100) seasonalFactor *= 0.95;

  const seasonalAmplitude = 0.5 * (maxTemp - minTemp);
  temp += seasonalAmplitude * seasonalFactor;

  temp -= (height / 1000) * 6.5; // lapse rate

  return Math.floor(temp);
}


// Precipitation 

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