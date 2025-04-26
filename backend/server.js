import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import productRoutes from './routes/product.route.js';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Constants
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Middleware setup function
function setupMiddleware() {
  // Enable CORS for requests coming from http://localhost:5173
  const corsOptions = {
    origin: 'http://localhost:5173',
  };
  app.use(cors(corsOptions));

  // Parse incoming JSON requests
  app.use(express.json());
}

// Setup routes function
function setupRoutes() {
  try {
    console.log('Registering /api/products route');
    app.use('/api/products', productRoutes);
  } catch (err) {
    console.error('Error registering /api/products route:', err);
  }

  try {
    // Serve frontend static files and catch-all route in all environments
    const distPath = path.join(__dirname, '/frontend/dist');
    if (fs.existsSync(distPath)) {
      console.log('Serving static frontend files from:', distPath);
      app.use(express.static(distPath));
      // Serve product images statically from /uploads
      const uploadsPath = path.join(__dirname, '/uploads');
      if (fs.existsSync(uploadsPath)) {
        console.log('Serving static uploads files from:', uploadsPath);
        app.use('/uploads', express.static(uploadsPath));
      } else {
        console.warn('⚠️ Warning: uploads directory not found. Skipping uploads static file serving.');
      }
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    } else {
      console.warn('⚠️ Warning: frontend/dist not found. Skipping static file serving.');
    }
  } catch (err) {
    console.error('Error setting up static file serving:', err);
  }
}

// Error handling middleware
function errorHandler(err, req, res, next) {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
}

// Start server function
const startServer = async () => {
  try {
    await connectDB();
    setupMiddleware();
    setupRoutes();
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log('Server running at http://localhost:' + PORT);
    });
  } catch (error) {
    console.error('Failed to connect to DB:', error.message);
  }
};

// Start the server
startServer();