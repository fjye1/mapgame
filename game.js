import { generateMap } from "./mapGenerator.js";

import express from "express";
const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/game", (req, res) => {
  const map = generateMap(5);
  res.render("game.ejs", { map });
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});