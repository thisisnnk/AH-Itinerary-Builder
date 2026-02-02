import React, { useState, useEffect } from 'react';
import { ItineraryData, AppView, DayTemplate, ItineraryStatus } from './types';
import { INITIAL_ITINERARY_DATA } from './constants';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';
import PreviewPage from './components/PreviewPage';
import KeywordManager from './components/KeywordManager';
import { db } from './firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy,
  updateDoc
} from "firebase/firestore";
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('dashboard');
  const [itineraries, setItineraries] = useState<ItineraryData[]>([]);
  const [templates, setTemplates] = useState<DayTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentItinerary, setCurrentItinerary] = useState<ItineraryData | null>(null);

  // Real-time Firestore Sync for Itineraries
  useEffect(() => {
    const q = query(collection(db, "itineraries"), orderBy("tripSummary.quotationDate", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const itins: ItineraryData[] = [];
      snapshot.forEach((doc) => {
        itins.push({ ...doc.data() } as ItineraryData);
      });
      setItineraries(itins);
      setIsLoading(false);
    }, (error) => {
      console.error("Firestore itineraries error:", error);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firestore Sync for Templates
  useEffect(() => {
    const q = query(collection(db, "templates"), orderBy("keyword", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const temps: DayTemplate[] = [];
      snapshot.forEach((doc) => {
        temps.push({ ...doc.data() } as DayTemplate);
      });
      setTemplates(temps);
    }, (error) => {
      console.error("Firestore templates error:", error);
    });
    return () => unsubscribe();
  }, []);

  const handleCreate = () => {
    const newItin = INITIAL_ITINERARY_DATA();
    setCurrentItinerary(newItin);
    setView('editor');
  };

  const handleEdit = (itin: ItineraryData) => {
    setCurrentItinerary(itin);
    setView('editor');
  };

  const handleCopy = async (itin: ItineraryData) => {
    const id = Math.random().toString(36).substr(2, 9);
    const copy: ItineraryData = { 
      ...itin, 
      id: id,
      quotationNumber: itin.quotationNumber + '-COPY',
      tripSummary: { ...itin.tripSummary, leadTraveler: itin.tripSummary.leadTraveler + ' (Copy)' }
    };
    try {
      await setDoc(doc(db, "itineraries", id), copy);
    } catch (e) {
      alert("Failed to copy itinerary.");
    }
  };

  const handleDeleteItinerary = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this itinerary? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, "itineraries", id));
      } catch (e) {
        alert("Failed to delete itinerary.");
      }
    }
  };

  const handleUpdateStatus = async (id: string, status: ItineraryStatus) => {
    try {
      await updateDoc(doc(db, "itineraries", id), { status });
    } catch (e) {
      alert("Failed to update status.");
    }
  };

  const handleSaveItinerary = async (itin: ItineraryData) => {
    try {
      await setDoc(doc(db, "itineraries", itin.id), itin);
      setView('dashboard');
    } catch (e) {
      alert("Failed to save itinerary.");
    }
  };

  const handleSaveTemplate = async (template: DayTemplate) => {
    try {
      await setDoc(doc(db, "templates", template.id), template);
    } catch (e) {
      alert("Failed to save template.");
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await deleteDoc(doc(db, "templates", id));
    } catch (e) {
      alert("Failed to delete template.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FB] gap-4">
        <Loader2 className="animate-spin text-[#FECC00]" size={48} />
        <p className="text-slate-400 font-medium">Loading your itineraries...</p>
      </div>
    );
  }

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
          onSave={handleSaveTemplate}
          onDelete={handleDeleteTemplate}
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