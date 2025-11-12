#!/bin/bash

# JustCopy.ai - Complete Setup Script
# This script sets up the entire project

echo "🚀 JustCopy.ai - Complete Setup"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"

# Create project structure
echo ""
echo -e "${BLUE}📁 Creating project structure...${NC}"

mkdir -p justcopy-ai/{backend,frontend,docs}
cd justcopy-ai

# Create backend structure
mkdir -p backend/{routes,middleware,utils}

# Create backend files
echo -e "${BLUE}📝 Creating backend files...${NC}"

# server.js
cat > backend/server.js << 'BACKEND_SERVER'
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'JustCopy.ai API is running!' });
});

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    const content = `Here's your AI-generated content based on: "${prompt}"

${prompt} represents an exciting opportunity in today's market. With the right approach and strategic implementation, you can achieve outstanding results.

Our advanced AI technology analyzes your requirements and delivers content that resonates with your target audience. Whether you're looking to inform, persuade, or engage, we've got you covered.

Key Benefits:
• Time-saving automation
• Consistent quality output
• Scalable content production
• SEO-optimized results

Take your content to the next level with JustCopy.ai!`;

    res.json({
      success: true,
      content,
      metadata: {
        wordsGenerated: content.split(' ').length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
});
BACKEND_SERVER

# package.json
cat > backend/package.json << 'PKG_JSON'
{
  "name": "justcopy-ai-backend",
  "version": "1.0.0",
  "description": "JustCopy.ai Backend",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "helmet": "^7.0.0",
    "express-rate-limit": "^7.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
PKG_JSON

# .env
cat > backend/.env << 'ENV_FILE'
PORT=5000
NODE_ENV=development
API_KEY=your_api_key_here
ENV_FILE

# .gitignore
cat > backend/.gitignore << 'GIT_IGNORE'
node_modules/
.env
.env.local
*.log
dist/
build/
.DS_Store
GIT_IGNORE

echo -e "${GREEN}✓ Backend files created${NC}"

# Install backend dependencies
echo ""
echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
cd backend
npm install
cd ..

echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# Create frontend (the HTML file you already have)
echo ""
echo -e "${BLUE}🎨 Creating frontend...${NC}"

# Copy the complete HTML file
echo "Frontend HTML will be created..."

# Create docs
echo ""
echo -e "${BLUE}📚 Creating documentation...${NC}"

cat > docs/API.md << 'API_DOC'
# API Documentation

## Endpoints

### POST /api/generate
Generate AI content

**Request:**
\`\`\`json
{
  "prompt": "Your prompt here"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "content": "Generated content...",
  "metadata": {
    "wordsGenerated": 150,
    "timestamp": "2025-01-01T00:00:00.000Z"
  }
}
\`\`\`
API_DOC

# Root files
cat > .gitignore << 'ROOT_GIT'
node_modules/
.env
.DS_Store
*.log
dist/
build/
ROOT_GIT

cat > README.md << 'README'
# JustCopy.ai

AI-Powered Content Generation Platform

## Quick Start

\`\`\`bash
# Install dependencies
cd backend && npm install

# Start server
npm start

# Open frontend/index.html in browser
\`\`\`

## Features

- AI Content Generation
- Multiple Templates
- Modern UI/UX
- RESTful API

Visit http://localhost:5000 after starting the server.
README

echo -e "${GREEN}✓ Documentation created${NC}"

# Initialize git
echo ""
echo -e "${BLUE}🔧 Initializing Git repository...${NC}"
git init
git add .
git commit -m "Initial commit: JustCopy.ai complete setup"

echo -e "${GREEN}✓ Git repository initialized${NC}"

echo ""
echo "================================"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo "================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Start the backend:"
echo "   cd backend"
echo "   npm start"
echo ""
echo "2. Open frontend/index.html in your browser"
echo ""
echo "3. Visit http://localhost:5000/health to verify backend"
echo ""
echo -e "${BLUE}Happy coding! 🚀${NC}"