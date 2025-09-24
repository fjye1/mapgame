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
    
    // Store original water volume before lake processing
    hex.originalWaterVolume = hex.waterVolume;
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

  // After rivers are marked, handle lakes
  handleLakes(hexMap);
}

export function addRiverToHex(hex, flowDirection) {
  const hexElement = document.querySelector(
    `[data-q="${hex.q}"][data-r="${hex.r}"][data-s="${hex.s}"]`
  );
  if (!hexElement) return;
  
  const riverOverlay = hexElement.querySelector('.river-overlay');
  // Clear any existing overlay
  riverOverlay.innerHTML = '';
  
  // --- Lakes ---
  if (hex.isLake) {
    const lakeDiv = document.createElement('div');
    lakeDiv.className = 'lake-fill';
    // Fill opacity based on how "deep" the lake is
    const depth = (hex.lakeLevel || hex.height) - hex.height;
    lakeDiv.style.backgroundColor = `rgba(50, 100, 200, ${Math.min(0.8, depth / 20)})`;
    riverOverlay.appendChild(lakeDiv);
  }
  
  // --- Rivers ---
  // Draw rivers if: it's a river hex, OR it's a lake with outflow, OR it's receiving overflow water
  if (hex.isRiver || hex.hasOutflow || hex.overflowWater > 0) {
    const riverLine = document.createElement('div');
    riverLine.className = 'river-line';
    
    // Use overflow water volume if present, otherwise use original water volume
    const effectiveVolume = hex.overflowWater || hex.originalWaterVolume || hex.waterVolume;
    riverLine.style.height = Math.min(6, Math.max(2, effectiveVolume / 500)) + 'px';
    
    // Direction classes (adjust as per your CSS)
    switch (flowDirection || hex.flowDirection) {
      case 0: riverLine.classList.add('river-horizontal'); break; // NE
      case 1: riverLine.classList.add('river-ne'); break;         // SE
      case 2: riverLine.classList.add('river-nw'); break;         // S
      case 3: riverLine.classList.add('river-horizontal'); break; // SW
      case 4: riverLine.classList.add('river-sw'); break;         // NW
      case 5: riverLine.classList.add('river-se'); break;         // N
    }
    
    riverOverlay.appendChild(riverLine);
  }
}

// --- lake filling ---
function floodFillBasin(startHex, hexMap, visited = new Set()) {
  const basin = [];
  const stack = [startHex];
  let rim = [];

  while (stack.length > 0) {
    const hex = stack.pop();
    const id = `${hex.q},${hex.r},${hex.s}`;
    if (visited.has(id)) continue;
    visited.add(id);

    basin.push(hex);

    for (const neighbor of getHexNeighbors(hex, hexMap)) {
      if (neighbor.height > hex.height) {
        // rim candidate
        rim.push(neighbor);
      } else {
        const nid = `${neighbor.q},${neighbor.r},${neighbor.s}`;
        if (!visited.has(nid)) {
          stack.push(neighbor);
        }
      }
    }
  }

  let outlet = null;
  let minHeight = Infinity;
  for (const r of rim) {
    if (r.height < minHeight) {
      minHeight = r.height;
      outlet = r;
    }
  }

  return { basin, outlet, outletHeight: minHeight };
}

function calculateLakeCapacity(basin, outletHeight) {
  let capacity = 0;
  for (const hex of basin) {
    if (outletHeight > hex.height) {
      capacity += (outletHeight - hex.height);
    }
  }
  return capacity;
}

function handleLakes(hexMap) {
  const visited = new Set();
  
  for (const hex of hexMap) {
    const id = `${hex.q},${hex.r},${hex.s}`;
    if (visited.has(id)) continue;
    if ((hex.waterVolume || 0) <= 0) continue;

    const { basin, outlet, outletHeight } = floodFillBasin(hex, hexMap, visited);
    if (!outlet) continue;

    const capacity = calculateLakeCapacity(basin, outletHeight);
    const totalWater = hex.waterVolume;

    if (totalWater > capacity) {
      // OVERFLOW CASE: Fill basin to capacity, send excess to outlet
      const overflowAmount = totalWater - capacity;
      
      // Mark all basin hexes as lakes
      for (const b of basin) {
        b.lakeLevel = outletHeight;
        b.isLake = true;
        
        // If this hex was originally a river, mark it as having outflow
        if (b.isRiver) {
          b.hasOutflow = true;
          // Keep the flow direction toward the outlet
          b.waterFlowTo = outlet;
          updateFlowDirection(b, outlet);
        }
      }
      
      // Send overflow to outlet
      outlet.overflowWater = (outlet.overflowWater || 0) + overflowAmount;
      outlet.isRiver = true; // Mark outlet as river to continue flow
      
      // Update outlet's flow direction if it doesn't have one
      if (!outlet.waterFlowTo) {
        const neighbors = getHexNeighbors(outlet, hexMap);
        let lowestNeighbor = null;
        let steepestDrop = 0;
        
        for (const n of neighbors) {
          const drop = outlet.height - n.height;
          if (drop > steepestDrop) {
            steepestDrop = drop;
            lowestNeighbor = n;
          }
        }
        
        if (lowestNeighbor) {
          outlet.waterFlowTo = lowestNeighbor;
          updateFlowDirection(outlet, lowestNeighbor);
        }
      }
      
    } else {
      // CLOSED BASIN: No overflow, becomes a terminal lake
      const avgWaterLevel = hex.height + totalWater / basin.length;
      
      for (const b of basin) {
        b.lakeLevel = avgWaterLevel;
        b.isLake = true;
        // Terminal lakes don't have outflow
        b.hasOutflow = false;
      }
    }
  }
}

// Helper function to update flow direction
function updateFlowDirection(fromHex, toHex) {
  const dq = toHex.q - fromHex.q;
  const dr = toHex.r - fromHex.r;
  
  if (dq === 1 && dr === -1) fromHex.flowDirection = 0; // NE
  else if (dq === 1 && dr === 0) fromHex.flowDirection = 1; // SE
  else if (dq === 0 && dr === 1) fromHex.flowDirection = 2; // S
  else if (dq === -1 && dr === 1) fromHex.flowDirection = 3; // SW
  else if (dq === -1 && dr === 0) fromHex.flowDirection = 4; // NW
  else if (dq === 0 && dr === -1) fromHex.flowDirection = 5; // N
}