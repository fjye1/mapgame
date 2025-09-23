// --- helpers ---
export function cubeDistance(a, b) {
  return Math.max(Math.abs(a.q - b.q), Math.abs(a.r - b.r), Math.abs(a.s - b.s));
}

// Return the 6 neighbors of a hex
export function getHexNeighbors(hex, hexMap) {
  const directions = [
    { dq: 1, dr: -1, ds: 0 },
    { dq: 1, dr: 0, ds: -1 },
    { dq: 0, dr: 1, ds: -1 },
    { dq: -1, dr: 1, ds: 0 },
    { dq: -1, dr: 0, ds: 1 },
    { dq: 0, dr: -1, ds: 1 }
  ];

  return directions
    .map(d => hexMap.find(h => h.q === hex.q + d.dq && h.r === hex.r + d.dr && h.s === hex.s + d.ds))
    .filter(h => h); // remove undefined
}

// --- water flow ---
export function predictWaterFlow(hexMap) {
  for (const hex of hexMap) {
    let lowestNeighbor = null;
    let steepestDrop = 0;

    const neighbors = getHexNeighbors(hex, hexMap);
    for (const n of neighbors) {
      const drop = hex.height - n.height;
      if (drop > steepestDrop) {
        steepestDrop = drop;
        lowestNeighbor = n;
      }
    }

    hex.waterFlowTo = lowestNeighbor || null; // where this hex drains
  }
}

// --- accumulate water volume ---
export function calculateWaterVolume(hex, hexMap, visited = new Set()) {
  const id = `${hex.q},${hex.r},${hex.s}`;
  if (visited.has(id)) return 0;
  visited.add(id);

  let total = hex.precipitation || 0;

  // add water from hexes that flow into this one
  for (const h of hexMap) {
    if (h.waterFlowTo === hex) {
      total += calculateWaterVolume(h, hexMap, visited);
    }
  }

  hex.waterVolume = total;
  return total;
}

// --- rivers ---
export function generateRivers(hexMap, threshold = 200) {
  predictWaterFlow(hexMap);

  for (const hex of hexMap) {
    calculateWaterVolume(hex, hexMap);

    hex.isRiver = hex.waterVolume > threshold;

    // Set flowDirection toward the lowest neighbor
    if (hex.isRiver && hex.waterFlowTo) {
      const dq = hex.waterFlowTo.q - hex.q;
      const dr = hex.waterFlowTo.r - hex.r;
      const ds = hex.waterFlowTo.s - hex.s;

      // map direction vector to 0–5 (cube directions)
      if (dq === 1 && dr === -1) hex.flowDirection = 0; // NE
      else if (dq === 1 && dr === 0) hex.flowDirection = 1; // SE
      else if (dq === 0 && dr === 1) hex.flowDirection = 2; // S
      else if (dq === -1 && dr === 1) hex.flowDirection = 3; // SW
      else if (dq === -1 && dr === 0) hex.flowDirection = 4; // NW
      else if (dq === 0 && dr === -1) hex.flowDirection = 5; // N
    }
  }
}

export function addRiverToHex(hex, flowDirection) {
  const hexElement = document.querySelector(`[data-q="${hex.q}"][data-r="${hex.r}"][data-s="${hex.s}"]`);
  const riverOverlay = hexElement.querySelector('.river-overlay');

  // Clear any existing river
  riverOverlay.innerHTML = '';

  if (!hex.isRiver) return;

  // Create the river div
  const riverLine = document.createElement('div');
  riverLine.className = 'river-line';

  // Set width/height based on water volume
  riverLine.style.height = Math.min(6, Math.max(2, hex.waterVolume / 500)) + 'px';

  // Apply direction class
  switch(flowDirection) {
    case 0: riverLine.classList.add('river-horizontal'); break;
    case 1: riverLine.classList.add('river-ne'); break;
    case 2: riverLine.classList.add('river-nw'); break;
    case 3: riverLine.classList.add('river-horizontal'); break;
    case 4: riverLine.classList.add('river-sw'); break;
    case 5: riverLine.classList.add('river-se'); break;
  }

  riverOverlay.appendChild(riverLine);
}