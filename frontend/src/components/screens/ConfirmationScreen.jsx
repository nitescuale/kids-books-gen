import React from 'react';
import { Star, Zap, AlertCircle, Crown, MapPin, Sparkles } from 'lucide-react';

const ConfirmationScreen = ({ 
  selections, 
  onGenerateStory, 
  onEditSelection,
  generatingStory, 
  story, 
  error 
}) => {
  const selectionItems = [
    {
      key: 'character',
      title: 'Character',
      value: selections.character,
      icon: <Crown size={20} />,
      color: 'character'
    },
    {
      key: 'setting',
      title: 'Setting',
      value: selections.setting,
      icon: <MapPin size={20} />,
      color: 'setting'
    },
    {
      key: 'lesson',
      title: 'Lesson',
      value: selections.lesson,
      icon: <Sparkles size={20} />,
      color: 'lesson'
    }
  ];

  const allSelected = selections.character && selections.setting && selections.lesson;

  return (
    <div className="confirmation-screen">
      <div className="screen-header">
        <div className="screen-icon confirmation">
          <Star size={28} />
        </div>
        <h2 className="screen-title">Ready for Magic?</h2>
        <p className="screen-subtitle">Review your choices and create your story</p>
      </div>

      <div className="confirmation-content">
        {/* Selections Summary */}
        <div className="selections-summary">
          {selectionItems.map((item) => (
            <div key={item.key} className={`selection-item ${item.color}`}>
              <div 
                className="selection-header clickable-header"
                onClick={() => onEditSelection(item.key)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onEditSelection(item.key);
                  }
                }}
              >
                <div className="selection-icon">
                  {item.icon}
                </div>
                <span className="selection-title">{item.title}</span>
              </div>
              <button
                className="selection-value"
                onClick={() => onEditSelection(item.key)}
                aria-label={`Edit ${item.title.toLowerCase()} selection`}
              >
                {item.value || `Choose ${item.title.toLowerCase()}`}
              </button>
            </div>
          ))}
        </div>

        {/* Generate Button */}
        {allSelected && (
          <button 
            className="generate-story-btn"
            onClick={onGenerateStory}
            disabled={generatingStory}
            aria-label={generatingStory ? 'Generating your magical story' : 'Generate your magical story'}
          >
            {generatingStory ? (
              <>
                <div className="loading-dots">
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                </div>
                <span>Creating magic...</span>
              </>
            ) : (
              <>
                <Zap size={20} />
                <span>Create My Story</span>
              </>
            )}
          </button>
        )}

        {/* Generated Story */}
        {story && (
          <div className="story-result">
            <div className="story-header">
              <Star size={20} />
              <h3>Your Magical Story</h3>
              <Star size={20} />
            </div>
            <div className="story-content">
              {story.split('\n\n').map((paragraph, index) => (
                <p key={index} style={{ animationDelay: `${index * 0.2}s` }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Incomplete Selection Message */}
        {!allSelected && (
          <div className="incomplete-message">
            <p>Complete all selections to generate your story</p>
            <div className="missing-selections">
              {!selections.character && <span className="missing-item character">Character</span>}
              {!selections.setting && <span className="missing-item setting">Setting</span>}
              {!selections.lesson && <span className="missing-item lesson">Lesson</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmationScreen;