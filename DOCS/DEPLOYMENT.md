Deployment Guide for SEO Backlink Builder

This guide covers how to deploy the SEO Backlink Builder application to production environments and how to host the leads database.

Deployment Options

Option 1: Traditional VPS/Cloud Server Deployment

This approach involves setting up your own virtual private server (VPS) to host both the frontend and backend applications.

Requirements
- VPS with at least 2GB RAM (e.g., DigitalOcean Droplet, AWS EC2, Linode)
- Ubuntu 20.04 LTS or similar Linux distribution
- Domain name with DNS access

1. Server Setup

Basic Server Configuration

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (v18.x)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install nginx
sudo apt install -y nginx

# Install MySQL
sudo apt install -y mysql-server

# Secure MySQL installation
sudo mysql_secure_installation

# Install PM2 for process management
sudo npm install -g pm2

Configure MySQL

# Log into MySQL
sudo mysql

# Create database and user
CREATE DATABASE leads_db;
CREATE USER 'backlink_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON leads_db.* TO 'backlink_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

2. Deploy the Application

Clone and Build the Application

# Clone repository
git clone https://github.com/yourusername/seo-backlink-builder.git
cd seo-backlink-builder

# Install dependencies
npm install

# Create backend .env file
cat > backend/.env << EOF
HYPERBOLIC_API_KEY=your_api_key_here
DB_HOST=localhost
DB_USER=backlink_user
DB_PASSWORD=strong_password_here
DB_NAME=leads_db
DB_PORT=3306
NODE_ENV=production
EOF

# Build frontend
cd frontend
npm run build
cd ..

Configure PM2 for Backend

# Start backend with PM2
cd backend
pm2 start server.js --name "backlink-backend"
pm2 save
pm2 startup
cd ..

Configure Nginx

# Create nginx configuration
sudo nano /etc/nginx/sites-available/backlink-builder

# Add the following configuration
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Frontend static files
    location / {
        root /path/to/seo-backlink-builder/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API proxy
    location /api/ {
        proxy_pass http://localhost:5005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable the site
sudo ln -s /etc/nginx/sites-available/backlink-builder /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Set up SSL with Certbot
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

3. Maintenance and Updates

# Update application
cd /path/to/seo-backlink-builder
git pull
npm install

# Rebuild frontend
cd frontend
npm run build

# Restart backend
pm2 restart backlink-backend

Option 2: Containerized Deployment with Docker

This approach uses Docker containers for easier deployment and scaling.

Prerequisites
- Server with Docker and Docker Compose installed
- Domain name with DNS access

1. Create Docker Configuration

Create docker-compose.yml

version: '3'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root_password_here
      MYSQL_DATABASE: leads_db
      MYSQL_USER: backlink_user
      MYSQL_PASSWORD: user_password_here
    volumes:
      - mysql_data:/var/lib/mysql
    restart: always
    networks:
      - app-network

  backend:
    build:
      context: ./backend
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_USER=backlink_user
      - DB_PASSWORD=user_password_here
      - DB_NAME=leads_db
      - DB_PORT=3306
      - HYPERBOLIC_API_KEY=your_api_key_here
    depends_on:
      - mysql
    restart: always
    networks:
      - app-network

  frontend:
    build:
      context: ./frontend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf:/etc/nginx/conf.d
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    depends_on:
      - backend
    restart: always
    networks:
      - app-network

volumes:
  mysql_data:

networks:
  app-network:
    driver: bridge

Create Dockerfile for Backend

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5005

CMD ["node", "server.js"]

Create Dockerfile for Frontend

FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

Create Nginx Default Configuration

# nginx/default.conf
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://backend:5005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

2. Deploy with Docker Compose

# Start the application
docker-compose up -d

# Set up SSL with Certbot
docker-compose run --rm certbot certonly --webroot -w /var/www/certbot -d yourdomain.com -d www.yourdomain.com

Option 3: Cloud Platform Deployment

Deploying to Render.com

Render offers a simple deployment process for full-stack applications.

1. Create a Render account at render.com

2. Set up the web service for the backend:
   - Create a new Web Service
   - Connect your GitHub repository
   - Configure the build settings:
     - Root Directory: backend
     - Build Command: npm install
     - Start Command: node server.js
   - Add environment variables (same as .env file)

3. Set up the static site for the frontend:
   - Create a new Static Site
   - Connect the same GitHub repository
   - Configure build settings:
     - Root Directory: frontend
     - Build Command: npm install && npm run build
     - Publish Directory: dist
   - Set the environment variable for the backend URL:
     - VITE_API_URL=https://your-backend-service.onrender.com

4. Set up a managed database:
   - Create a new PostgreSQL database
   - Get the connection details and update the backend environment variables

Deploying to Vercel/Netlify + Railway

1. Deploy frontend to Vercel/Netlify:
   - Connect your GitHub repository
   - Set build directory as frontend
   - Configure build settings:
     - Build Command: npm install && npm run build
     - Output Directory: dist
   - Set environment variables

2. Deploy backend to Railway:
   - Create a new project
   - Connect your GitHub repository
   - Set the root directory to backend
   - Add a MySQL database from the Railway marketplace
   - Configure environment variables

Hosting Leads Database

Option 1: Self-Hosted MySQL

Pros:
- Complete control over your database
- No monthly subscription costs beyond server hosting
- Ability to customize backup strategies

Cons:
- Requires database administration knowledge
- You are responsible for security, backups, and maintenance

Implementation:
1. Install MySQL on your server
2. Configure regular backups using mysqldump
3. Set up monitoring for the database server
4. Implement proper security measures (firewall, secure users, etc.)

Option 2: Managed MySQL Database Services

Amazon RDS

Pros:
- Managed backups, patching, and scaling
- High availability options
- Integrated with AWS ecosystem

Cons:
- Can be expensive as your database grows
- Learning curve for AWS configuration

Setup Steps:
1. Create an RDS instance in the AWS Console
2. Configure security groups to allow access from your application
3. Update your application environment variables with the connection details

DigitalOcean Managed MySQL

Pros:
- Simple, predictable pricing
- User-friendly interface
- Automatic daily backups

Cons:
- Fewer advanced features than RDS
- Limited scaling options

Setup Steps:
1. Create a managed MySQL cluster in the DigitalOcean dashboard
2. Configure firewall to allow connections from your application
3. Update your application environment variables

Option 3: Railway or PlanetScale

These newer platforms offer simplified database management.

Railway

Pros:
- Simple setup and management
- Automatic scaling
- Integrates directly with your application deployment

Setup Steps:
1. Create a MySQL database in your Railway project
2. Connect it to your application service
3. Environment variables are automatically injected

PlanetScale (MySQL-compatible)

Pros:
- Serverless database platform
- Branch-based workflow for schema changes
- Excellent free tier

Setup Steps:
1. Create a PlanetScale account
2. Create a new database
3. Use the connection string in your application

Backup Strategy

Regardless of hosting choice, implement the following backup strategy:

1. Daily automated backups
   - If self-hosted: Use a cron job with mysqldump
   - If managed: Enable automated backups from the provider

2. Point-in-time recovery
   - Enable binary logging to allow recovery to a specific moment

3. Offsite backups
   - Store backups in a separate cloud storage (S3, Google Cloud Storage)
   - Rotate backups (keep daily for a week, weekly for a month, monthly for a year)

4. Regular backup testing
   - Periodically verify backups by restoring to a test environment

Scaling Considerations

As your user base grows:

1. Database Scaling
   - Start with vertical scaling (increase resources)
   - Consider read replicas for read-heavy workloads
   - Implement connection pooling

2. Application Scaling
   - Use a load balancer for multiple backend instances
   - Implement caching (Redis) for frequently accessed data
   - Consider microservices architecture for specific features

3. Monitoring
   - Set up monitoring with tools like Prometheus, Grafana
   - Configure alerts for unusual database behavior
   - Monitor application performance metrics

Security Best Practices

1. Database Security
   - Use strong, unique passwords
   - Limit database access to specific IP addresses
   - Use SSL for database connections
   - Implement least privilege principle for database users

2. Application Security
   - Keep all dependencies updated
   - Implement rate limiting
   - Use proper input validation
   - Set up HTTPS with proper SSL/TLS configuration

3. Infrastructure Security
   - Configure firewalls
   - Keep server software updated
   - Use SSH keys instead of passwords
   - Implement intrusion detection

# Database Clarification

## MongoDB vs MySQL Considerations

While the original architecture documentation mentions MongoDB with Mongoose, the current implementation uses MySQL. Here's guidance for both options:

### MySQL Implementation (Current)
- Follow the MySQL setup instructions in the deployment guide
- The application is configured to use mysql2 for better performance

### MongoDB Alternative
If you prefer using MongoDB as mentioned in the architecture docs:
1. Replace the MySQL installation steps with:
   ```
   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt update
   sudo apt install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

2. Update the backend .env file with MongoDB connection string instead of MySQL credentials 

## Additional Security Considerations

### Web Scraping Compliance
- Configure appropriate request delays between scraping operations to avoid IP blocking
- Add proper user agent strings to identify your scraper responsibly
- Consider implementing a proxy rotation system for high-volume scraping

### API Key Protection
- Store the Hyperbolic API key in environment variables
- For Docker deployments, use Docker secrets for sensitive credentials
- Consider using a vault service like HashiCorp Vault for enterprise deployments

### Rate Limiting Implementation
- Install and configure rate limiting for your Express app:
  ```
  # Install rate limiting package
  npm install express-rate-limit
  ```
  
- Add to server.js:
  ```javascript
  const rateLimit = require('express-rate-limit');
  
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  });
  
  // Apply to all API endpoints
  app.use('/api/', apiLimiter);
  ``` 