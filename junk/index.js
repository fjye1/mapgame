import express from "express";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.render("hexgrid.ejs", { title: 'Hex Grid', gridRadius: 8 });
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});

class Hex {
    constructor(q, r) {
        this.q = q;
        this.r = r;
    }
}

class Cube {
    constructor(q, r, s) {
        this.q = q;
        this.r = r;
        this.s = s;
        if (Math.round(q + r + s) !== 0) throw "q + r + s must be 0";
    }
    
    equals(other) {
        return this.q === other.q && this.r === other.r && this.s === other.s;
    }
}

function OffsetCoord(col, row) {
    this.col = col;
    this.row = row;
}

function cubeToAxial(cube) {
    const q = cube.q;
    const r = cube.r;
    return new Hex(q, r);
}

function axialToCube(hex) {
    const q = hex.q;
    const r = hex.r;
    const s = -q - r;
    return new Cube(q, r, s);
}

function axialToEvenq(hex) {
    const parity = hex.q & 1;
    const col = hex.q;
    const row = hex.r + Math.floor((hex.q + parity) / 2);
    return new OffsetCoord(col, row);
}

function evenqToAxial(hex) {
    const parity = hex.col & 1;
    const q = hex.col;
    const r = hex.row - Math.floor((hex.col + parity) / 2);
    return new Hex(q, r);
}

// Direction vectors for the 6 surrounding hexagons in cube coordinates
const cubeDirectionVectors = [
    new Cube(+1,  0, -1),  // Direction 0: East
    new Cube(+1, -1,  0),  // Direction 1: Northeast  
    new Cube( 0, -1, +1),  // Direction 2: Northwest
    new Cube(-1,  0, +1),  // Direction 3: West
    new Cube(-1, +1,  0),  // Direction 4: Southwest
    new Cube( 0, +1, -1),  // Direction 5: Southeast
];

function cubeDirection(direction) {
    return cubeDirectionVectors[direction];
}

function cubeAdd(hex, vec) {
    return new Cube(hex.q + vec.q, hex.r + vec.r, hex.s + vec.s);
}

function cubeNeighbor(cube, direction) {
    return cubeAdd(cube, cubeDirection(direction));
}

function cubeDistance(Hex_A, Hex_B) {
  return (Math.abs(Hex_A.q - Hex_B.q) + Math.abs(Hex_A.r - Hex_B.r) + Math.abs(Hex_A.s - Hex_B.s)) / 2;
}