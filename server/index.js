import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

// Add these lines right here
console.log('API Key:', process.env.OPENAI_API_KEY.replace(/./g, '*'));
console.log('API Key length:', process.env.OPENAI_API_KEY.length);
console.log('API Key first 3 chars:', process.env.OPENAI_API_KEY.substring(0, 3));
console.log('API Key last 3 chars:', process.env.OPENAI_API_KEY.slice(-3));
console.log('API Key pattern:', process.env.OPENAI_API_KEY.replace(/./g, (char, index) => index % 10 === 0 ? char : '*'));

// Your existing logging
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');
console.log('OPENAI_API_KEY length:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 'N/A');
if (process.env.OPENAI_API_KEY) {
    console.log('First 5 chars of API Key:', process.env.OPENAI_API_KEY.substring(0, 5));
} else {
    console.error('OPENAI_API_KEY is missing. Please check your .env file.');
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

import dalleRoutes from './routes/dalle.routes.js';

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.method === 'POST') {
    console.log('Request body:', JSON.stringify(req.body).substring(0, 200)); // Log first 200 chars of body
  }
  next();
});

app.use('/api/v1/dalle', dalleRoutes);

const PORT = process.env.PORT || 8080;

// Add this test route
app.get('/', (req, res) => {
  res.status(200).json('Hello DALL-E API'); 
});

app.get('/test-openai', async (req, res) => {
  try {
    const response = await openai.models.list();
    res.json({
      message: 'OpenAI connection successful',
      models: response.data.slice(0, 5) // Just send the first 5 models
    });
  } catch (error) {
    console.error('Error testing OpenAI:', error);
    res.status(500).json({ 
      message: 'OpenAI connection failed',
      error: error.message
    });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? '🥞' : err,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});
