import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDataStore } from './dataStore.js';
import usersRouter from './routes/users.js';
import matchRouter from './routes/match.js';
import requestsRouter from './routes/requests.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite client (localhost:5173 default)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logger for hackathon demo debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SkillSwap Backend API',
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY'),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/users', usersRouter);
app.use('/api/match', matchRouter);
app.use('/api/requests', requestsRouter);

// 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message
  });
});

// Initialize data and start server
async function startServer() {
  await initializeDataStore();
  app.listen(PORT, () => {
    console.log(`🚀 SkillSwap Server running at http://localhost:${PORT}`);
    console.log(`🔑 Gemini API status: ${process.env.GEMINI_API_KEY ? 'Configured' : 'Offline (using semantic fallback engine)'}`);
  });
}

startServer();
