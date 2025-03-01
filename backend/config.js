/**
 * Application Configuration
 * Centralizes all configuration settings and validates required environment variables
 */
require('dotenv').config();

// Helper to validate required environment variables
const validateEnv = (key, fallback = null, isDev = false) => {
  const value = process.env[key] || fallback;
  
  if (!value && !isDev) {
    console.error(`Error: Environment variable ${key} is required in production`);
    process.exit(1);
  }
  
  return value;
};

// Determine environment
const NODE_ENV = process.env.NODE_ENV || 'development';
const isDev = NODE_ENV === 'development';

// API Keys Configuration
const API_KEYS = {
  // In production, this should be set as an environment variable with no fallback
  HYPERBOLIC: validateEnv('HYPERBOLIC_API_KEY', 
    // Only use this fallback in development
    isDev ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtZXphaW5tem5AZ21haWwuY29tIiwiaWF0IjoxNzM1NDAwMTA1fQ.gWCenzKcIrmd_3lvSpCPokbP6siW8DnnPH0BVfPAwCo' : null, 
    isDev
  )
};

// Database Configuration
const DB_CONFIG = {
  host: validateEnv('DB_HOST', '127.0.0.1', isDev),
  user: validateEnv('DB_USER', 'root', isDev),
  password: validateEnv('DB_PASSWORD', 'password', isDev),
  database: validateEnv('DB_NAME', 'leads_db', isDev),
  port: parseInt(validateEnv('DB_PORT', '3306', isDev), 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Server Configuration
const SERVER_CONFIG = {
  port: parseInt(process.env.PORT || '5005', 10),
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
  }
};

// Application Configuration
const APP_CONFIG = {
  env: NODE_ENV,
  isDev,
  api: {
    baseUrl: 'https://api.hyperbolic.xyz/v1'
  }
};

module.exports = {
  API_KEYS,
  DB_CONFIG,
  SERVER_CONFIG,
  APP_CONFIG
}; 