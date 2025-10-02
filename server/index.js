// server/index.js
// Simple Express server to serve NASA regolith data
// Usage: node server/index.js (runs on port 4000)

const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS for development
app.use(cors());
app.use(express.json());

// Load regolith data from local JSON files
async function loadRegolithData(site) {
  try {
    const filename = `regolith_${site.toLowerCase()}.json`;
    const filepath = path.join(__dirname, 'data', filename);
    const data = await fs.readFile(filepath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.warn(`Could not load regolith data for site: ${site}`, error.message);
    return null;
  }
}

// API endpoint for regolith data
app.get('/api/regolith', async (req, res) => {
  const site = req.query.site || 'jezero';
  console.log(`Fetching regolith data for site: ${site}`);
  
  try {
    const data = await loadRegolithData(site);
    
    if (data) {
      res.json(data);
    } else {
      // Return fallback Jezero data if specific site not found
      const fallbackData = {
        site: "Jezero Crater (Fallback)",
        source: "Built-in fallback data",
        bulk_density_kg_m3: 1420,
        grain_size_mm: {
          median: 0.45,
          d10: 0.08,
          d90: 1.6
        },
        mineral_wt_percent: {
          SiO2: 44.8,
          Al2O3: 7.9,
          Fe2O3: 13.6,
          MgO: 7.5,
          CaO: 6.8,
          Na2O: 1.9,
          K2O: 0.4,
          TiO2: 1.0,
          SO3: 2.1,
          Cl: 0.6
        },
        glass_content_pct: 9.0,
        carbonate_pct: 2.5,
        perchlorate_ppm: 900,
        notes: "Fallback composition for demo purposes. Replace with actual NASA PDS data."
      };
      res.json(fallbackData);
    }
  } catch (error) {
    console.error('Error serving regolith data:', error);
    res.status(500).json({ error: 'Failed to load regolith data' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Regolith API server running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Regolith API server running on http://localhost:${PORT}`);
  console.log(`📡 Endpoints:`);
  console.log(`   GET /api/regolith?site=jezero`);
  console.log(`   GET /api/health`);
});