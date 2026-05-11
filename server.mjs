import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors()); // open for local dev — all origins allowed
app.use(express.json({ limit: '50mb' }));

const VIDEOS_JSON = path.join(__dirname, 'videos.json');
const VIDEOS_DIR = path.join(__dirname, 'public', 'assets', 'videos');
const THUMBS_DIR = path.join(__dirname, 'public', 'assets', 'thumbnails');

if (!fs.existsSync(THUMBS_DIR)) fs.mkdirSync(THUMBS_DIR, { recursive: true });

function readVideos() {
  return JSON.parse(fs.readFileSync(VIDEOS_JSON, 'utf-8'));
}

function writeVideos(videos) {
  fs.writeFileSync(VIDEOS_JSON, JSON.stringify(videos, null, 2));
}

// Multer: video uploads → public/assets/videos/
const videoStorage = multer.diskStorage({
  destination: VIDEOS_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = file.originalname
      .replace(ext, '')
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase()
      .slice(0, 40);
    cb(null, `${Date.now()}-${safeName}${ext}`);
  },
});

// Multer: thumbnail uploads → public/assets/thumbnails/
const thumbStorage = multer.diskStorage({
  destination: THUMBS_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `thumb-${req.params.id}${ext}`);
  },
});

const uploadVideo = multer({ storage: videoStorage, limits: { fileSize: 500 * 1024 * 1024 } });
const uploadThumb = multer({ storage: thumbStorage, limits: { fileSize: 20 * 1024 * 1024 } });

// ── GET /api/videos ──────────────────────────────────────────────
app.get('/api/videos', (req, res) => {
  try {
    res.json(readVideos());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── POST /api/videos — upload new video ──────────────────────────
app.post('/api/videos', uploadVideo.single('file'), (req, res) => {
  try {
    const videos = readVideos();
    const label = req.body.label || req.file.originalname;
    const id = Date.now().toString();
    const newVideo = {
      id,
      src: `/assets/videos/${req.file.filename}`,
      label,
      thumbnail: null,
      addedAt: new Date().toISOString(),
    };
    videos.push(newVideo);
    writeVideos(videos);
    res.json(newVideo);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── PUT /api/videos/order — save new ordering ───────────────────
app.put('/api/videos/order', (req, res) => {
  try {
    const { order } = req.body; // array of ids
    const videos = readVideos();
    const reordered = order.map((id) => videos.find((v) => v.id === id)).filter(Boolean);
    writeVideos(reordered);
    res.json(reordered);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── PUT /api/videos/:id — update label ──────────────────────────
app.put('/api/videos/:id', (req, res) => {
  try {
    const videos = readVideos();
    const idx = videos.findIndex((v) => v.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    if (req.body.label !== undefined) videos[idx].label = req.body.label;
    writeVideos(videos);
    res.json(videos[idx]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── PUT /api/videos/:id/thumbnail — upload image ────────────────
app.put('/api/videos/:id/thumbnail', uploadThumb.single('file'), (req, res) => {
  try {
    const videos = readVideos();
    const idx = videos.findIndex((v) => v.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    videos[idx].thumbnail = `/assets/thumbnails/${req.file.filename}`;
    writeVideos(videos);
    res.json(videos[idx]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── POST /api/videos/:id/thumbnail/capture — save canvas frame ──
app.post('/api/videos/:id/thumbnail/capture', (req, res) => {
  try {
    const { dataUrl } = req.body; // base64 data URL
    const videos = readVideos();
    const idx = videos.findIndex((v) => v.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });

    const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
    const filename = `thumb-${req.params.id}.jpg`;
    fs.writeFileSync(path.join(THUMBS_DIR, filename), Buffer.from(base64Data, 'base64'));

    videos[idx].thumbnail = `/assets/thumbnails/${filename}`;
    writeVideos(videos);
    res.json(videos[idx]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── DELETE /api/videos/:id ───────────────────────────────────────
app.delete('/api/videos/:id', (req, res) => {
  try {
    const videos = readVideos();
    const filtered = videos.filter((v) => v.id !== req.params.id);
    writeVideos(filtered);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`\n  ✦ Admin API →  http://127.0.0.1:${PORT}\n`);
});
