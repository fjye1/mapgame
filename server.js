import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

// Needed because we’re in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (your /public folder)
app.use(express.static(path.join(__dirname, "public")));

// Tell Express to use EJS for views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Route for home page
app.get("/", (req, res) => {
  res.render("index.ejs", { title: 'Hex Grid'}); // looks for views/index.ejs
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});