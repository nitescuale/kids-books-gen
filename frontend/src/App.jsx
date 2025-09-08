import React, { useState, useEffect, useCallback } from 'react';
import { 
  Book, 
  Crown, 
  MapPin, 
  Sparkles, 
  RefreshCw, 
  Heart, 
  BarChart3, 
  BookOpen,
  Wand2,
  Star,
  Zap,
  Check,
  AlertCircle
} from 'lucide-react';
import './App.css';

function App() {
  const [selectedComponents, setSelectedComponents] = useState({
    character: null,
    setting: null,
    lesson: null
  });
  
  const [characters, setCharacters] = useState([]);
  const [settings, setSettings] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState({ characters: true, settings: true, lessons: true });
  const [generatingStory, setGeneratingStory] = useState(false);
  const [story, setStory] = useState('');
  const [error, setError] = useState('');
  const [storyGenerationStep, setStoryGenerationStep] = useState(0);
  const [celebrateSelection, setCelebrateSelection] = useState(null);

  useEffect(() => {
    loadCharacters();
    loadSettings();
    loadLessons();
  }, []);

  const loadCharacters = async () => {
    setLoading(prev => ({ ...prev, characters: true }));
    try {
      const response = await fetch('/api/generate-characters');
      const data = await response.json();
      setCharacters(data.characters);
    } catch (error) {
      console.error('Error loading characters:', error);
    }
    setLoading(prev => ({ ...prev, characters: false }));
  };

  const loadSettings = async () => {
    setLoading(prev => ({ ...prev, settings: true }));
    try {
      const response = await fetch('/api/generate-settings');
      const data = await response.json();
      setSettings(data.settings);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    setLoading(prev => ({ ...prev, settings: false }));
  };

  const loadLessons = async () => {
    setLoading(prev => ({ ...prev, lessons: true }));
    try {
      const response = await fetch('/api/generate-lessons');
      const data = await response.json();
      setLessons(data.lessons);
    } catch (error) {
      console.error('Error loading lessons:', error);
    }
    setLoading(prev => ({ ...prev, lessons: false }));
  };

  const selectComponent = useCallback((type, value) => {
    setSelectedComponents(prev => ({ ...prev, [type]: value }));
    
    // Add celebration effect
    setCelebrateSelection(type);
    setTimeout(() => setCelebrateSelection(null), 1000);
  }, []);

  const generateStory = async () => {
    if (!selectedComponents.character || !selectedComponents.setting || !selectedComponents.lesson) {
      return;
    }

    setGeneratingStory(true);
    setError('');
    setStory('');
    setStoryGenerationStep(0);
    
    const steps = ['Mixing magical ingredients...', 'Weaving the tale...', 'Adding sparkles...', 'Almost ready!'];
    
    // Simulate loading steps for better UX
    const stepInterval = setInterval(() => {
      setStoryGenerationStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, 1000);
    
    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ components: selectedComponents })
      });

      if (!response.ok) throw new Error('Failed to generate story');
      
      const data = await response.json();
      
      // Add delay for better UX
      setTimeout(() => {
        setStory(data.story);
      }, 500);
      
    } catch (error) {
      setError(`Oops! ${error.message}. Please try again!`);
    }
    
    clearInterval(stepInterval);
    setGeneratingStory(false);
    setStoryGenerationStep(0);
  };

  const allSelected = selectedComponents.character && selectedComponents.setting && selectedComponents.lesson;

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <Wand2 size={28} />
        </div>
        <h1>Story Creator</h1>
        <p>Create magical bedtime stories</p>
      </header>

      <main className="main">
        <Section
          title="Characters"
          icon={<Crown size={20} />}
          color="pink"
          items={characters}
          loading={loading.characters}
          selectedItem={selectedComponents.character}
          onSelect={(value) => selectComponent('character', value)}
          onRefresh={loadCharacters}
          emptyText="Choose your hero"
          emptySubtext="Tap the magic button above to meet amazing characters!"
          isSelected={!!selectedComponents.character}
          isCelebrating={celebrateSelection === 'character'}
        />

        <Section
          title="Settings"
          icon={<MapPin size={20} />}
          color="blue"
          items={settings}
          loading={loading.settings}
          selectedItem={selectedComponents.setting}
          onSelect={(value) => selectComponent('setting', value)}
          onRefresh={loadSettings}
          emptyText="Pick an adventure"
          emptySubtext="Where will your story take place?"
          isSelected={!!selectedComponents.setting}
          isCelebrating={celebrateSelection === 'setting'}
        />

        <Section
          title="Lessons"
          icon={<Sparkles size={20} />}
          color="yellow"
          items={lessons}
          loading={loading.lessons}
          selectedItem={selectedComponents.lesson}
          onSelect={(value) => selectComponent('lesson', value)}
          onRefresh={loadLessons}
          emptyText="Learn something magical"
          emptySubtext="What should your story teach?"
          isSelected={!!selectedComponents.lesson}
          isCelebrating={celebrateSelection === 'lesson'}
        />

        {allSelected && (
          <button 
            className="generate-btn"
            onClick={generateStory}
            disabled={generatingStory}
            aria-label={generatingStory ? 'Generating your magical story' : 'Generate your magical story'}
          >
            {generatingStory ? (
              <>
                <div className="loading-magical">
                  <div className="loading-dots">
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                  </div>
                </div>
                {storyGenerationStep < 4 ? [
                  'Mixing magical ingredients...',
                  'Weaving the tale...',
                  'Adding sparkles...',
                  'Almost ready!'
                ][storyGenerationStep] : 'Creating magic...'}
              </>
            ) : (
              <>
                <Zap size={18} />
                Create Magic
              </>
            )}
          </button>
        )}

        {story && (
          <div className="story-section" role="article" aria-label="Generated story">
            <h3>
              <Star size={24} />
              Your Magical Story
              <Star size={24} />
            </h3>
            <div className="story-content">
              {story.split('\n\n').map((paragraph, index) => (
                <p key={index} style={{ animationDelay: `${index * 0.2}s` }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="error-section" role="alert">
            <AlertCircle size={18} style={{ marginRight: '0.5rem' }} />
            <span>{error}</span>
          </div>
        )}
      </main>

      <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
        <button className="nav-item active" aria-label="Story Creator" title="Story Creator">
          <BookOpen size={20} />
        </button>
        <button className="nav-item" aria-label="My Stories" title="My Stories (Coming Soon)" disabled>
          <BarChart3 size={20} />
        </button>
        <button className="nav-item" aria-label="Favorites" title="Favorites (Coming Soon)" disabled>
          <Heart size={20} />
        </button>
      </nav>
    </div>
  );
}

function Section({ 
  title, 
  icon, 
  color, 
  items, 
  loading, 
  selectedItem, 
  onSelect, 
  onRefresh, 
  emptyText, 
  emptySubtext,
  isSelected,
  isCelebrating
}) {
  const isEmpty = !loading && items.length === 0;
  
  return (
    <div className={`section ${color} ${isSelected ? 'has-selection' : ''} ${isCelebrating ? 'celebrating' : ''}`}>
      <div className="section-header">
        <h2>
          {title}
          {isSelected && <Check size={16} style={{ marginLeft: '0.5rem', color: 'var(--success-primary)' }} />}
        </h2>
        <button 
          className="refresh-btn" 
          onClick={onRefresh}
          aria-label={`Refresh ${title.toLowerCase()}`}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? 'spinning' : ''} />
        </button>
      </div>
      
      <div className="section-content">
        {loading ? (
          <div className="loading-magical">
            <div className="loading-dots">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--gray-500)' }}>
              Creating {title.toLowerCase()}...
            </p>
          </div>
        ) : isEmpty ? (
          <div className="empty-state" onClick={onRefresh}>
            <div className="empty-icon">
              {icon}
            </div>
            <p>{emptyText}</p>
            <small>{emptySubtext}</small>
          </div>
        ) : (
          <div className="items-grid">
            {items.map((item, index) => (
              <button
                key={index}
                className={`item-card ${selectedItem === item ? 'selected' : ''}`}
                onClick={() => onSelect(item)}
                aria-pressed={selectedItem === item}
                aria-label={`Select ${item}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item}
                {selectedItem === item && (
                  <Check 
                    size={16} 
                    style={{ 
                      position: 'absolute', 
                      top: '8px', 
                      right: '8px', 
                      color: 'var(--success-primary)'
                    }} 
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
