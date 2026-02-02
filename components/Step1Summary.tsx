
import React from 'react';
import { ItineraryData, CustomField, PricingSlot } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  data: ItineraryData;
  updateData: (updates: Partial<ItineraryData>) => void;
}

const Step1Summary: React.FC<Props> = ({ data, updateData }) => {
  const handleSummaryChange = (key: string, value: any) => {
    updateData({ tripSummary: { ...data.tripSummary, [key]: value } });
  };

  const handleConsultantChange = (key: string, value: string) => {
    updateData({ tripSummary: { ...data.tripSummary, consultant: { ...data.tripSummary.consultant, [key]: value } } });
  };

  const addCustomField = () => {
    const newField: CustomField = { id: Math.random().toString(36).substr(2, 9), heading: '', value: '' };
    updateData({ customFields: [...data.customFields, newField] });
  };

  const updateCustomField = (id: string, updates: Partial<CustomField>) => {
    updateData({
      customFields: data.customFields.map(f => f.id === id ? { ...f, ...updates } : f)
    });
  };

  const removeCustomField = (id: string) => {
    updateData({ customFields: data.customFields.filter(f => f.id !== id) });
  };

  // Pricing Slot Handlers
  const addPricingSlot = () => {
    const newSlot: PricingSlot = {
      id: Math.random().toString(36).substr(2, 9),
      label: 'New Cost Slot',
      price: '',
      unit: 'Per Pax'
    };
    handleSummaryChange('pricingSlots', [...(data.tripSummary.pricingSlots || []), newSlot]);
  };

  const updatePricingSlot = (id: string, updates: Partial<PricingSlot>) => {
    const updatedSlots = data.tripSummary.pricingSlots.map(s => 
      s.id === id ? { ...s, ...updates } : s
    );
    handleSummaryChange('pricingSlots', updatedSlots);
  };

  const removePricingSlot = (id: string) => {
    const updatedSlots = data.tripSummary.pricingSlots.filter(s => s.id !== id);
    handleSummaryChange('pricingSlots', updatedSlots);
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500 font-['Poppins'] font-normal">
      
      {/* 1. Consultant Details */}
      <section className="space-y-6">
        <h3 className="text-sm font-normal text-slate-400 border-l-4 border-yellow-400 pl-4">1. Consultant details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="adv-input-group">
            <label className="adv-label">Consultant name</label>
            <input className="adv-input font-normal" value={data.tripSummary.consultant.name} onChange={e => handleConsultantChange('name', e.target.value)} />
          </div>
          <div className="adv-input-group">
            <label className="adv-label">Consultant number</label>
            <input className="adv-input font-normal" value={data.tripSummary.consultant.contact} onChange={e => handleConsultantChange('contact', e.target.value)} />
          </div>
        </div>
      </section>

      {/* 2. Quotation Details */}
      <section className="space-y-6">
        <h3 className="text-sm font-normal text-slate-400 border-l-4 border-yellow-400 pl-4">2. Quotation details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="adv-input-group">
            <label className="adv-label">Itinerary number</label>
            <input className="adv-input font-normal" value={data.quotationNumber} onChange={e => updateData({ quotationNumber: e.target.value })} />
          </div>
          <div className="adv-input-group">
            <label className="adv-label">Quotation date</label>
            <input type="date" className="adv-input font-normal" value={data.tripSummary.quotationDate} onChange={e => handleSummaryChange('quotationDate', e.target.value)} />
          </div>
        </div>
      </section>

      {/* 3. Trip Details */}
      <section className="space-y-6">
        <h3 className="text-sm font-normal text-slate-400 border-l-4 border-yellow-400 pl-4">3. Trip details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="adv-input-group col-span-2">
            <label className="adv-label">Destination</label>
            <input className="adv-input font-normal" placeholder="e.g. Kerala, Munnar..." value={data.tripSummary.destinations.join(', ')} onChange={e => handleSummaryChange('destinations', e.target.value.split(',').map(s => s.trim()))} />
          </div>
          <div className="adv-input-group">
            <label className="adv-label">Durations</label>
            <input className="adv-input font-normal" placeholder="2N/3D" value={data.tripSummary.duration} onChange={e => handleSummaryChange('duration', e.target.value)} />
          </div>
          <div className="adv-input-group">
            <label className="adv-label">Date of travel</label>
            <input type="date" className="adv-input font-normal" value={data.tripSummary.travelDate} onChange={e => handleSummaryChange('travelDate', e.target.value)} />
          </div>
          <div className="adv-input-group col-span-2">
            <label className="adv-label">Transport details</label>
            <input className="adv-input font-normal" value={data.tripSummary.transport} onChange={e => handleSummaryChange('transport', e.target.value)} />
          </div>
        </div>
      </section>

      {/* 4. Client Details */}
      <section className="space-y-6">
        <h3 className="text-sm font-normal text-slate-400 border-l-4 border-yellow-400 pl-4">4. Client details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="adv-input-group">
            <label className="adv-label">Client name</label>
            <input className="adv-input font-normal" value={data.tripSummary.leadTraveler} onChange={e => handleSummaryChange('leadTraveler', e.target.value)} />
          </div>
          <div className="adv-input-group">
            <label className="adv-label">Group size (Pax)</label>
            <input type="number" className="adv-input font-normal" value={data.tripSummary.groupSize} onChange={e => handleSummaryChange('groupSize', parseInt(e.target.value) || 0)} />
          </div>
        </div>
      </section>

      {/* 5. Custom Information */}
      <section className="space-y-6">
        <div className="flex justify-between items-center border-l-4 border-yellow-400 pl-4">
           <h3 className="text-sm font-normal text-slate-400">5. Custom information</h3>
           <button onClick={addCustomField} className="text-[11px] font-normal text-blue-600 flex items-center gap-1">
             <Plus size={14} /> Add heading
           </button>
        </div>
        <div className="space-y-4">
          {data.customFields.map((field) => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end bg-slate-50 p-4 rounded-xl">
              <div className="adv-input-group mb-0">
                <label className="adv-label">Heading name</label>
                <input className="adv-input font-normal" value={field.heading} onChange={e => updateCustomField(field.id, { heading: e.target.value })} placeholder="e.g. Flight info" />
              </div>
              <div className="adv-input-group mb-0 flex gap-2">
                <div className="flex-1">
                  <label className="adv-label">Value / content</label>
                  <input className="adv-input font-normal" value={field.value} onChange={e => updateCustomField(field.id, { value: e.target.value })} placeholder="Enter info..." />
                </div>
                <button onClick={() => removeCustomField(field.id)} className="p-3 text-red-400 hover:bg-red-50 rounded-lg">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
          {data.customFields.length === 0 && (
            <p className="text-xs text-slate-300">No custom headings added.</p>
          )}
        </div>
      </section>

      {/* 6. Costing (Revised for multiple dynamic slots) */}
      <section className="space-y-10">
        <div className="flex justify-between items-center border-l-4 border-yellow-400 pl-4">
           <h3 className="text-sm font-normal text-slate-400">6. Costing</h3>
           <button onClick={addPricingSlot} className="text-[11px] font-normal text-blue-600 flex items-center gap-1">
             <Plus size={14} /> Add pricing slot
           </button>
        </div>
        
        <div className="space-y-8">
          {(data.tripSummary.pricingSlots || []).map((slot, index) => (
            <div key={slot.id} className="bg-slate-50/50 p-8 rounded-[24px] relative group animate-in fade-in slide-in-from-right-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                <div className="adv-input-group mb-0">
                  <label className="adv-label">Slot {index + 1} label</label>
                  <input 
                    className="adv-input font-normal" 
                    value={slot.label} 
                    onChange={e => updatePricingSlot(slot.id, { label: e.target.value })} 
                    placeholder="e.g. Inclusive of all meals" 
                  />
                </div>
                <div className="adv-input-group mb-0">
                  <label className="adv-label">Price</label>
                  <input 
                    className="adv-input font-normal" 
                    placeholder="₹ 15,000" 
                    value={slot.price} 
                    onChange={e => updatePricingSlot(slot.id, { price: e.target.value })} 
                  />
                </div>
                <div className="adv-input-group mb-0 flex gap-2">
                  <div className="flex-1">
                    <label className="adv-label">Unit</label>
                    <input 
                      className="adv-input font-normal" 
                      placeholder="e.g. Per Pax" 
                      value={slot.unit} 
                      onChange={e => updatePricingSlot(slot.id, { unit: e.target.value })} 
                    />
                  </div>
                  {data.tripSummary.pricingSlots.length > 1 && (
                    <button 
                      onClick={() => removePricingSlot(slot.id)} 
                      className="p-3 text-red-400 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {(!data.tripSummary.pricingSlots || data.tripSummary.pricingSlots.length === 0) && (
            <div className="text-center py-10 bg-slate-50 rounded-[24px]">
               <p className="text-xs text-slate-300">Click "Add pricing slot" to set the package cost.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Step1Summary;
