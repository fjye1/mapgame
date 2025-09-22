// Hex.js
export class Hex {
  constructor(q, r, s, terrain, terrainColor,height,precipitation = 0, temp) {
    this.q = q;
    this.r = r;
    this.s = s;
    this.terrain = terrain;
    this.terrainColor = terrainColor;
    this.height = height; // <--- new
    this.precipitation = precipitation;
    this.temp = temp;

    // lower-level data
    this.groundResources = new groundResources(); // wood, stone, iron, food
    this.units = []; // array of units
    this.buildings = []; // array of buildings
    this.marketData = new MarketData(); // prices, demand, etc.
  }
}

// ground resouces present on every tile non replenishing
export class groundResources {
  constructor(stone =0, limestone=0, coal=0, iron=0, gold=0, salt=0) {
    this.stone = { amount: stone, eoe: 1 };       // default 100%
    this.limestone = { amount: limestone, eoe: 1 };
    this.coal = { amount: coal, eoe: 1 };
    this.iron = { amount: iron, eoe: 1 };
    this.gold = { amount: gold, eoe: 1 };
    this.salt = { amount: salt, eoe: 1 };
  }
    
}

//topsoil resources natural replenishment with time

export class TopSoil {
  constructor(wood = 0, food = 0, meat = 0, soil = 0, sand = 0, clay = 0) {
    this.wood = { amount: wood, eoe: 1 };   // default 100%
    this.food = { amount: food, eoe: 1 };
    this.meat = { amount: meat, eoe: 1 };
    this.soil = { amount: soil, eoe: 1 };
    this.sand = { amount: sand, eoe: 1 };
    this.clay = { amount: clay, eoe: 1 };
  }
}

class MarketData {
  constructor() {
    this.prices = {}; // e.g., { wheat: 10, iron: 50 }
    this.demand = {}; // e.g., { wheat: 0.8, iron: 0.3 }
  }
}
