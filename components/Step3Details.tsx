
import React from 'react';
import { ItineraryData } from '../types';

interface Props {
  data: ItineraryData;
  updateData: (updates: Partial<ItineraryData>) => void;
}

const Step3Details: React.FC<Props> = ({ data, updateData }) => {
  const handleListUpdate = (key: keyof ItineraryData, val: string) => {
    updateData({ [key]: val.split('\n').filter(s => s.trim() !== '') });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 font-['Poppins']">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="adv-input-group">
          <label className="adv-label">Inclusions (One per line)</label>
          <textarea 
            className="adv-input min-h-[400px] border-green-50 text-sm leading-loose font-normal"
            placeholder="e.g. All transfers by private vehicle..."
            value={data.inclusions.join('\n')}
            onChange={e => handleListUpdate('inclusions', e.target.value)}
          />
        </div>
        <div className="adv-input-group">
          <label className="adv-label">Exclusions (One per line)</label>
          <textarea 
            className="adv-input min-h-[400px] border-red-50 text-sm leading-loose font-normal"
            placeholder="e.g. 5% GST on total package..."
            value={data.exclusions.join('\n')}
            onChange={e => handleListUpdate('exclusions', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Step3Details;
