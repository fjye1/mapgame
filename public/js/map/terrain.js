export function terrainWeightByHeight(height) {
  return {
    DeepOcean: height < -200 ? 0.8 : height < -100 ? 0.4 : 0.1,
    ShallowSea: height >= -200 && height < -20 ? 0.6 : 0.1,
    Coast: height >= -20 && height <= 0 ? 0.8 : 0.2,
    Lowland: height > 0 && height <= 1000 ? 0.6 : 0.2,
    RiverDelta: height <= 200 && height >= 0 ? 0.7 : 0.1,
    Marsh: height <= 300 && height > 0 ? 0.5 : 0.1,
    Valley: height > 1000 && height <= 2000 ? 0.5 : 0.1,
    Steppe: height > 800 && height <= 2500 ? 0.5 : 0.1,
    Plateau: height > 1500 && height <= 3000 ? 0.5 : 0.1,
    Taiga: height > 2500 && height <= 3500 ? 0.5 : 0.1,
    Tundra: height > 3000 && height <= 4000 ? 0.6 : 0.1,
    AlpineMeadow: height > 4000 ? 0.7 : 0.1,
  };
}