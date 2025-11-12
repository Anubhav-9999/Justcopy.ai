// backend/server.js - JustCopy.ai Backend Server
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'JustCopy.ai API is running!' });
});

// Generate content endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, options = {} } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Simulate AI content generation
    // In production, this would call OpenAI API or similar
    const generated = await generateContent(prompt, options);

    res.json({
      success: true,
      content: generated,
      metadata: {
        wordsGenerated: generated.split(' ').length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate content',
      message: error.message 
    });
  }
});

// Simulated content generation function
async function generateContent(prompt, options) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const templates = {
    product: `Transform your ${prompt} with our innovative solution! Crafted with precision and care, this premium offering delivers exceptional value and performance. 

Key Features:
• Industry-leading quality and durability
• Sustainable and eco-friendly materials
• Backed by our satisfaction guarantee
• Ships fast with free returns

Don't miss out on this opportunity to elevate your experience. Order now and discover the difference quality makes. Join thousands of satisfied customers who have already made the switch!`,

    blog: `${prompt}

In today's rapidly evolving digital landscape, staying ahead of the curve is more important than ever. This comprehensive guide explores the latest trends, strategies, and insights that will help you succeed.

Understanding the fundamentals is crucial. By implementing proven techniques and leveraging modern tools, you can achieve remarkable results. Our research shows that businesses who adapt quickly see up to 3x better performance.

The key takeaways:
1. Focus on quality over quantity
2. Embrace innovation and change
3. Build genuine connections
4. Measure and optimize continuously

Ready to take the next step? Start implementing these strategies today and watch your success grow!`,

    marketing: `Attention-grabbing headline: ${prompt}

Are you ready to transform your results? Our proven solution helps you achieve your goals faster than ever before.

✓ Instant results you can see
✓ Easy to implement and use
✓ Backed by real success stories
✓ Risk-free guarantee

Limited time offer: Get started today and unlock exclusive bonuses worth $500! Don't let this opportunity pass you by.

Click below to claim your spot now!`,

    social: `🚀 ${prompt}

Did you know? Our community of over 100,000 users is changing the game! 

💡 Pro tip: Start small, think big, and never stop learning.

Tag someone who needs to see this! 👇

#Innovation #Success #GrowthMindset #AI`,

    email: `Subject: You Won't Believe What We Have for You!

Hi there,

${prompt}

We're excited to share something special with you today. Our latest offering is designed specifically with your needs in mind.

Here's what makes it different:
→ Lightning-fast results
→ Intuitive and user-friendly
→ Proven track record of success

Special offer for our valued subscribers: Use code WELCOME20 for 20% off your first order!

Ready to get started? Click the button below.

Best regards,
The JustCopy.ai Team

P.S. This offer expires in 48 hours – don't miss out!`
  };

  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes('product') || promptLower.includes('description')) {
    return templates.product;
  } else if (promptLower.includes('blog') || promptLower.includes('article')) {
    return templates.blog;
  } else if (promptLower.includes('ad') || promptLower.includes('marketing')) {
    return templates.marketing;
  } else if (promptLower.includes('social') || promptLower.includes('post')) {
    return templates.social;
  } else if (promptLower.includes('email')) {
    return templates.email;
  }

  // Default response
  return `Here's your AI-generated content based on: "${prompt}"

${prompt} represents an exciting opportunity in today's market. With the right approach and strategic implementation, you can achieve outstanding results.

Our advanced AI technology analyzes your requirements and delivers content that resonates with your target audience. Whether you're looking to inform, persuade, or engage, we've got you covered.

Key Benefits:
• Time-saving automation
• Consistent quality output
• Scalable content production
• SEO-optimized results

Take your content to the next level with JustCopy.ai. Start creating compelling copy that converts today!`;
}

// Templates endpoint
app.get('/api/templates', (req, res) => {
  const templates = [
    {
      id: 1,
      name: 'Product Description',
      description: 'Create compelling product descriptions',
      category: 'E-commerce'
    },
    {
      id: 2,
      name: 'Blog Post',
      description: 'Generate engaging blog content',
      category: 'Content'
    },
    {
      id: 3,
      name: 'Social Media Post',
      description: 'Craft viral social media content',
      category: 'Social'
    },
    {
      id: 4,
      name: 'Email Campaign',
      description: 'Write persuasive email copy',
      category: 'Marketing'
    },
    {
      id: 5,
      name: 'Ad Copy',
      description: 'Create high-converting ad copy',
      category: 'Advertising'
    }
  ];

  res.json({ templates });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 JustCopy.ai server running on port ${PORT}`);
});

module.exports = app;