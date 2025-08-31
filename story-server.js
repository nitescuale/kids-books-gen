const express = require('express');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
const port = 3001;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Initialize Claude
const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

console.log('✅ Claude SDK initialized');

// Generate story from input
app.post('/api/generate-story', async (req, res) => {
  try {
    const { input } = req.body;
    
    if (!input) {
      return res.status(400).json({ error: 'Input is required' });
    }

    console.log('📝 Generating story for input:', input);

    const response = await claude.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `Create a children's story based on this input: "${input}"

Requirements:
- Age-appropriate for children 5-8 years old
- 2-3 sentences long
- Engaging and fun
- Include a positive message or lesson

Return only the story, no additional text.`
        }
      ]
    });

    const content = response.content[0];
    const story = content.text.trim();

    console.log('✅ Story generated successfully');
    res.json({ story });

  } catch (error) {
    console.error('❌ Error generating story:', error);
    res.status(500).json({ 
      error: 'Failed to generate story',
      details: error.message 
    });
  }
});

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Story Generator running at http://localhost:${port}`);
  console.log('📝 Enter your story ideas and watch the magic happen!');
});