
import React, { useState, useEffect } from 'react';
import { ItineraryData, AppView, DayTemplate } from './types';
import { INITIAL_ITINERARY_DATA, MOCK_ITINERARIES, MOCK_TEMPLATES } from './constants';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';
import PreviewPage from './components/PreviewPage';
import KeywordManager from './components/KeywordManager';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('dashboard');
  
  // Initialize state from localStorage or mocks
  const [itineraries, setItineraries] = useState<ItineraryData[]>(() => {
    const saved = localStorage.getItem('ah_itineraries_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse itineraries", e);
      }
    }
    const mocks = MOCK_ITINERARIES();
    localStorage.setItem('ah_itineraries_v3', JSON.stringify(mocks));
    return mocks;
  });

  const [templates, setTemplates] = useState<DayTemplate[]>(() => {
    const saved = localStorage.getItem('ah_templates_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse templates", e);
      }
    }
    const mocks = MOCK_TEMPLATES;
    localStorage.setItem('ah_templates_v3', JSON.stringify(mocks));
    return mocks;
  });

  const [currentItinerary, setCurrentItinerary] = useState<ItineraryData | null>(null);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('ah_itineraries_v3', JSON.stringify(itineraries));
  }, [itineraries]);

  useEffect(() => {
    localStorage.setItem('ah_templates_v3', JSON.stringify(templates));
  }, [templates]);

  const handleCreate = () => {
    const newItin = INITIAL_ITINERARY_DATA();
    setCurrentItinerary(newItin);
    setView('editor');
  };

  const handleEdit = (itin: ItineraryData) => {
    setCurrentItinerary(itin);
    setView('editor');
  };

  const handleCopy = (itin: ItineraryData) => {
    const copy = { 
      ...itin, 
      id: Math.random().toString(36).substr(2, 9),
      quotationNumber: itin.quotationNumber + '-COPY',
      tripSummary: { ...itin.tripSummary, leadTraveler: itin.tripSummary.leadTraveler + ' (Copy)' }
    };
    setItineraries(prev => [copy, ...prev]);
  };

  const handleDeleteItinerary = (id: string) => {
    if (window.confirm('Are you sure you want to delete this itinerary? This action cannot be undone.')) {
      setItineraries(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleUpdateStatus = (id: string, status: any) => {
    setItineraries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  const handleSaveItinerary = (itin: ItineraryData) => {
    setItineraries(prev => {
      const exists = prev.find(i => i.id === itin.id);
      if (exists) {
        return prev.map(i => i.id === itin.id ? itin : i);
      } else {
        return [itin, ...prev];
      }
    });
    setView('dashboard');
  };

  const handleSaveTemplates = (updatedTemplates: DayTemplate[]) => {
    setTemplates(updatedTemplates);
  };

  return (
    <div className="min-h-screen">
      {view === 'dashboard' && (
        <Dashboard 
          itineraries={itineraries} 
          onCreate={handleCreate} 
          onEdit={handleEdit} 
          onCopy={handleCopy}
          onDelete={handleDeleteItinerary}
          onStatusChange={handleUpdateStatus}
          onManageKeywords={() => setView('keywords')}
          onPreview={(itin) => {
            setCurrentItinerary(itin);
            setView('preview');
          }}
        />
      )}

      {view === 'keywords' && (
        <KeywordManager 
          templates={templates}
          onSave={handleSaveTemplates}
          onBack={() => setView('dashboard')}
        />
      )}

      {view === 'editor' && currentItinerary && (
        <Editor 
          itinerary={currentItinerary} 
          onSave={handleSaveItinerary} 
          onCancel={() => setView('dashboard')}
          onPreview={(itin) => {
            setCurrentItinerary(itin);
            setView('preview');
          }}
          templates={templates}
        />
      )}

      {view === 'preview' && currentItinerary && (
        <PreviewPage 
          data={currentItinerary} 
          onEdit={() => setView('editor')} 
          onBack={() => setView('dashboard')}
        />
      )}
    </div>
  );
};

export default App;
