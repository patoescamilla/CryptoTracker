const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Escribe una linea en /app/logs/app.log cada vez que algo ocurre.
const LOG_PATH = path.join(__dirname, "logs", "app.log");
fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });

function writeLog(level, message) {
  const line = `[${new Date().toISOString().replace("T", " ").slice(0, 19)}] ${level}: ${message}\n`;
  fs.appendFileSync(LOG_PATH, line);
  console.log(line.trim());
}

const QuerySchema = new mongoose.Schema({
  coin: String,
  priceUSD: Number,
  queriedAt: { type: Date, default: Date.now },
});

const Query = mongoose.model("Query", QuerySchema);

mongoose
  .connect(process.env.MONGO_URI || "mongodb://mongo:27017/cryptodb")
  .then(() => writeLog("INFO", "Conectado a MongoDB"))
  .catch((err) => writeLog("ERROR", `Fallo MongoDB: ${err.message}`));

app.get("/api/coins", async (req, res) => {
  try {
    writeLog("INFO", "Consulta realizada: /api/coins");
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 10,
          page: 1,
        },
      }
    );

    await Query.create({ coin: "top10", priceUSD: 0 });
    res.json(data);
  } catch (err) {
    writeLog("ERROR", `Fallo en conexion a CoinGecko: ${err.message}`);
    res.status(500).json({ error: "Error obteniendo datos" });
  }
});

app.get("/api/history", async (req, res) => {
  try {
    writeLog("INFO", "Consulta realizada: /api/history");
    const history = await Query.find().sort({ queriedAt: -1 }).limit(20);
    res.json(history);
  } catch (err) {
    writeLog("ERROR", `Fallo consultando historial: ${err.message}`);
    res.status(500).json({ error: "Error obteniendo historial" });
  }
});

app.get("/health", (req, res) => {
  writeLog("INFO", "Health check OK");
  res.json({ status: "OK" });
});

app.listen(3001, () => writeLog("INFO", "Servidor corriendo en puerto 3001"));
