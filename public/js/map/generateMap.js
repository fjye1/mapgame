
import { Hex, groundResources, TopSoil } from "../Hex.js";        // up one folder
import { TERRAIN_TYPES } from "../terrainConfig.js";              // up one folder
import { generateHeight } from "./height.js";                    // same folder
import { generateTemperature, generatePrecipitation } from "./climate.js"; // same folder
import { terrainWeightByHeight } from "./terrain.js";            // same folder
import { weightedRandomFromDict } from "./utils.js";             // same folder
import { generateAllResources } from "./resources.js";           // same folder
import { generateRivers } from "./rivers.js"; // <-- import river generator

export function generateMap(radius, dayOfYear) {
  const hexes = [];

  for (let q = -radius; q <= radius; q++) {
    for (let r = -radius; r <= radius; r++) {
      const s = -q - r;
      if (Math.abs(s) > radius) continue;

      const height = generateHeight(q, r, undefined, {
        scale: 0.03,
        minHeight: -1000,
        maxHeight: 5000,
      });

      const temp = generateTemperature(q, r, s, height, dayOfYear);

      const terrain = weightedRandomFromDict(terrainWeightByHeight(height));
      const config = TERRAIN_TYPES[terrain];

      const hex = new Hex(q, r, s, terrain, config.terrainColor, height, undefined, temp);

      // resources from config (surface only)
      hex.groundResources = new groundResources(...Object.values(config.groundResources || {}));
      hex.topSoil = new TopSoil(...Object.values(config.topSoil || {}));

      // --- Add river overlay DOM container ---
      hex.domElement = document.createElement('div');
      hex.domElement.className = 'hex';
      hex.domElement.dataset.q = q;
      hex.domElement.dataset.r = r;
      hex.domElement.dataset.s = s;

      const terrainDiv = document.createElement('div');
      terrainDiv.className = `hex-terrain terrain-${terrain}`;
      hex.domElement.appendChild(terrainDiv);

      const riverOverlay = document.createElement('div');
      riverOverlay.className = 'river-overlay';
      hex.domElement.appendChild(riverOverlay);

      hexes.push(hex);
    }
  }

  // --- 2. Climate & resources ---
  generatePrecipitation(hexes);
  generateAllResources(hexes);

  // --- 3. Rivers ---
  generateRivers(hexes, 2000); // mark hex.isRiver

  // --- 4. Paint rivers on overlay ---
  hexes.forEach(hex => {
    if (hex.isRiver) {
      const line = document.createElement('div');
      line.className = 'river-line';
      // optional: scale line height by water volume
      const width = Math.min(6, Math.max(2, Math.floor(hex.waterVolume / 500)));
      line.style.height = width + 'px';
      hex.domElement.querySelector('.river-overlay').appendChild(line);
    }
  });

  return hexes;
}