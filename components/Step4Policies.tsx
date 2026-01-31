
import React from 'react';
import { ItineraryData } from '../types';

interface Props {
  data: ItineraryData;
  updateData: (updates: Partial<ItineraryData>) => void;
}

const Step4Policies: React.FC<Props> = ({ data, updateData }) => {
  const handleListUpdate = (key: keyof ItineraryData, val: string) => {
    updateData({ [key]: val.split('\n').filter(s => s.trim() !== '') });
  };

  const handleBankUpdate = (key: string, value: string) => {
    updateData({
      bankDetails: { ...data.bankDetails, [key]: value }
    });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 font-['Poppins']">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="adv-input-group">
          <label className="adv-label">Terms & conditions</label>
          <textarea 
            className="adv-input min-h-[300px] leading-relaxed text-sm font-normal"
            value={data.termsAndConditions.join('\n')}
            onChange={e => handleListUpdate('termsAndConditions', e.target.value)}
          />
        </div>
        <div className="adv-input-group">
          <label className="adv-label">Cancellation policy</label>
          <textarea 
            className="adv-input min-h-[300px] border-orange-50 leading-relaxed text-sm font-normal"
            value={data.cancellationPolicy.join('\n')}
            onChange={e => handleListUpdate('cancellationPolicy', e.target.value)}
          />
        </div>
      </div>

      <section className="bg-slate-50/50 p-10 rounded-[32px] border border-slate-100 space-y-8">
        <h3 className="text-sm font-semibold text-slate-400">Company bank details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="adv-input-group mb-0">
            <label className="adv-label">Bank & branch</label>
            <input className="adv-input bg-white" value={data.bankDetails.bank} onChange={e => handleBankUpdate('bank', e.target.value)} />
          </div>
          <div className="adv-input-group mb-0">
            <label className="adv-label">A/c name</label>
            <input className="adv-input bg-white" value={data.bankDetails.accountName} onChange={e => handleBankUpdate('accountName', e.target.value)} />
          </div>
          <div className="adv-input-group mb-0">
            <label className="adv-label">A/c number</label>
            <input className="adv-input bg-white font-mono" value={data.bankDetails.accountNumber} onChange={e => handleBankUpdate('accountNumber', e.target.value)} />
          </div>
          <div className="adv-input-group mb-0">
            <label className="adv-label">IFSC code</label>
            <input className="adv-input bg-white font-mono" value={data.bankDetails.ifsc} onChange={e => handleBankUpdate('ifsc', e.target.value)} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Step4Policies;
