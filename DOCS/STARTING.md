Setting Up the SEO Backlink Builder

This document provides detailed instructions for setting up the SEO Backlink Builder application for development and testing.

System Requirements

- Node.js v18.0.0 or higher
- npm v8.0.0 or higher
- MySQL v8.0 or higher
- Chrome (for web scraping functionality that uses Selenium)

Project Setup

1. Clone the Repository

git clone https://github.com/yourusername/seo-backlink-builder.git
cd seo-backlink-builder

2. Install Dependencies

The project uses npm workspaces to manage dependencies for both frontend and backend:

npm install

This command installs dependencies for:
- Root project
- Frontend application (React/Vite)
- Backend server (Node.js/Express)

3. Database Setup

The application requires a MySQL database:

1. Install MySQL if you haven't already
2. Create a new database:
   CREATE DATABASE leads_db;
3. The application will automatically create the required tables on first run

4. Environment Configuration

Create a .env file in the /backend directory with the following variables:

HYPERBOLIC_API_KEY=your_api_key_here

DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=leads_db
DB_PORT=3306

PORT=5005
CORS_ORIGIN=http://localhost:3000

5. Running the Application

Start both frontend and backend in development mode:

npm run dev

This command uses concurrently to start:
- Frontend: Vite dev server on port 3000
- Backend: Node.js server on port 5005

6. Verify Setup

1. Open your browser and navigate to http://localhost:3000
2. You should see the landing page of the SEO Backlink Builder
3. Navigate to the application page and test the article analysis functionality

Setting Up APIs

The application requires the following API integrations:

1. Hyperbolic API

This API is used for AI-based content analysis and SEO scoring.

1. Sign up for an account at Hyperbolic (https://hyperbolic.xyz)
2. Generate an API key from your dashboard
3. Add the key to your .env file as HYPERBOLIC_API_KEY

2. Selenium WebDriver (Optional)

For advanced web scraping features (like LinkedIn profile scraping):

1. Ensure Chrome is installed on your system
2. ChromeDriver is included as a dependency and should be installed automatically
3. No additional configuration is required for development environments

3. Testing API Setup

To verify your API setup is working:

1. Start the application
2. Navigate to the analyzer page
3. Paste a sample SEO article and click "Analyze Article"
4. If the analysis completes successfully, your API is configured correctly

Troubleshooting

Database Connection Issues

If you encounter database connection errors:

1. Verify MySQL is running: sudo service mysql status (Linux) or check Task Manager (Windows)
2. Confirm database credentials in your .env file
3. Ensure the leads_db database exists
4. Check network connectivity if using a remote database

API Integration Issues

If the content analysis is failing:

1. Verify your Hyperbolic API key is valid and correctly entered in .env
2. Check the server logs for specific error messages
3. Ensure your network allows outbound connections to the API endpoints

Other Common Issues

- Port conflicts: If ports 3000 or 5005 are already in use, you can modify them in:
  - Frontend: frontend/vite.config.js
  - Backend: .env file (PORT variable)

- Node version mismatch: Ensure you're using Node.js v18 or higher 