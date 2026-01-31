
import React, { useState } from 'react';
import { ItineraryData, FormStep, DayTemplate } from '../types';
import Step1Summary from './Step1Summary';
import Step2Itinerary from './Step2Itinerary';
import Step3Details from './Step3Details';
import Step4Policies from './Step4Policies';
import { ChevronLeft, ChevronRight, CheckCircle, X, Eye } from 'lucide-react';

interface Props {
  itinerary: ItineraryData;
  onSave: (itin: ItineraryData) => void;
  onCancel: () => void;
  onPreview: (itin: ItineraryData) => void;
  templates: DayTemplate[];
}

const Editor: React.FC<Props> = ({ itinerary, onSave, onCancel, onPreview, templates }) => {
  const [data, setData] = useState<ItineraryData>(itinerary);
  const [step, setStep] = useState<FormStep>('summary');

  const updateData = (updates: Partial<ItineraryData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const steps: FormStep[] = ['summary', 'itinerary', 'details', 'policies'];
  const currentIndex = steps.indexOf(step);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 pb-40 font-['Poppins'] font-normal">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-normal tracking-tight">Itinerary studio</h1>
            <p className="text-sm font-normal text-slate-400 uppercase tracking-widest">{data.quotationNumber}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => onPreview(data)} className="adv-btn-primary bg-white border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50 font-normal">
            <Eye size={18} /> Preview itinerary
          </button>
          <button onClick={() => onSave(data)} className="adv-btn-primary shadow-xl font-normal">
            <CheckCircle size={18} /> Confirm & save
          </button>
        </div>
      </header>

      <div className="flex gap-4 mb-10 overflow-x-auto pb-4 scrollbar-hide">
        {steps.map((s, i) => (
          <button
            key={s}
            onClick={() => setStep(s)}
            className={`px-8 py-3 rounded-2xl whitespace-nowrap font-normal text-[11px] border transition-all duration-300 ${
              step === s ? 'brand-bg-primary border-transparent shadow-lg scale-105' : 'bg-white border-slate-100 text-slate-400 hover:border-yellow-200'
            }`}
          >
            Step {i + 1}: {s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      <div className="adv-card p-12 bg-white/80 backdrop-blur-sm">
        {step === 'summary' && <Step1Summary data={data} updateData={updateData} />}
        {step === 'itinerary' && <Step2Itinerary data={data} updateData={updateData} templates={templates} />}
        {step === 'details' && <Step3Details data={data} updateData={updateData} />}
        {step === 'policies' && <Step4Policies data={data} updateData={updateData} />}
      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 z-50">
        <div className="apple-blur p-4 rounded-3xl border border-white/40 shadow-2xl flex justify-between gap-4">
          <button 
            disabled={currentIndex === 0}
            onClick={() => setStep(steps[currentIndex - 1])}
            className="flex-1 adv-btn-primary bg-white/50 text-slate-600 disabled:opacity-30 border-none h-14 font-normal"
          >
            <ChevronLeft size={20} /> Previous
          </button>
          {currentIndex === steps.length - 1 ? (
            <button 
              onClick={() => onPreview(data)}
              className="flex-1 adv-btn-primary border-none h-14 bg-blue-600 text-white font-normal"
            >
              <Eye size={20} /> Preview itinerary
            </button>
          ) : (
            <button 
              onClick={() => setStep(steps[currentIndex + 1])}
              className="flex-1 adv-btn-primary border-none h-14 font-normal"
            >
              Next <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;
