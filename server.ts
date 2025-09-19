import express from "express";
import { grapesOfWrath } from "./grapesOfWrath.ts";
import path from "path";
import { fileURLToPath } from "url";

// get dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5174;

app.use(express.json());

const chunks = grapesOfWrath.split(/(?<=\s)/);

app.get("/api/slow-stream", async (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");
  for (const chunk of chunks) {
    res.write(chunk);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  res.end("[END OF STREAM]\n");
});

app.listen(PORT, () => {
  console.log(`Express API listening on http://localhost:${PORT}`);
});

// Serve static files from dist
app.use(express.static(path.join(__dirname, "dist")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});