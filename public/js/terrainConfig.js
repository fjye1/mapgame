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
  }
};


// Map height 0-5000m to 10 color bands
export function getHeightColor(height) {
  if (height < 200) return "#4CAF50";
  if (height < 400) return "#55C058";
  if (height < 600) return "#66C66B";
  if (height < 800) return "#77CC7E";
  if (height < 1000) return "#88D391";
  if (height < 1200) return "#99D9A4";
  if (height < 1400) return "#AADDB7";
  if (height < 1600) return "#BBE3CA";
  if (height < 1800) return "#CCE6DD";
  if (height < 2000) return "#DDE9F0";
  if (height < 2200) return "#CD853F"; // brownish
  if (height < 2400) return "#B87333";
  if (height < 2600) return "#A0522D";
  if (height < 2800) return "#8B4513";
  if (height < 3000) return "#704214";
  if (height < 3200) return "#5A3611";
  if (height < 3400) return "#44400D";
  if (height < 3600) return "#808080"; // gray
  if (height < 3800) return "#A9A9A9";
  if (height < 4000) return "#C0C0C0";
  if (height < 4200) return "#D3D3D3";
  if (height < 4400) return "#E6E6E6";
  if (height < 4600) return "#F2F2F2";
  if (height < 4800) return "#FAFAFA";
  return "#FFFFFF"; // snow/ice
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