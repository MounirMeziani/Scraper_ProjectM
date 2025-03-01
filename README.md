# SEO Backlink Builder

## Quick Start

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/seo-backlink-builder.git
   cd seo-backlink-builder
   ```

2. Install dependencies for both frontend and backend:
   ```
   npm install
   ```
   This will install dependencies for the root and both workspaces.

3. Set up environment variables:
   - Create a `.env` file in the `/backend` directory
   - Add the following variables (adjust as needed):
     ```
     HYPERBOLIC_API_KEY=your_api_key_here
     DB_HOST=127.0.0.1
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=leads_db
     DB_PORT=3306
     ```

4. Set up the MySQL database:
   - Create a database named `leads_db`
   - The application will automatically create the required tables on startup

5. Start the development server:
   ```
   npm run dev
   ```

6. Open your browser:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - The backend API runs on port 5005

## Overview

- **Frontend:** Built with React (Vite), Tailwind CSS, and other UI tools.
- **Backend:** Built with Node.js and Express. It includes various API endpoints for analyzing SEO articles, extracting backlink opportunities, and more. 