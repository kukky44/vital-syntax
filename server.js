import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const __dirname = process.cwd();
const folderPath = path.join(__dirname, "pattern_images");

// ensure folder exists
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

// allow large JSON body (for base64 image strings)
app.use(express.json({ limit: "10mb" }));

// serve static files (frontend + images)
app.use(express.static(__dirname));
app.use("/pattern_images", express.static(folderPath));

// endpoint to save canvas snapshot
app.post("/save-pattern", (req, res) => {
  const { dataUrl, filename } = req.body;

  if (!dataUrl || !filename) {
    return res.status(400).json({ success: false, message: "Invalid request" });
  }

  const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
  const filePath = path.join(folderPath, filename);

  fs.writeFile(filePath, base64Data, "base64", (err) => {
    if (err) {
      console.error("Error saving file:", err);
      return res.status(500).json({ success: false });
    }
    res.json({ success: true, path: `/pattern_images/${filename}` });
  });
});

// endpoint to list all saved images
app.get("/list-patterns", (req, res) => {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Error reading pattern_images:", err);
      return res.status(500).json({ success: false });
    }

    // return sorted (newest first)
    const sortedFiles = files.sort((a, b) => a.localeCompare(b));
    res.json({ success: true, files: sortedFiles });
  });
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
