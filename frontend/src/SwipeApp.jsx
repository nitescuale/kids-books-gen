import React from 'react';
import { Wand2 } from 'lucide-react';
import SwipeNavigator from './components/SwipeNavigator';
import SelectionScreen from './components/screens/SelectionScreen';
import ConfirmationScreen from './components/screens/ConfirmationScreen';
import { useStoryWizard } from './hooks/useStoryWizard';
import './SwipeApp.css';

function SwipeApp() {
  const {
    currentStep,
    selections,
    goToStep,
    nextStep,
    prevStep,
    canGoNext,
    canGoPrev,
    selectCharacter,
    selectSetting,
    selectLesson,
    characters,
    settings,
    lessons,
    loading,
    getCurrentData,
    getCurrentSelection,
    refreshCurrentData,
    refreshCharacters,
    refreshSettings,
    refreshLessons,
    generateStory,
    generatingStory,
    story,
    error,
    STEPS,
  } = useStoryWizard();

  const handleEditSelection = (type) => {
    switch (type) {
      case 'character':
        goToStep(STEPS.CHARACTER);
        break;
      case 'setting':
        goToStep(STEPS.SETTING);
        break;
      case 'lesson':
        goToStep(STEPS.LESSON);
        break;
      default:
        break;
    }
  };

  const getSelectionHandler = (step) => {
    switch (step) {
      case STEPS.CHARACTER:
        return selectCharacter;
      case STEPS.SETTING:
        return selectSetting;
      case STEPS.LESSON:
        return selectLesson;
      default:
        return () => {};
    }
  };

  return (
    <div className="swipe-app">
      <header className="app-header">
        <div className="app-logo">
          <Wand2 size={24} />
        </div>
        <h1 className="app-title">Story Creator</h1>
        <p className="app-subtitle">Create magical bedtime stories</p>
      </header>

      <SwipeNavigator
        currentStep={currentStep}
        totalSteps={4}
        onNext={nextStep}
        onPrev={prevStep}
        onGoToStep={goToStep}
        canGoNext={canGoNext}
        canGoPrev={canGoPrev}
      >
        {/* Character Selection Screen */}
        <div className="screen">
          <SelectionScreen
            type="character"
            title="Characters"
            items={characters}
            loading={loading.characters}
            selectedItem={selections.character}
            onSelect={selectCharacter}
            onRefresh={refreshCharacters}
            onTitleClick={() => goToStep(STEPS.CHARACTER)}
          />
        </div>

        {/* Setting Selection Screen */}
        <div className="screen">
          <SelectionScreen
            type="setting"
            title="Settings"
            items={settings}
            loading={loading.settings}
            selectedItem={selections.setting}
            onSelect={selectSetting}
            onRefresh={refreshSettings}
            onTitleClick={() => goToStep(STEPS.SETTING)}
          />
        </div>

        {/* Lesson Selection Screen */}
        <div className="screen">
          <SelectionScreen
            type="lesson"
            title="Lessons"
            items={lessons}
            loading={loading.lessons}
            selectedItem={selections.lesson}
            onSelect={selectLesson}
            onRefresh={refreshLessons}
            onTitleClick={() => goToStep(STEPS.LESSON)}
          />
        </div>

        {/* Confirmation Screen */}
        <div className="screen">
          <ConfirmationScreen
            selections={selections}
            onGenerateStory={generateStory}
            onEditSelection={handleEditSelection}
            generatingStory={generatingStory}
            story={story}
            error={error}
          />
        </div>
      </SwipeNavigator>
    </div>
  );
}

export default SwipeApp;