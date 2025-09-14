import { useState, useCallback, useEffect } from 'react';

const STEPS = {
  CHARACTER: 0,
  SETTING: 1,
  LESSON: 2,
  CONFIRMATION: 3,
};

export const useStoryWizard = () => {
  const [currentStep, setCurrentStep] = useState(STEPS.CHARACTER);
  const [selections, setSelections] = useState({
    character: null,
    setting: null,
    lesson: null,
  });

  // Data states
  const [characters, setCharacters] = useState([]);
  const [settings, setSettings] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState({ 
    characters: true, 
    settings: true, 
    lessons: true 
  });

  // Story generation
  const [generatingStory, setGeneratingStory] = useState(false);
  const [story, setStory] = useState('');
  const [error, setError] = useState('');

  // Load data on mount
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

  const goToStep = useCallback((step) => {
    if (step >= STEPS.CHARACTER && step <= STEPS.CONFIRMATION) {
      setCurrentStep(step);
    }
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < STEPS.CONFIRMATION) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > STEPS.CHARACTER) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const selectCharacter = useCallback((character) => {
    setSelections(prev => ({ ...prev, character }));
    // Auto-advance to next step
    setTimeout(() => nextStep(), 300);
  }, [nextStep]);

  const selectSetting = useCallback((setting) => {
    setSelections(prev => ({ ...prev, setting }));
    // Auto-advance to next step
    setTimeout(() => nextStep(), 300);
  }, [nextStep]);

  const selectLesson = useCallback((lesson) => {
    setSelections(prev => ({ ...prev, lesson }));
    // Auto-advance to next step
    setTimeout(() => nextStep(), 300);
  }, [nextStep]);

  const generateStory = async () => {
    if (!selections.character || !selections.setting || !selections.lesson) {
      return;
    }

    setGeneratingStory(true);
    setError('');
    setStory('');
    
    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ components: selections })
      });

      if (!response.ok) throw new Error('Failed to generate story');
      
      const data = await response.json();
      setStory(data.story);
      
    } catch (error) {
      setError(`Oops! ${error.message}. Please try again!`);
    }
    
    setGeneratingStory(false);
  };

  const resetWizard = useCallback(() => {
    setCurrentStep(STEPS.CHARACTER);
    setSelections({
      character: null,
      setting: null,
      lesson: null,
    });
    setStory('');
    setError('');
  }, []);

  const refreshCurrentData = useCallback(() => {
    switch (currentStep) {
      case STEPS.CHARACTER:
        loadCharacters();
        break;
      case STEPS.SETTING:
        loadSettings();
        break;
      case STEPS.LESSON:
        loadLessons();
        break;
      default:
        break;
    }
  }, [currentStep]);

  const refreshCharacters = useCallback(() => {
    loadCharacters();
  }, []);

  const refreshSettings = useCallback(() => {
    loadSettings();
  }, []);

  const refreshLessons = useCallback(() => {
    loadLessons();
  }, []);

  // Helper getters
  const getCurrentData = () => {
    switch (currentStep) {
      case STEPS.CHARACTER:
        return { items: characters, loading: loading.characters };
      case STEPS.SETTING:
        return { items: settings, loading: loading.settings };
      case STEPS.LESSON:
        return { items: lessons, loading: loading.lessons };
      default:
        return { items: [], loading: false };
    }
  };

  const getCurrentSelection = () => {
    switch (currentStep) {
      case STEPS.CHARACTER:
        return selections.character;
      case STEPS.SETTING:
        return selections.setting;
      case STEPS.LESSON:
        return selections.lesson;
      default:
        return null;
    }
  };

  const isStepComplete = (step) => {
    switch (step) {
      case STEPS.CHARACTER:
        return !!selections.character;
      case STEPS.SETTING:
        return !!selections.setting;
      case STEPS.LESSON:
        return !!selections.lesson;
      case STEPS.CONFIRMATION:
        return !!(selections.character && selections.setting && selections.lesson);
      default:
        return false;
    }
  };

  const canGoNext = currentStep < STEPS.CONFIRMATION;
  const canGoPrev = currentStep > STEPS.CHARACTER;
  const allSelectionsComplete = selections.character && selections.setting && selections.lesson;

  return {
    // Current state
    currentStep,
    selections,
    
    // Navigation
    goToStep,
    nextStep,
    prevStep,
    canGoNext,
    canGoPrev,
    
    // Selection handlers
    selectCharacter,
    selectSetting,
    selectLesson,
    
    // Data
    characters,
    settings,
    lessons,
    loading,
    getCurrentData,
    getCurrentSelection,
    refreshCurrentData,
    
    // Story generation
    generateStory,
    generatingStory,
    story,
    error,
    
    // Utilities
    resetWizard,
    isStepComplete,
    allSelectionsComplete,
    
    // Refresh functions
    refreshCharacters,
    refreshSettings,
    refreshLessons,
    
    // Constants
    STEPS,
  };
};