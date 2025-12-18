const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Memory storage for Vercel (no file system)
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Canvas state storage
let canvasState = {
  width: 800,
  height: 600,
  elements: []
};

// Initialize canvas
app.post('/api/canvas/init', (req, res) => {
  const { width, height } = req.body;
  canvasState = {
    width: width || 800,
    height: height || 600,
    elements: []
  };
  res.json({ success: true, canvas: canvasState });
});

// Add rectangle
app.post('/api/canvas/rectangle', (req, res) => {
  const { x, y, width, height, color = '#000000' } = req.body;
  canvasState.elements.push({
    type: 'rectangle',
    x, y, width, height, color
  });
  res.json({ success: true, elements: canvasState.elements });
});

// Add circle
app.post('/api/canvas/circle', (req, res) => {
  const { x, y, radius, color = '#000000' } = req.body;
  canvasState.elements.push({
    type: 'circle',
    x, y, radius, color
  });
  res.json({ success: true, elements: canvasState.elements });
});

// Add text
app.post('/api/canvas/text', (req, res) => {
  const { x, y, text, fontSize = 16, color = '#000000' } = req.body;
  canvasState.elements.push({
    type: 'text',
    x, y, text, fontSize, color
  });
  res.json({ success: true, elements: canvasState.elements });
});

// Upload and add image
app.post('/api/canvas/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }
  
  const { x = 0, y = 0, width, height } = req.body;
  const base64 = req.file.buffer.toString('base64');
  const dataUrl = `data:${req.file.mimetype};base64,${base64}`;
  
  canvasState.elements.push({
    type: 'image',
    x: parseInt(x),
    y: parseInt(y),
    width: width ? parseInt(width) : undefined,
    height: height ? parseInt(height) : undefined,
    src: dataUrl
  });
  res.json({ success: true, elements: canvasState.elements });
});

// Get canvas state
app.get('/api/canvas/state', (req, res) => {
  res.json(canvasState);
});

// Export canvas data (client-side PDF generation)
app.get('/api/canvas/export', (req, res) => {
  res.json({
    success: true,
    canvas: canvasState,
    message: 'Use browser print function to save as PDF'
  });
});

module.exports = app;