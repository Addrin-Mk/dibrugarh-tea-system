const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static images and assets (satellite maps, estate photos)
const clientPublicDir = path.join(__dirname, '../client/public');
app.use('/assets', express.static(clientPublicDir));

// API Routes
app.use('/api', apiRoutes);

// In production, serve React static build
const clientDistDir = path.join(__dirname, '../client/dist');
if (require('fs').existsSync(clientDistDir)) {
  app.use(express.static(clientDistDir));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log('================================================================');
  console.log('🌿 Dibrugarh Tea Information System — Express API Server Active');
  console.log('📡 Server running on http://localhost:' + PORT);
  console.log('🔑 Credentials: Operator (ABCD / 11111) | Admin (Admin / 123)');
  console.log('================================================================');
});
