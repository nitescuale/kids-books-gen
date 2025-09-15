import React, { useEffect, useRef } from 'react';
import { Star, Zap, AlertCircle, Crown, MapPin, Sparkles } from 'lucide-react';
import { useTextAnimation } from '../../hooks/useTextAnimation';

const ConfirmationScreen = ({
  selections,
  onGenerateStory,
  onEditSelection,
  generatingStory,
  story,
  error
}) => {
  const storyRef = useRef(null);
  const animatedText = useTextAnimation('Creating magic', generatingStory, 400);
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

  // Auto-scroll to story when it's generated
  useEffect(() => {
    if (story && storyRef.current) {
      setTimeout(() => {
        const elementTop = storyRef.current.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementTop - 20,
          behavior: 'smooth'
        });
      }, 300); // Small delay to ensure DOM is updated
    }
  }, [story]);

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
          {/* Fourth Block: Either Incomplete Message or Generate Button */}
          {!allSelected ? (
            <div className="selection-item incomplete-message">
              <p>Complete all selections to generate your story</p>
              <div className="missing-selections">
                {!selections.character && <span className="missing-item character">Character</span>}
                {!selections.setting && <span className="missing-item setting">Setting</span>}
                {!selections.lesson && <span className="missing-item lesson">Lesson</span>}
              </div>
            </div>
          ) : (
            <div className="selection-item generate-block">
              <button
                className="generate-story-btn-grid"
                onClick={onGenerateStory}
                disabled={generatingStory}
                aria-label={generatingStory ? 'Generating your magical story' : 'Generate your magical story'}
              >
                {generatingStory ? (
                  <span>{animatedText}</span>
                ) : (
                  <>
                    <Zap size={20} />
                    <span>Create My Story</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>


        {/* Generated Story */}
        {story && (
          <div ref={storyRef} className="story-result">
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
      </div>
    </div>
  );
};

export default ConfirmationScreen;