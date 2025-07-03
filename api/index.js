// Serverless function for Vercel deployment
import express from 'express';
import { registerRoutes } from '../dist/routes.js';

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register API routes
registerRoutes(app);

// Export for Vercel
export default app;