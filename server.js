import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// File paths
const DATA_DIR = join(__dirname, 'public', 'data');
const NFT_FILE = join(DATA_DIR, 'nft.json');
const ORDERS_FILE = join(DATA_DIR, 'orders.json');
const SETTINGS_FILE = join(DATA_DIR, 'settings.json');

// Ensure data directory exists
await fs.mkdir(DATA_DIR, { recursive: true });

// Initialize files if they don't exist
const initializeFile = async (filePath, defaultContent) => {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(defaultContent, null, 2));
  }
};

await initializeFile(NFT_FILE, { nfts: [] });
await initializeFile(ORDERS_FILE, { orders: [] });
await initializeFile(SETTINGS_FILE, {
  admin: { username: 'PlanC', password: 'Ceyhun8387@' },
  burn: { pending: 0, total: 0 }
});

// API Routes
app.get('/data/nft.json', async (req, res) => {
  try {
    const data = await fs.readFile(NFT_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read NFT data' });
  }
});

app.get('/data/orders.json', async (req, res) => {
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read orders data' });
  }
});

app.get('/data/settings.json', async (req, res) => {
  try {
    const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read settings data' });
  }
});

app.put('/data/nft.json', async (req, res) => {
  try {
    await fs.writeFile(NFT_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to write NFT data' });
  }
});

app.put('/data/orders.json', async (req, res) => {
  try {
    await fs.writeFile(ORDERS_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to write orders data' });
  }
});

app.put('/data/settings.json', async (req, res) => {
  try {
    const settings = JSON.stringify(req.body, null, 2);
    await fs.writeFile(SETTINGS_FILE, settings);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to write settings data' });
  }
});

// Create Vite server in middleware mode
const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'spa'
});

// Use Vite's middleware
app.use(vite.middlewares);

// Serve static files from the dist directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
  
  // Handle client-side routing
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
