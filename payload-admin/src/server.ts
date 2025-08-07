import express from 'express';
import payload from 'payload';
import cors from 'cors';
import { config } from 'dotenv';

config();

const app = express();

// Configure CORS to avoid SAML errors
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Middleware to handle preflight requests
app.options('*', cors());

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin');
});

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'your-secret-here',
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  // Add your own express routes here

  const PORT = process.env.PORT || 3001;
  
  app.listen(PORT, async () => {
    payload.logger.info(`Server listening on port ${PORT}`);
  });
};

start();