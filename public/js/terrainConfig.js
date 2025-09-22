// terrainConfig.js
export const TERRAIN_TYPES = {
  Tundra: {
    weight: 0.1,
    groundResources: { stone: [0, 10], limestone: [0, 5], coal: [0, 0], iron: [0, 5], gold: [0, 0], salt: [0,0] },
    topSoil: { wood: [0,1], food: [0,5], meat: [0,2], soil: [0,2], sand: [0,1], clay: [0,1] },
    terrainColor: "lightgrey"
  },
  Taiga: {
    weight: 0.1,
    groundResources: { stone: [0,5], limestone: [0,2], coal: [0,0], iron: [0,2], gold: [0,0], salt: [0,0] },
    topSoil: { wood: [5,20], food: [0,5], meat: [0,3], soil: [1,3], sand: [0,1], clay: [0,1] },
    terrainColor: "darkgreen"
  },
  Valley: {
    weight: 0.1,
    groundResources: { stone: [5,20], limestone: [2,10], coal: [0,5], iron: [0,10], gold: [0,1], salt: [0,1] },
    topSoil: { wood: [5,15], food: [5,20], meat: [1,5], soil: [3,5], sand: [0,2], clay: [0,2] },
    terrainColor: "green"
  },
  Lowland: {
    weight: 0.1,
    groundResources: { stone: [0,5], limestone: [0,2], coal: [0,1], iron: [0,2], gold: [0,0], salt: [0,0] },
    topSoil: { wood: [2,10], food: [5,20], meat: [0,3], soil: [2,4], sand: [0,1], clay: [0,1] },
    terrainColor: "lightgreen"
  },
  Plateau: {
    weight: 0.05,
    groundResources: { stone: [10,30], limestone: [5,15], coal: [2,10], iron: [5,15], gold: [0,1], salt: [0,1] },
    topSoil: { wood: [0,5], food: [0,5], meat: [0,2], soil: [1,3], sand: [0,2], clay: [0,2] },
    terrainColor: "peru"
  },
  Steppe: {
    weight: 0.1,
    groundResources: { stone: [0,5], limestone: [0,3], coal: [0,1], iron: [0,3], gold: [0,0], salt: [0,1] },
    topSoil: { wood: [0,2], food: [5,15], meat: [1,4], soil: [2,4], sand: [0,2], clay: [0,1] },
    terrainColor: "khaki"
  },
  Marsh: {
    weight: 0.05,
    groundResources: { stone: [0,2], limestone: [0,1], coal: [0,0], iron: [0,1], gold: [0,0], salt: [0,0] },
    topSoil: { wood: [1,5], food: [3,10], meat: [0,2], soil: [2,3], sand: [0,1], clay: [1,2] },
    terrainColor: "darkcyan"
  },
  CoastalPlain: {
    weight: 0.05,
    groundResources: { stone: [0,3], limestone: [0,1], coal: [0,0], iron: [0,1], gold: [0,0], salt: [0,5] },
    topSoil: { wood: [2,10], food: [5,15], meat: [0,3], soil: [2,4], sand: [2,5], clay: [0,1] },
    terrainColor: "lightblue"
  },
  RiverDelta: {
    weight: 0.05,
    groundResources: { stone: [0,2], limestone: [0,1], coal: [0,0], iron: [0,1], gold: [0,0], salt: [0,2] },
    topSoil: { wood: [2,8], food: [10,25], meat: [1,5], soil: [3,5], sand: [2,4], clay: [1,2] },
    terrainColor: "deepskyblue"
  },
  AlpineMeadow: {
    weight: 0.05,
    groundResources: { stone: [0,15], limestone: [0,5], coal: [0,5], iron: [0,5], gold: [0,1], salt: [0,0] },
    topSoil: { wood: [0,3], food: [1,5], meat: [0,2], soil: [1,3], sand: [0,1], clay: [0,1] },
    terrainColor: "palegreen"
  },
  DeepOcean: {
    weight: 0.1,
    groundResources: { stone: [0, 0], limestone: [0, 0], coal: [0, 0], iron: [0, 0], gold: [0, 0], salt: [0, 0] },
    topSoil: { wood: [0, 0], food: [0, 0], meat: [0, 0], soil: [0, 0], sand: [0, 0], clay: [0, 0] },
    terrainColor: "darkblue"
  },
  ShallowSea: {
    weight: 0.1,
    groundResources: { stone: [0, 0], limestone: [0, 0], coal: [0, 0], iron: [0, 0], gold: [0, 0], salt: [0, 0] },
    topSoil: { wood: [0, 0], food: [0, 0], meat: [0, 0], soil: [0, 0], sand: [0, 0], clay: [0, 0] },
    terrainColor: "blue"
  },
  Coast: {
    weight: 0.1,
    groundResources: { stone: [0, 2], limestone: [0, 1], coal: [0, 0], iron: [0, 1], gold: [0, 0], salt: [0, 1] },
    topSoil: { wood: [0, 1], food: [0, 3], meat: [0, 1], soil: [0, 1], sand: [0, 2], clay: [0, 1] },
    terrainColor: "lightblue"
  }
};


// Map height -1000m to 5000m to 25+ color bands
export function getHeightColor(height) {
  // Sea levels
  if (height < -200) return "#00008B";   // deep ocean
  if (height < -100) return "#0000CD";   // mid ocean
  if (height < 0) return "#1E90FF";      // shallow sea / near coast

  // Land levels
  if (height < 100) return "#F4E1A0"; // light sandy color   // near coast
  if (height < 400) return "#4CAF50";    // very low land, green
  if (height < 600) return "#55C058";
  if (height < 800) return "#66C66B";
  if (height < 1000) return "#77CC7E";
  if (height < 1200) return "#88D391";
  if (height < 1400) return "#99D9A4";
  if (height < 1600) return "#AADDB7";
  if (height < 1800) return "#BBE3CA";
  if (height < 2000) return "#CCE6DD";
  if (height < 2200) return "#DDE9F0";
  if (height < 2400) return "#CD853F";    // brownish
  if (height < 2600) return "#B87333";
  if (height < 2800) return "#A0522D";
  if (height < 3000) return "#8B4513";
  if (height < 3200) return "#704214";
  if (height < 3400) return "#5A3611";
  if (height < 3600) return "#44400D";
  if (height < 3800) return "#808080";    // gray
  if (height < 4000) return "#A9A9A9";
  if (height < 4200) return "#C0C0C0";
  if (height < 4400) return "#D3D3D3";
  if (height < 4600) return "#E6E6E6";
  if (height < 4800) return "#F2F2F2";
  return "#FFFFFF";                        // snow/ice
}
// Map temperature -70 to 15°C to colors (cold = blue, warm = red)
export function getTempColor(temp) {
  if (temp >= 50) return "#100002";     // Extremely hot
  if (temp >= 45) return "#1F0007";     // Very hot
  if (temp >= 40) return "#39000E";     // Hot
  if (temp >= 35) return "#70001C";     // Warm
  if (temp >= 30) return "#C30031";     // Bright warm
  if (temp >= 27) return "#E13D32";     // Red-Orange warm

  if (temp >= 24) return "#F67639";     // Orange warm
  if (temp >= 22) return "#FC9F47";     // Orange
  if (temp >= 20) return "#FFB34C";     // Yellow-Orange
  if (temp >= 18) return "#FFC261";     // Yellow-Orange light
  if (temp >= 16) return "#FFC96C";     // Yellow
  if (temp >= 14) return "#FFD881";     // Yellow light
  if (temp >= 12) return "#FFE796";     // Light Yellow
  if (temp >= 10) return "#FFEEA1";     // Yellow-Green

  if (temp >= 8)  return "#E3ECAB";     // Light Green
  if (temp >= 6)  return "#CFECB2";     // Green
  if (temp >= 4)  return "#B6E3B7";     // Light Green
  if (temp >= 2)  return "#91D5BA";     // Mint Green
  if (temp >= 0)  return "#7FCEBC";     // Light Blue-Green
  if (temp >= -2) return "#60C3C1";     // Light Blue
  if (temp >= -4) return "#38AEC4";     // Light Blue
  if (temp >= -6) return "#1C92C2";     // Blue
  if (temp >= -8) return "#2F75AC";     // Blue medium
  if (temp >= -10)return "#425897";     // Dark Blue
  if (temp >= -15)return "#072376";     // Navy Blue
  if (temp >= -20)return "#01154F";     // Dark Navy
  if (temp >= -30)return "#010F38";     // Very Dark Blue
  if (temp >= -40)return "#01081E";     // Nearly Black

  return "#000000";                     // Extreme cold, below -40°C
}

export function getPrecipitationColor(precipitation) {
  if (precipitation < 50) return "#F0E68C";   // very dry, yellow
  if (precipitation < 100) return "#C2E699";  // dry, light green
  if (precipitation < 150) return "#66C2A5";  // moderate, green-blue
  if (precipitation < 200) return "#3288BD";  // wet, blue
  if (precipitation < 250) return "#5E4FA2";  // very wet, dark purple
  return "#2E0854";                     // extreme, deep purple
}




// if statements are bad so consider using this when things start to get to much to manage. 
// const heightColors = [
//   { max: 0, color: "#00008B" },
//   { max: 200, color: "#0000CD" },
//   { max: 400, color: "#1E90FF" },
//   { max: 600, color: "#00BFFF" },
//   { max: 800, color: "#87CEFA" },
//   { max: 1000, color: "#4CAF50" },
//   { max: 1200, color: "#55C058" },
//   // ... continue
//   { max: 5000, color: "#D3D3D3" },
//   { max: Infinity, color: "#FFFFFF" }
// ];

// export function getHeightColor(height) {
//   for (let i = 0; i < heightColors.length; i++) {
//     if (height < heightColors[i].max) return heightColors[i].color;
//   }
// }


// function lerpColor(a, b, t) {
//   const parse = c => c.match(/\w\w/g).map(h => parseInt(h, 16));
//   const [r1,g1,b1] = parse(a);
//   const [r2,g2,b2] = parse(b);
//   const r = Math.round(r1 + (r2-r1)*t);
//   const g = Math.round(g1 + (g2-g1)*t);
//   const b = Math.round(b1 + (b2-b1)*t);
//   return `rgb(${r},${g},${b})`;
// }

// const gradient = [
//   { height: -1000, color: "#00008B" },
//   { height: 0, color: "#87CEFA" },
//   { height: 800, color: "#4CAF50" },
//   { height: 5000, color: "#FFFFFF" }
// ];

// export function getHeightColor(height) {
//   for (let i = 0; i < gradient.length - 1; i++) {
//     if (height >= gradient[i].height && height < gradient[i+1].height) {
//       const t = (height - gradient[i].height) / (gradient[i+1].height - gradient[i].height);
//       return lerpColor(gradient[i].color, gradient[i+1].color, t);
//     }
//   }
//   return gradient[gradient.length-1].color;
// }