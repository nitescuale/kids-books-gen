# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a kids' story generator powered by Claude AI that creates personalized bedtime stories. The application has evolved from a simple HTML/CSS interface to a modern React-based frontend with Express.js backend.

## Architecture

### Hybrid Frontend Architecture
- **Legacy**: Static HTML (`index.html`) with vanilla JavaScript - original implementation
- **Modern**: React 18 + Vite frontend in `frontend/` directory - current active version
- **Backend**: Express.js server (`story-server.js`) serves both the React build and API endpoints

The server serves the React build from `frontend/dist` and falls back to the legacy HTML for compatibility.

### API Integration
- Uses Anthropic Claude API (claude-3-5-haiku-latest model) via `@anthropic-ai/sdk`
- API key configured via `ANTHROPIC_API_KEY` environment variable in `.env` file
- All AI endpoints include fallback data for graceful degradation

## Development Commands

### Backend Development
```bash
# Start the Express server (serves React build + APIs)
npm start

# Server runs on port 3002 by default
# Serves frontend from frontend/dist and provides API endpoints
```

### Frontend Development
```bash
# Development server with hot reload
cd frontend && npm run dev

# Build for production
cd frontend && npm run build

# Lint frontend code
cd frontend && npm run lint

# Preview production build
cd frontend && npm run preview
```

### Full Development Workflow
1. Build frontend: `cd frontend && npm run build`
2. Start server: `npm start` (serves built React app)
3. For frontend development: run `npm run dev` in frontend/ directory alongside server

## API Endpoints

### Story Generation Endpoints
- `GET /api/generate-characters` - Returns 4 diverse character options
- `GET /api/generate-settings` - Returns 4 magical setting options  
- `GET /api/generate-lessons` - Returns 4 life lesson options
- `POST /api/generate-story` - Generates complete story from selected components
- `GET /api/generate-examples` - Legacy endpoint for simple story ideas

### Request/Response Patterns
All generation endpoints return JSON with arrays:
```javascript
// Characters, settings, lessons
{ "characters": [...], "settings": [...], "lessons": [...] }

// Story generation (POST with components object)
{ "components": { character, setting, lesson } } → { "story": "..." }
```

## Modern Design Architecture (React Frontend)

### Component Structure
- `App.jsx` - Main application with enhanced state management and micro-interactions
- `App.css` - Modern glassmorphism design system with advanced CSS techniques
- `index.css` - Global styles with Inter font family and accessibility features
- Component-based architecture with reusable `Section` component and enhanced animations

### State Management & Interactions
- React hooks (useState, useEffect, useCallback) with optimized performance
- Three main content arrays: characters, settings, lessons with loading states
- Enhanced selection state with celebration effects and visual feedback
- Micro-interaction system for user engagement and delight

### Modern Design System

#### Visual Identity
- **Glassmorphism UI**: Semi-transparent backgrounds with backdrop blur effects
- **Primary Palette**: Purple to blue gradients (`#667eea` to `#764ba2`)
- **Section Colors**: 
  - Characters: Pink gradient (`#ff6b9d` to `#ffeaa7`)
  - Settings: Blue gradient (`#4ca5ff` to `#b8e6ff`) 
  - Lessons: Yellow gradient (`#ffd93d` to `#ffecb3`)
- **Neutral System**: Comprehensive gray scale (gray-50 to gray-900)

#### Typography & Layout
- **Primary Font**: Inter (Google Fonts) for UI elements
- **Reading Font**: Georgia serif for story content
- **Responsive Grid**: Mobile-first (320px+), tablet (768px+), desktop (1024px+)
- **Spacing System**: CSS custom properties for consistent spacing

#### Animation System
- **Micro-interactions**: Hover effects, selection celebrations, loading animations
- **Entrance Animations**: Staggered reveals for dynamic content
- **Loading States**: Sequential bounce dots, shimmer effects
- **Transition Timing**: Cubic-bezier curves for natural motion

#### Advanced CSS Features
- **CSS Custom Properties**: Theming system with semantic color tokens
- **CSS Grid & Flexbox**: Modern layout techniques for responsive design
- **Backdrop Filters**: Glass effects and layered visual hierarchy
- **Transform Animations**: 3D effects and smooth micro-interactions

## Environment Configuration

### Required Environment Variables
```bash
ANTHROPIC_API_KEY=your_claude_api_key_here
```

### Port Configuration
- Default port: 3002 (configurable in story-server.js line 7)
- Frontend dev server: 5173 (Vite default)

## Error Handling Patterns

### API Error Handling
- All Claude API calls wrapped in try-catch blocks
- Fallback content provided for each endpoint when API fails
- Detailed console logging for debugging AI integration issues
- Graceful degradation - app remains functional without AI

### Frontend Error States
- Loading spinners during API calls
- Empty states with helpful messaging when no content available
- Error boundaries for React component failures
- Network error handling in fetch calls

## AI Integration Notes

### Claude API Usage
- Model: `claude-3-5-haiku-latest` (fast, cost-effective for this use case)
- Max tokens: 300-500 per request (sufficient for short content generation)
- Content format: JSON arrays for structured data, plain text for stories
- All prompts designed for age-appropriate content (5-8 years old)

### Content Generation Strategy
- Characters: Diverse, imaginative main characters with unique abilities
- Settings: Magical, child-friendly environments and locations
- Lessons: Positive life lessons and values appropriate for children
- Stories: 2-3 paragraph narratives combining selected components

## Build and Deployment

### Production Build Process
1. `cd frontend && npm run build` - Creates optimized React build in frontend/dist
2. `npm start` - Server serves pre-built React app from dist folder
3. All static assets served via Express static middleware

### Asset Management
- React build includes fingerprinted assets for cache busting
- Legacy assets (original HTML/CSS) maintained for compatibility
- No separate asset pipeline required - Vite handles optimization

## Development Notes

### When Working on Frontend
- React development server runs on different port than Express server
- API calls proxy to Express server during development
- Build frontend before testing full integration

### When Working on Backend
- Server restart required for changes to story-server.js
- Environment variable changes require server restart
- API endpoint changes immediately available (Express handles hot reloading)

### Testing API Endpoints
Server provides extensive logging for debugging:
- `✅ Claude SDK initialized` - Successful API connection
- `🦸 Generating character options...` - API call in progress
- `❌ Error generating [content]:` - API failures with detailed error info

## Design System Implementation Notes

### CSS Architecture Guidelines
- **Custom Properties**: Use CSS variables for colors, spacing, and timing
- **Naming Convention**: BEM-style classes with semantic naming
- **Animation Performance**: Use `transform` and `opacity` for smooth 60fps animations
- **Responsive Design**: Mobile-first approach with progressive enhancement

### Accessibility Considerations
- **ARIA Labels**: All interactive elements include proper ARIA attributes
- **Focus Management**: Visible focus indicators and logical tab order
- **Reduced Motion**: Respects `prefers-reduced-motion` user preference
- **Color Contrast**: WCAG AA compliant color combinations throughout

### Performance Optimization
- **CSS Loading**: Critical styles inlined, fonts preloaded
- **Animation Efficiency**: GPU-accelerated transforms, optimized timing functions
- **Responsive Images**: Proper asset optimization and loading strategies
- **Bundle Size**: Tree-shaking enabled, minimal dependency footprint

### Design Token System
```css
:root {
  /* Primary Colors */
  --primary-500: #667eea;
  --primary-600: #764ba2;
  
  /* Section Colors */
  --character-start: #ff6b9d;
  --character-end: #ffeaa7;
  --setting-start: #4ca5ff;
  --setting-end: #b8e6ff;
  --lesson-start: #ffd93d;
  --lesson-end: #ffecb3;
  
  /* Spacing Scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
}
```