
import React, { useState, useEffect } from 'react';
import { ItineraryData, AppView, DayTemplate } from './types';
import { INITIAL_ITINERARY_DATA, MOCK_ITINERARIES, MOCK_TEMPLATES } from './constants';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';
import PreviewPage from './components/PreviewPage';
import KeywordManager from './components/KeywordManager';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('dashboard');
  const [itineraries, setItineraries] = useState<ItineraryData[]>([]);
  const [templates, setTemplates] = useState<DayTemplate[]>([]);
  const [currentItinerary, setCurrentItinerary] = useState<ItineraryData | null>(null);

  useEffect(() => {
    const savedItins = localStorage.getItem('ah_itineraries_v3');
    if (savedItins) {
      setItineraries(JSON.parse(savedItins));
    } else {
      const mocks = MOCK_ITINERARIES();
      setItineraries(mocks);
      localStorage.setItem('ah_itineraries_v3', JSON.stringify(mocks));
    }

    const savedTemplates = localStorage.getItem('ah_templates_v3');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    } else {
      setTemplates(MOCK_TEMPLATES);
      localStorage.setItem('ah_templates_v3', JSON.stringify(MOCK_TEMPLATES));
    }
  }, []);

  const saveToDB = (list: ItineraryData[]) => {
    setItineraries(list);
    localStorage.setItem('ah_itineraries_v3', JSON.stringify(list));
  };

  const saveTemplatesToDB = (list: DayTemplate[]) => {
    setTemplates(list);
    localStorage.setItem('ah_templates_v3', JSON.stringify(list));
  };

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
    saveToDB([copy, ...itineraries]);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this itinerary?')) {
      saveToDB(itineraries.filter(i => i.id !== id));
    }
  };

  const handleUpdateStatus = (id: string, status: any) => {
    const updated = itineraries.map(i => i.id === id ? { ...i, status } : i);
    saveToDB(updated);
  };

  const handleSave = (itin: ItineraryData) => {
    const exists = itineraries.find(i => i.id === itin.id);
    let newList;
    if (exists) {
      newList = itineraries.map(i => i.id === itin.id ? itin : i);
    } else {
      newList = [itin, ...itineraries];
    }
    saveToDB(newList);
    setView('dashboard');
  };

  return (
    <div className="min-h-screen">
      {view === 'dashboard' && (
        <Dashboard 
          itineraries={itineraries} 
          onCreate={handleCreate} 
          onEdit={handleEdit} 
          onCopy={handleCopy}
          onDelete={handleDelete}
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
          onSave={saveTemplatesToDB}
          onBack={() => setView('dashboard')}
        />
      )}

      {view === 'editor' && currentItinerary && (
        <Editor 
          itinerary={currentItinerary} 
          onSave={handleSave} 
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
