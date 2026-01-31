
import React, { useState } from 'react';
import { Search, Plus, Edit2, Copy, Trash2, User, Compass, Bookmark, Eye } from 'lucide-react';
import { ItineraryData, ItineraryStatus } from '../types';

interface Props {
  itineraries: ItineraryData[];
  onCreate: () => void;
  onEdit: (itin: ItineraryData) => void;
  onCopy: (itin: ItineraryData) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ItineraryStatus) => void;
  onManageKeywords: () => void;
  onPreview: (itin: ItineraryData) => void;
}

const Dashboard: React.FC<Props> = ({ itineraries, onCreate, onEdit, onCopy, onDelete, onStatusChange, onManageKeywords, onPreview }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = itineraries.filter(itin => 
    itin.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    itin.tripSummary.leadTraveler.toLowerCase().includes(searchTerm.toLowerCase()) ||
    itin.tripSummary.destinations.join(' ').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 font-['Poppins']">
      <div className="flex flex-col items-center mb-16">
        <img src="https://www.adventureholidays.co/logo.png" alt="Adventure holidays" className="h-20 mb-8" />
        <div className="flex gap-4">
          <button onClick={onCreate} className="adv-btn-primary px-10 py-4 text-lg shadow-xl font-normal">
            <Plus size={24} /> Create itinerary
          </button>
          <button onClick={onManageKeywords} className="adv-btn-primary bg-white border border-slate-200 text-[#050B20] px-10 py-4 text-lg hover:bg-slate-50 font-normal">
            <Bookmark size={24} className="brand-text-primary" /> Manage keywords
          </button>
        </div>
      </div>

      <div className="adv-card p-8 bg-white shadow-xl overflow-hidden border-none">
        <div className="relative mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            type="text" 
            placeholder="Search client name, destination, or duration..." 
            className="adv-input pl-14 py-4 text-lg border-slate-100 font-['Poppins'] font-normal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="adv-table min-w-full font-['Poppins']">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="text-center py-4 text-sm font-normal text-[#050B20]/60">Client name</th>
                <th className="text-center py-4 text-sm font-normal text-[#050B20]/60">Destination</th>
                <th className="text-center py-4 text-sm font-normal text-[#050B20]/60">Duration</th>
                <th className="text-center py-4 text-sm font-normal text-[#050B20]/60">Pax</th>
                <th className="text-center py-4 text-sm font-normal text-[#050B20]/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((itin) => (
                <tr key={itin.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td 
                    className="text-base font-normal text-[#050B20] py-6 cursor-pointer hover:brand-text-primary"
                    onClick={() => onPreview(itin)}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#050B20]/40 group-hover:bg-yellow-100 group-hover:text-yellow-600 transition-colors">
                        <User size={18} />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-base font-normal">{itin.tripSummary.leadTraveler}</span>
                        <span className="text-[10px] text-[#050B20]/40">{itin.quotationNumber}</span>
                      </div>
                    </div>
                  </td>
                  <td className="text-base font-normal text-[#050B20] py-6 text-center">
                    <div className="max-w-[500px] mx-auto overflow-x-auto whitespace-nowrap scrollbar-hide py-1">
                      {itin.tripSummary.destinations.join(', ')}
                    </div>
                  </td>
                  <td className="text-base font-normal text-[#050B20] py-6 text-center">
                    {itin.tripSummary.duration}
                  </td>
                  <td className="text-center font-normal text-[#050B20] text-base py-6">{itin.tripSummary.groupSize}</td>
                  <td className="py-6 text-center">
                    <div className="flex justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onPreview(itin)} className="p-2.5 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl text-blue-600 transition-all" title="Preview">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => onEdit(itin)} className="p-2.5 bg-slate-100 hover:bg-[#050B20] hover:text-white rounded-xl text-slate-600 transition-all" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => onCopy(itin)} className="p-2.5 bg-slate-100 hover:bg-[#050B20] hover:text-white rounded-xl text-slate-600 transition-all" title="Copy">
                        <Copy size={16} />
                      </button>
                      <button onClick={() => onDelete(itin.id)} className="p-2.5 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl text-red-500 transition-all" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-slate-300">
                    <Compass size={48} className="mx-auto mb-4 opacity-10" />
                    No itineraries found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Dashboard;
