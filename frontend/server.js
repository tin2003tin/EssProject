import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();

app.use(express.static("public"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/home.html");
});

app.get("/room", (req, res) => {
  res.sendFile(__dirname + "/public/room.html");
});

app.get("/game", (req, res) => {
  res.sendFile(__dirname + "/public/game.html");
});

const PORT = 8081;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`============================================`);
  console.log(`Frontend Server ready at http://localhost:${PORT}`);
  console.log(`============================================`);
});
