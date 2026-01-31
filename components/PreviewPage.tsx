
import React from 'react';
import { ItineraryData } from '../types';
import { 
  Printer, Edit2, ArrowLeft, MapPin, Calendar, Users, 
  Briefcase, Phone, Mail, Navigation, Car, Heart, CheckCircle2, XCircle, CreditCard, Star, Clock, Globe 
} from 'lucide-react';

interface Props {
  data: ItineraryData;
  onEdit: () => void;
  onBack: () => void;
}

const PreviewPage: React.FC<Props> = ({ data, onEdit, onBack }) => {
  const getDayDate = (dayNum: number, specificDate?: string) => {
    if (specificDate) {
      const d = new Date(specificDate);
      return {
        formatted: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        dayName: d.toLocaleDateString('en-GB', { weekday: 'long' })
      };
    }
    if (!data.tripSummary.travelDate) return { formatted: 'TBA', dayName: '' };
    const date = new Date(data.tripSummary.travelDate);
    date.setDate(date.getDate() + (dayNum > 0 ? dayNum - 1 : 0));
    return {
      formatted: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      dayName: date.toLocaleDateString('en-GB', { weekday: 'long' })
    };
  };

  const overviewCards = [
    { icon: Briefcase, label: 'Travel consultant', val: data.tripSummary.consultant.name, sub: data.tripSummary.consultant.contact },
    { icon: MapPin, label: 'Destinations', val: data.tripSummary.destinations.join(', ') || 'Various' },
    { icon: Clock, label: 'Duration', val: data.tripSummary.duration || 'TBA' },
    { icon: Calendar, label: 'Date of travel', val: data.tripSummary.travelDate || 'Flexible' },
    { icon: Users, label: 'Group size', val: `${data.tripSummary.groupSize} Pax` },
    { icon: Heart, label: 'Purpose', val: data.tripSummary.purpose || 'Adventure' },
    { icon: Car, label: 'Transports', val: data.tripSummary.transport || 'Private vehicle' },
    ...data.customFields.map(f => ({ icon: Star, label: f.heading, val: f.value }))
  ];

  return (
    <div className="bg-[#050B20] min-h-screen text-white font-['Poppins'] antialiased font-normal">
      {/* Action Bar */}
      <div className="no-print sticky top-0 z-50 apple-blur p-5 border-b border-white/5 flex justify-between items-center max-w-6xl mx-auto rounded-b-[32px] shadow-2xl px-10">
        <button onClick={onBack} className="flex items-center gap-2 text-[#050B20] font-normal text-[11px] uppercase tracking-widest hover:opacity-70 transition-colors">
          <ArrowLeft size={18} /> Dashboard
        </button>
        <div className="flex gap-4">
          <button onClick={onEdit} className="p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 shadow-sm transition-all text-[#050B20]">
            <Edit2 size={24} />
          </button>
          <button onClick={() => window.print()} className="adv-btn-primary px-8 shadow-2xl font-normal">
            <Printer size={24} /> Print itinerary
          </button>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto p-12 md:p-24 space-y-32 bg-[#050B20] border border-white/5" id="printable-area">
        
        <header className="space-y-12 text-center py-20 transform scale-125 origin-top">
          <img src="https://www.adventureholidays.co/logo.png" alt="Adventure holidays" className="h-48 mx-auto brightness-0 invert" />
          <div className="space-y-4">
            <p className="text-xl font-normal text-slate-400">Hey</p>
            <h1 className="text-9xl font-normal tracking-tighter leading-none brand-text-primary uppercase">
              {data.tripSummary.leadTraveler || 'Adventurer'}
            </h1>
            <p className="text-xl font-normal text-slate-400">here's your curated tour itinerary</p>
          </div>
          <div className="flex justify-center pt-8">
            <span className="border-2 border-[#FECC00] text-[#FECC00] px-10 py-4 rounded-full text-sm font-normal uppercase tracking-[0.5em]">Reference: {data.quotationNumber}</span>
          </div>
        </header>

        <section className="space-y-20 pt-40">
          <h2 className="text-3xl font-normal uppercase tracking-[0.6em] text-slate-600 text-center">Journey overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {overviewCards.map((card, idx) => (
              <div key={idx} className="p-10 bg-white/5 border border-white/10 rounded-[48px] flex flex-col justify-between">
                <card.icon className="brand-text-primary mb-6" size={20} />
                <div>
                  <p className="text-[12px] font-normal text-slate-400 mb-2">{card.label}</p>
                  <p className="text-3xl font-normal leading-tight uppercase brand-text-primary">{card.val}</p>
                  {card.sub && <p className="text-sm font-normal mt-2 text-slate-500">{card.sub}</p>}
                </div>
              </div>
            ))}
            
            <div className="p-10 brand-bg-primary rounded-[48px] lg:col-span-2 flex flex-col justify-between shadow-2xl border-none">
              <CreditCard className="text-[#050B20] mb-6" size={28} />
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[12px] font-normal text-slate-800 mb-2">With food</p>
                  <p className="text-5xl font-normal text-[#050B20]">{data.tripSummary.costWithFood || 'On request'}</p>
                </div>
                {data.tripSummary.hasNoFoodCost && (
                  <div>
                    <p className="text-[12px] font-normal text-slate-800 mb-2">Without food</p>
                    <p className="text-5xl font-normal text-[#050B20]">{data.tripSummary.costWithoutFood || 'On request'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-48">
          <h2 className="text-3xl font-normal uppercase tracking-[0.6em] text-slate-600 text-center">The experience</h2>
          {data.itinerary.map((day, i) => (
            (!day.isDisabled || day.day !== 0) && (
              <div key={i} className="group border-b border-white/5 pb-32 last:border-0">
                <div className="flex flex-col md:flex-row gap-24">
                  <div className="shrink-0 text-center md:text-left min-w-[180px]">
                    <div className="text-[150px] font-normal text-white/5 group-hover:brand-text-primary leading-none">{String(day.day).padStart(2, '0')}</div>
                    <div className="text-[16px] font-normal text-slate-500 mt-4 uppercase tracking-[0.2em]">{getDayDate(day.day, day.date).formatted}</div>
                    <div className="text-[14px] font-normal brand-text-primary mt-1 uppercase tracking-[0.1em]">{getDayDate(day.day, day.date).dayName}</div>
                  </div>
                  <div className="flex-1 space-y-12 pt-10">
                    <h3 className="text-6xl font-normal text-white leading-tight uppercase tracking-tighter">{day.title || 'Adventure day'}</h3>
                    <div className="space-y-8">
                      {day.activities.map((act, j) => (
                        act && (
                          <div key={j} className="flex items-start gap-8 text-2xl text-slate-300 font-normal border-l-8 border-[#FECC00]/20 pl-8 group-hover:border-[#FECC00] leading-relaxed">
                            {act}
                          </div>
                        )
                      ))}
                    </div>
                    {day.images && day.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-16">
                        {day.images.map((img, k) => (
                          <div key={k} className="aspect-[4/5] rounded-[48px] overflow-hidden shadow-2xl border-4 border-white/10">
                            <img src={img} className="w-full h-full object-cover" alt="Travel capture" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          ))}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-24 py-32 border-y border-white/5">
          <div className="space-y-12 bg-green-500/10 p-16 rounded-[60px] border border-green-500/20">
             <div className="flex items-center gap-6">
               <CheckCircle2 className="text-green-400" size={32} />
               <h3 className="text-4xl font-normal uppercase tracking-[0.2em] text-green-400">Inclusions</h3>
            </div>
            <ul className="space-y-8">
              {data.inclusions.map((inc, i) => (
                <li key={i} className="flex items-start gap-6 text-xl font-normal text-slate-300 leading-relaxed">
                  <Star size={20} className="text-green-400 mt-1.5 shrink-0" /> {inc}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-12 bg-red-500/10 p-16 rounded-[60px] border border-red-500/20">
             <div className="flex items-center gap-6">
               <XCircle className="text-red-400" size={32} />
               <h3 className="text-4xl font-normal uppercase tracking-[0.2em] text-red-400">Exclusions</h3>
            </div>
            <ul className="space-y-8">
              {data.exclusions.map((exc, i) => (
                <li key={i} className="flex items-start gap-6 text-xl font-normal text-slate-400 leading-relaxed">
                  <XCircle size={20} className="text-red-400 mt-1.5 shrink-0" /> {exc}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 pt-10 font-normal">
           <div className="space-y-12">
              <h4 className="text-4xl font-normal uppercase tracking-[0.3em] text-slate-700">Terms & conditions</h4>
              <div className="space-y-8">
                {data.termsAndConditions.map((line, i) => (
                  <p key={i} className="text-xl text-slate-400 font-normal leading-relaxed border-l-4 border-white/5 pl-8">{line}</p>
                ))}
              </div>
           </div>
           <div className="space-y-12">
              <h4 className="text-4xl font-normal uppercase tracking-[0.3em] text-slate-700">Cancellation policy</h4>
              <div className="space-y-8">
                {data.cancellationPolicy.map((line, i) => (
                  <p key={i} className="text-xl text-red-400/80 font-normal leading-relaxed border-l-4 border-red-400/20 pl-8">{line}</p>
                ))}
              </div>
           </div>
        </section>

        <section className="bg-white/5 border border-white/10 p-20 rounded-[80px] space-y-16">
           <div className="flex items-center gap-8">
              <CreditCard className="brand-text-primary" size={48} />
              <h3 className="text-4xl font-normal uppercase tracking-[0.3em]">Bank transfers</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                { label: 'Bank name', value: data.bankDetails.bank },
                { label: 'A/c name', value: data.bankDetails.accountName },
                { label: 'A/c number', value: data.bankDetails.accountNumber },
                { label: 'IFSC code', value: data.bankDetails.ifsc },
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <p className="text-[12px] font-normal text-slate-500">{item.label}</p>
                  <p className="text-2xl font-normal brand-text-primary uppercase">{item.value}</p>
                </div>
              ))}
           </div>
        </section>

        <footer className="pt-40">
          <div className="p-24 bg-white/5 border border-white/10 rounded-[100px] text-white relative overflow-hidden text-center">
            <div className="relative z-10 space-y-24">
              <img src="https://www.adventureholidays.co/logo.png" alt="Logo" className="h-32 mx-auto brightness-0 invert" />
              <h3 className="text-8xl font-normal leading-tight tracking-tighter uppercase">Find us <span className="brand-text-primary">here</span>.</h3>
              
              <div className="space-y-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl mx-auto">
                   <div className="flex flex-col items-center gap-6">
                      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-[#FECC00]">
                        <Phone size={32} />
                      </div>
                      <p className="text-4xl font-normal uppercase">+91 70109 33178</p>
                      <p className="text-[12px] font-normal text-slate-500">Contact number</p>
                   </div>
                   <div className="flex flex-col items-center gap-6">
                      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-[#FECC00]">
                        <Mail size={32} />
                      </div>
                      <p className="text-3xl font-normal uppercase">contact@adventureholidays.co</p>
                      <p className="text-[12px] font-normal text-slate-500">Official email</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl mx-auto pt-16 border-t border-white/5">
                   <div className="flex flex-col items-center gap-6">
                      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-[#FECC00]">
                        <Globe size={32} />
                      </div>
                      <p className="text-3xl font-normal uppercase">www.adventureholidays.co</p>
                      <p className="text-[12px] font-normal text-slate-500">Our website</p>
                   </div>
                   <div className="flex flex-col items-center gap-6">
                      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-[#FECC00]">
                        <Navigation size={32} />
                      </div>
                      <p className="text-2xl font-normal leading-snug max-w-xs mx-auto">
                        2nd floor, Vishnu complex, Gandhipuram, Coimbatore
                      </p>
                      <p className="text-[12px] font-normal text-slate-500">Office location</p>
                   </div>
                </div>
              </div>

              <div className="pt-24 border-t border-white/5 text-[12px] font-normal text-slate-600 uppercase tracking-[0.4em]">
                Adventure holidays © 2024 • Build for exploration
              </div>
            </div>
          </div>
        </footer>

      </div>
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; background: #050B20 !important; }
          .no-print { display: none !important; }
          #printable-area { 
            box-shadow: none !important; 
            border: none !important; 
            padding: 40px !important; 
            margin: 0 !important; 
            width: 100% !important; 
            max-width: 100% !important; 
            border-radius: 0 !important;
            background: #050B20 !important;
            color: white !important;
          }
          .brand-bg-primary { background-color: #FECC00 !important; }
          h1, h2, h3, h4, p, li, span { color: inherit !important; font-weight: 400 !important; }
          img { -webkit-print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
};

export default PreviewPage;
