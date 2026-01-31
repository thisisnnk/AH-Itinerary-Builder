
import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Edit2, Save } from 'lucide-react';
import { DayTemplate } from '../types';

interface Props {
  templates: DayTemplate[];
  onSave: (list: DayTemplate[]) => void;
  onBack: () => void;
}

const KeywordManager: React.FC<Props> = ({ templates, onSave, onBack }) => {
  const [keyword, setKeyword] = useState('');
  const [plan, setPlan] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = () => {
    if (!keyword || !plan) return alert('Both fields are required');
    
    if (editingId) {
      const updated = templates.map(t => t.id === editingId ? { ...t, keyword, activities: plan.split('\n') } : t);
      onSave(updated);
      setEditingId(null);
    } else {
      const newTemp: DayTemplate = {
        id: Math.random().toString(36).substr(2, 9),
        keyword,
        title: `Plan: ${keyword}`,
        activities: plan.split('\n')
      };
      onSave([newTemp, ...templates]);
    }
    setKeyword('');
    setPlan('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this template?')) {
      onSave(templates.filter(t => t.id !== id));
    }
  };

  const handleEdit = (t: DayTemplate) => {
    setEditingId(t.id);
    setKeyword(t.keyword);
    setPlan(t.activities.join('\n'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 font-['Poppins']">
      <header className="flex items-center gap-4 mb-12">
        <button onClick={onBack} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-normal text-[#050B20]">Keyword templates</h1>
          <p className="text-sm text-[#050B20]/60 font-normal">Manage reusable day plans</p>
        </div>
      </header>

      <div className="adv-card p-10 mb-12">
        <h2 className="text-xl font-normal mb-8 text-[#050B20]">
          {editingId ? 'Edit template' : 'Add new template'}
        </h2>
        <div className="space-y-6">
          <div className="adv-input-group">
            <label className="adv-label">Keyword (Unique identifier)</label>
            <input 
              className="adv-input font-normal" 
              placeholder="e.g. Mysore1day"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
          </div>
          <div className="adv-input-group">
            <label className="adv-label">Day plan activities (One per line)</label>
            <textarea 
              className="adv-input min-h-[150px] resize-none font-normal" 
              placeholder="Visit Mysore Palace&#10;Lunch at local hotel&#10;Chamundi Hills sunset..."
              value={plan}
              onChange={e => setPlan(e.target.value)}
            />
          </div>
          <button onClick={handleAdd} className="adv-btn-primary w-full py-4 text-lg font-normal">
            {editingId ? <><Save size={20} /> Update template</> : <><Plus size={24} /> Add template</>}
          </button>
        </div>
      </div>

      <div className="adv-card p-8">
        <div className="overflow-x-auto">
          <table className="adv-table min-w-full">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="text-center font-normal text-sm text-[#050B20]/60 w-2/3">Keyword</th>
                <th className="text-center font-normal text-sm text-[#050B20]/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((t) => (
                <tr key={t.id}>
                  <td className="font-normal text-base text-[#050B20] text-left pl-12">{t.keyword}</td>
                  <td className="text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEdit(t)} className="p-2 hover:bg-slate-100 rounded-lg text-[#050B20]/40">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(t.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {templates.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center py-12 text-slate-300">No templates found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KeywordManager;
