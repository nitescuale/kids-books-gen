const express = require('express');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
const port = 3002;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Initialize Claude
const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

console.log('✅ Claude SDK initialized');

// Generate example story ideas
app.get('/api/generate-examples', async (req, res) => {
  try {
    console.log('💡 Generating example story ideas...');

    const response = await claude.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: `Generate exactly 4 creative story ideas for children aged 5-8. Each should be a short, engaging concept that would make a good children's story.

Format as a JSON array of strings. Return ONLY the JSON, no other text.

Example format: ["idea 1", "idea 2", "idea 3", "idea 4"]

Make them diverse, fun, and imaginative - things like animals with special abilities, magical objects, friendship adventures, etc.`
        }
      ]
    });

    const content = response.content[0];
    const examples = JSON.parse(content.text);

    console.log('✅ Example ideas generated successfully');
    res.json({ examples });

  } catch (error) {
    console.error('❌ Error generating examples:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    
    // Fallback examples if API fails
    console.log('📋 Using fallback examples');
    res.json({ 
      examples: [
        "A brave little mouse who wants to help her friends",
        "A dragon who is afraid of flying but learns to be brave", 
        "Two friends who discover a magical garden in their backyard",
        "A robot who learns to paint beautiful pictures"
      ]
    });
  }
});

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

// Error handling
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start server
const server = app.listen(port, () => {
  console.log(`🚀 Story Generator running at http://localhost:${port}`);
  console.log('📝 Enter your story ideas and watch the magic happen!');
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

// Keep the process alive
process.stdin.resume();