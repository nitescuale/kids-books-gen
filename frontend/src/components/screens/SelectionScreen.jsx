import React from 'react';
import { Crown, MapPin, Sparkles, RotateCw } from 'lucide-react';

const SelectionScreen = ({ 
  type, 
  title, 
  items, 
  loading, 
  selectedItem, 
  onSelect, 
  onRefresh,
  onTitleClick 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'character': return <Crown size={28} />;
      case 'setting': return <MapPin size={28} />;
      case 'lesson': return <Sparkles size={28} />;
      default: return null;
    }
  };

  const getColorClass = () => {
    switch (type) {
      case 'character': return 'character';
      case 'setting': return 'setting';
      case 'lesson': return 'lesson';
      default: return '';
    }
  };

  const getEmptyText = () => {
    switch (type) {
      case 'character': return 'Choose your hero';
      case 'setting': return 'Pick an adventure';
      case 'lesson': return 'Learn something magical';
      default: return 'Make your choice';
    }
  };

  return (
    <div className="selection-screen">
      <div className="screen-header">
        <div className={`screen-icon ${getColorClass()}`}>
          {getIcon()}
        </div>
        <h2 className="screen-title">{title}</h2>
        <div className="screen-subtitle-row">
          <p className="screen-subtitle">Choose one that speaks to you</p>
          {!loading && items.length > 0 && onRefresh && (
            <button
              className="refresh-icon-button"
              onClick={onRefresh}
              aria-label={`Generate new ${title.toLowerCase()}`}
            >
              <RotateCw size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="selection-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-dots">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
            <p>Creating {title.toLowerCase()}...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state" onClick={onRefresh}>
            <div className={`empty-icon ${getColorClass()}`}>
              {getIcon()}
            </div>
            <p>{getEmptyText()}</p>
            <small>Tap to refresh options</small>
          </div>
        ) : (
          <div className="options-grid">
            {items.map((item, index) => (
              <button
                key={index}
                className={`option-card ${selectedItem === item ? 'selected' : ''} ${getColorClass()}`}
                onClick={() => onSelect(item)}
                aria-pressed={selectedItem === item}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="option-content">
                  {item}
                </div>
                {selectedItem === item && (
                  <div className="selection-indicator">
                    <div className="check-mark">✓</div>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default SelectionScreen;