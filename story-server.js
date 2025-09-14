const express = require('express');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
const port = 3002;

// Middleware
app.use(express.json());

// Serve static files from the frontend dist folder
app.use(express.static(path.join(__dirname, 'frontend/dist')));

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
      model: 'claude-3-5-haiku-latest',
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

// Generate character options
app.get('/api/generate-characters', async (req, res) => {
  try {
    console.log('🦸 Generating character options...');

    const response = await claude.messages.create({
      model: 'claude-3-5-haiku-latest',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: `Generate exactly 4 diverse main characters for children's bedtime stories. Each should start with a name, followed by a simple, short description suitable for ages 5-8.

Use a wide variety of names - include common, familiar names like Sam, Lucy, Alex, Emma as well as unique ones. Make the names diverse and from different cultures when appropriate.

Format as a JSON array of strings. Return ONLY the JSON, no other text.

Example format: ["Emma, a brave little mouse who helps friends", "Carlos, a friendly dragon who loves to paint", "Lily, a curious owl who solves mysteries", "Ben, a kind robot who grows flowers"]

Make them diverse, imaginative, and different from common fairy tale characters. Keep each description under 12 words total (including the name).`
        }
      ]
    });

    const content = response.content[0];
    const characters = JSON.parse(content.text);

    console.log('✅ Characters generated:', characters);
    res.json({ characters });

  } catch (error) {
    console.error('❌ Error generating characters:', error);
    res.json({ 
      characters: [
        "Sophie, a curious young fox with silver fur",
        "Jake & Emma, twin otter pups who love to explore",
        "Mr. Oliver, an elderly wise owl who wears tiny spectacles", 
        "Lucy, a gentle giant panda who loves to garden"
      ]
    });
  }
});

// Generate setting options
app.get('/api/generate-settings', async (req, res) => {
  try {
    console.log('🌍 Generating setting options...');

    const response = await claude.messages.create({
      model: 'claude-3-5-haiku-latest',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: `Generate exactly 4 diverse settings for children's bedtime stories. Each should be a simple, short description (1-2 sentences maximum) of a magical, cozy, or interesting place suitable for ages 5-8.

Format as a JSON array of strings. Return ONLY the JSON, no other text.

Example format: ["a cozy treehouse with glowing lanterns", "an underwater kingdom with singing dolphins", "a magical garden where flowers dance", "a cloud castle floating in the sky"]

Make them imaginative and perfect for bedtime stories. Keep each description under 10 words.`
        }
      ]
    });

    const content = response.content[0];
    const settings = JSON.parse(content.text);

    console.log('✅ Settings generated:', settings);
    res.json({ settings });

  } catch (error) {
    console.error('❌ Error generating settings:', error);
    res.json({ 
      settings: [
        "a cozy village library filled with floating books",
        "an underwater coral garden with glowing sea anemones",
        "a magical forest where flowers sing lullabies",
        "a cloud city where houses are made of soft cotton"
      ]
    });
  }
});

// Generate lesson options
app.get('/api/generate-lessons', async (req, res) => {
  try {
    console.log('💡 Generating lesson options...');

    const response = await claude.messages.create({
      model: 'claude-3-5-haiku-latest',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: `Generate exactly 4 positive lessons or messages for children's bedtime stories, suitable for ages 3-8.

Format as a JSON array of strings. Return ONLY the JSON, no other text.

Example format: ["lesson 1", "lesson 2", "lesson 3", "lesson 4"]

Make them meaningful but age-appropriate. They should be positive and helpful for the children, never negative and always helpful relating to the children's
vocabulary, behaviour and self esteem and confidence.`
        }
      ]
    });

    const content = response.content[0];
    const lessons = JSON.parse(content.text);

    console.log('✅ Lessons generated:', lessons);
    res.json({ lessons });

  } catch (error) {
    console.error('❌ Error generating lessons:', error);
    res.json({ 
      lessons: [
        "the importance of helping friends when they need you",
        "believing in yourself even when things seem difficult",
        "being kind to others, even when they're different",
        "that it's okay to make mistakes as long as you learn from them"
      ]
    });
  }
});

// Generate story from components
app.post('/api/generate-story', async (req, res) => {
  try {
    const { components } = req.body;
    
    if (!components || !components.character || !components.setting || !components.lesson) {
      return res.status(400).json({ error: 'Story components are required' });
    }

    console.log('📝 Generating story with components:', components);

    const response = await claude.messages.create({
      model: 'claude-3-5-haiku-latest',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: `Create a detailed children's bedtime story using these components:
- Main character: ${components.character}
- Setting: ${components.setting}
- Lesson/message: ${components.lesson}

Requirements:
- Age-appropriate for children 5-8 years old
- MUST be 4-5 substantial paragraphs long (each paragraph should be 4-6 sentences)
- Should take 10-15 minutes to read aloud
- Include detailed descriptions and rich, descriptive language
- Develop a complete story arc with beginning, middle, and end
- Show the character facing a challenge and learning the lesson
- Include some dialogue
- End on a peaceful, happy note suitable for bedtime
- Use the components creatively - don't just mention them, build the story around them

Structure:
1. Introduce the character in the setting
2. Present a problem or challenge
3. Show how the character works to solve it
4. Resolution where the lesson is learned
5. Peaceful ending

Write a complete, engaging bedtime story - not a summary!

Return only the story, no additional text.`
        }
      ]
    });

    const content = response.content[0];
    const story = content.text.trim();

    console.log('✅ Story generated successfully');
    console.log('📏 Story length:', story.length, 'characters');
    console.log('📄 Story paragraphs:', story.split('\n\n').length);
    console.log('🔍 First 200 chars:', story.substring(0, 200) + '...');
    res.json({ story });

  } catch (error) {
    console.error('❌ Error generating story:', error);
    res.status(500).json({ 
      error: 'Failed to generate story',
      details: error.message 
    });
  }
});

// Serve React app for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
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