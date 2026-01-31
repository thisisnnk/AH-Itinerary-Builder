
import React from 'react';
import { ItineraryData, ItineraryDay, DayTemplate } from '../types';
import { Plus, Trash2, Search, Image as ImageIcon, RotateCcw, X, Calendar } from 'lucide-react';

interface Props {
  data: ItineraryData;
  updateData: (updates: Partial<ItineraryData>) => void;
  templates: DayTemplate[];
}

const Step2Itinerary: React.FC<Props> = ({ data, updateData, templates }) => {
  const addDay = () => {
    const nextDayNum = data.itinerary.length > 0 ? Math.max(...data.itinerary.map(d => d.day)) + 1 : 1;
    updateData({
      itinerary: [...data.itinerary, {
        day: nextDayNum,
        title: '',
        activities: [],
        keywords: '',
        images: []
      }]
    });
  };

  const removeDay = (index: number) => {
    const newList = data.itinerary.filter((_, i) => i !== index);
    updateData({ itinerary: newList });
  };

  const updateDay = (index: number, updates: Partial<ItineraryDay>) => {
    const newList = [...data.itinerary];
    newList[index] = { ...newList[index], ...updates };
    updateData({ itinerary: newList });
  };

  const applyKeywordTemplate = (idx: number) => {
    const day = data.itinerary[idx];
    if (!day.keywords) return;
    
    const template = templates.find(t => t.keyword.toLowerCase() === day.keywords?.toLowerCase());
    if (template) {
      updateDay(idx, {
        title: template.title,
        activities: template.activities
      });
    } else {
      alert('No template found for this keyword');
    }
  };

  const fetchImages = (idx: number) => {
    const sig = Math.floor(Math.random() * 1000);
    const newImages = [
      `https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=400&q=80&sig=${sig}1`,
      `https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=400&q=80&sig=${sig}2`,
      `https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=400&q=80&sig=${sig}3`
    ];
    updateDay(idx, { images: newImages });
  };

  const deleteImage = (dayIdx: number, imgIdx: number) => {
    const day = data.itinerary[dayIdx];
    const newImgs = [...(day.images || [])];
    newImgs.splice(imgIdx, 1);
    updateDay(dayIdx, { images: newImgs });
  };

  const toggleDayZero = (checked: boolean) => {
    const updatedItin = data.itinerary.map(d => {
      if (d.day === 0) return { ...d, isDisabled: !checked };
      return d;
    });
    updateData({ showDayZero: checked, itinerary: updatedItin });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 font-['Poppins']">
      
      <div className="flex justify-between items-center bg-slate-50 p-6 rounded-[24px]">
        <div>
          <h3 className="text-lg font-semibold text-[#050B20]">Day configuration</h3>
          <p className="text-xs text-slate-500 font-medium">Enable day 0 for pre-trip details</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold text-slate-400">Show day 0</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={data.showDayZero}
              onChange={e => toggleDayZero(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <div className="space-y-12">
        {data.itinerary.map((item, idx) => (
          (item.day !== 0 || !item.isDisabled) && (
            <div key={idx} className={`p-10 border border-slate-100 rounded-[32px] bg-slate-50/20 relative shadow-sm hover:shadow-md transition-all ${item.day === 0 ? 'border-yellow-200 bg-yellow-50/10' : ''}`}>
              <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                <div className="shrink-0">
                  <div className={`text-white w-16 h-16 rounded-[20px] flex items-center justify-center font-semibold text-2xl shadow-xl ${item.day === 0 ? 'bg-slate-400' : 'brand-bg-secondary'}`}>
                    {item.day}
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                  <div className="adv-input-group mb-0">
                    <label className="adv-label">Keyword search</label>
                    <div className="flex gap-2">
                      <input 
                        className="adv-input" 
                        placeholder="e.g. Ooty1day"
                        value={item.keywords || ''}
                        onChange={e => updateDay(idx, { keywords: e.target.value })}
                      />
                      <button onClick={() => applyKeywordTemplate(idx)} className="adv-btn-primary p-3 bg-white border border-slate-100 text-slate-400 hover:text-slate-900" title="Apply template">
                        <Search size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="adv-input-group mb-0">
                    <label className="adv-label">Day title</label>
                    <input className="adv-input" placeholder="e.g. Arrival & sightseeing" value={item.title} onChange={e => updateDay(idx, { title: e.target.value })} />
                  </div>
                  <div className="adv-input-group mb-0">
                    <label className="adv-label">Specific date for this day</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input type="date" className="adv-input pl-11" value={item.date || ''} onChange={e => updateDay(idx, { date: e.target.value })} />
                    </div>
                  </div>
                </div>

                {item.day !== 0 && (
                  <button onClick={() => removeDay(idx)} className="text-slate-300 hover:text-red-500 transition-colors p-3">
                    <Trash2 size={22} />
                  </button>
                )}
              </div>

              <div className="space-y-8">
                <div className="adv-input-group mb-0">
                  <label className="adv-label">Activities (Bullet points)</label>
                  <textarea 
                    className="adv-input min-h-[140px] resize-none leading-relaxed font-normal"
                    value={item.activities.join('\n')}
                    onChange={e => updateDay(idx, { activities: e.target.value.split('\n') })}
                    placeholder="Enter plan details..."
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="adv-label mb-0">Photos</label>
                    <button onClick={() => fetchImages(idx)} className="text-[11px] font-semibold flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                      <ImageIcon size={14} /> Refresh photos
                    </button>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {(item.images || []).map((img, i) => (
                      <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-slate-100 relative group border border-slate-100">
                        <img src={img} className="w-full h-full object-cover" alt="Moment" />
                        <button onClick={() => deleteImage(idx, i)} className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        ))}
      </div>

      <button onClick={addDay} className="w-full py-10 border-2 border-dashed border-slate-100 rounded-[40px] text-slate-300 hover:border-yellow-400 hover:text-yellow-600 transition-all flex flex-col items-center justify-center gap-3">
        <Plus size={32} />
        <span className="font-semibold text-[12px]">Add next day</span>
      </button>
    </div>
  );
};

export default Step2Itinerary;
