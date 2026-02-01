import React, { useState } from 'react';
import { ItineraryData } from '../types';
import { 
  Printer, Edit2, ArrowLeft, MapPin, Calendar, Users, 
  Briefcase, Phone, Mail, Navigation, Car, Heart, CheckCircle2, XCircle, CreditCard, Star, Clock, Globe, Building, Plane, Download, Loader2
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface Props {
  data: ItineraryData;
  onEdit: () => void;
  onBack: () => void;
}

const PreviewPage: React.FC<Props> = ({ data, onEdit, onBack }) => {
  const [isDownloading, setIsDownloading] = useState(false);

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

  const handleDownloadPDF = async () => {
    const element = document.getElementById('printable-area');
    if (!element) return;

    setIsDownloading(true);
    try {
      // Small delay to ensure any transitions are settled
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(element, {
        useCORS: true,
        scale: 2, // Higher quality
        backgroundColor: '#01003d',
        logging: false,
        windowWidth: 1000, // Force consistent width for capture
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions in points (72 points per inch)
      // jsPDF format [width, height] in chosen unit
      const pdfWidth = canvas.width;
      const pdfHeight = canvas.height;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [pdfWidth, pdfHeight]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const fileName = `${data.tripSummary.leadTraveler.replace(/\s+/g, '_')}_Itinerary.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const overviewCards = [
    { icon: Briefcase, label: 'Travel consultant', val: data.tripSummary.consultant.name, sum: data.tripSummary.consultant.contact },
    { icon: MapPin, label: 'Destinations', val: data.tripSummary.destinations.join(', ') || 'Various' },
    { icon: Clock, label: 'Duration', val: data.tripSummary.duration || 'TBA' },
    { icon: Calendar, label: 'Date of travel', val: data.tripSummary.travelDate || 'Flexible' },
    { icon: Users, label: 'Group size', val: `${data.tripSummary.groupSize} Pax` },
    { icon: Heart, label: 'Purpose', val: data.tripSummary.purpose || 'Adventure' },
    { icon: Car, label: 'Transports', val: data.tripSummary.transport || 'Private vehicle' },
    ...data.customFields.map(f => ({ icon: Star, label: f.heading, val: f.value }))
  ];

  return (
    <div className="bg-[#01003d] min-h-screen text-white font-['Poppins'] antialiased font-normal">
      {/* Action Bar */}
      <div className="no-print apple-blur sticky top-0 z-50 p-5 border-b border-white/5 flex justify-between items-center max-w-6xl mx-auto rounded-b-[32px] shadow-2xl px-10">
        <button onClick={onBack} className="flex items-center gap-2 text-[#01003d] font-normal text-[11px] uppercase tracking-widest hover:opacity-70 transition-colors">
          <ArrowLeft size={18} /> Dashboard
        </button>
        <div className="flex gap-4">
          <button onClick={onEdit} className="p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 shadow-sm transition-all text-[#01003d]">
            <Edit2 size={24} />
          </button>
          <button 
            onClick={handleDownloadPDF} 
            disabled={isDownloading}
            className="adv-btn-primary px-8 shadow-2xl font-normal disabled:opacity-50"
          >
            {isDownloading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <Download size={24} />
            )}
            {isDownloading ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto p-12 md:p-24 space-y-24 bg-[#01003d] border border-white/5" id="printable-area">
        
        <header className="pt-24 pb-0 text-center">
          <img 
            src="https://www.adventureholidays.co/logo.png" 
            alt="Adventure holidays" 
            className="h-48 mx-auto mb-80" 
          />
          
          <div className="space-y-6">
            <p className="text-[31px] md:text-[41px] text-[#c9c8c7] font-['Gloock',serif] font-bold tracking-[0.1em] [font-variant:small-caps]">
              Greetings from Adventure Holidays
            </p>
            
            <div className="flex flex-col items-center">
              <p className="text-xl md:text-2xl text-slate-400 font-normal leading-tight">
                It is our heartfelt pleasure to present this quotation to
              </p>

              <h1 className="font-['Montserrat',sans-serif] font-black brand-text-primary uppercase tracking-tighter leading-none text-5xl md:text-7xl lg:text-[100px] px-4 break-words py-1">
                {(data.tripSummary.leadTraveler || 'Valued Guest').toUpperCase()}
              </h1>

              <p className="text-xl md:text-2xl text-slate-400 font-normal leading-tight max-w-5xl mx-auto px-4">
                We would be truly honoured to craft a journey filled with comfort, care, and unforgettable moments, tailored especially for you.
              </p>
            </div>
          </div>
        </header>

        <section className="space-y-20 mt-20">
          <h2 className="text-3xl font-black font-['Montserrat',sans-serif] uppercase tracking-[0.6em] text-slate-600 text-center">Journey overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {overviewCards.map((card, idx) => (
              <div key={idx} className="p-10 bg-white/5 border border-white/10 rounded-[48px] flex flex-col gap-10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                    <card.icon className="brand-text-primary" size={28} />
                  </div>
                  <p className="text-2xl md:text-3xl font-normal text-slate-400 tracking-tight leading-tight">{card.label}</p>
                </div>
                <div>
                  <p className="text-3xl md:text-4xl font-normal leading-tight uppercase brand-text-primary">{card.val}</p>
                  {card.sum && <p className="text-sm font-normal mt-2 text-slate-500">{card.sum}</p>}
                </div>
              </div>
            ))}
            
            <div className="p-10 brand-bg-primary rounded-[48px] lg:col-span-2 flex flex-col gap-10 shadow-2xl border-none">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-[#01003d]/10 flex items-center justify-center">
                  <CreditCard className="text-[#01003d]" size={32} />
                </div>
                <p className="text-2xl md:text-3xl font-normal text-[#01003d] tracking-tight leading-tight">Package cost</p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[12px] font-normal text-slate-800 mb-2">With food</p>
                  <p className="text-5xl font-normal text-[#01003d]">{data.tripSummary.costWithFood || 'On request'}</p>
                </div>
                {data.tripSummary.hasNoFoodCost && (
                  <div>
                    <p className="text-[12px] font-normal text-slate-800 mb-2">Without food</p>
                    <p className="text-5xl font-normal text-[#01003d]">{data.tripSummary.costWithoutFood || 'On request'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Spacing between sections */}
        <div className="pt-24"></div>

        <section className="space-y-16">
          <h2 className="text-3xl font-black font-['Montserrat',sans-serif] uppercase tracking-[0.6em] text-slate-600 text-center">The experience</h2>
          <div className="space-y-48">
            {data.itinerary.map((day, i) => (
              (!day.isDisabled || day.day !== 0) && (
                <div key={i} className="group border-b border-white/5 pb-32 last:border-0">
                  <div className="flex flex-col md:flex-row gap-24">
                    <div className="shrink-0 text-center md:text-left min-w-[180px]">
                      {/* Increased visibility of day number */}
                      <div className="text-[150px] font-black text-white/10 group-hover:brand-text-primary leading-none transition-colors duration-500">{String(day.day).padStart(2, '0')}</div>
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
          </div>
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

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 py-10 font-normal">
           <div className="space-y-12">
              <h4 className="text-4xl font-black font-['Montserrat',sans-serif] uppercase tracking-[0.3em] text-slate-700">Terms & conditions</h4>
              <div className="space-y-8">
                {data.termsAndConditions.map((line, i) => (
                  <p key={i} className="text-xl text-slate-400 font-normal leading-relaxed border-l-4 border-white/5 pl-8">{line}</p>
                ))}
              </div>
           </div>
           <div className="space-y-12">
              <h4 className="text-4xl font-black font-['Montserrat',sans-serif] uppercase tracking-[0.3em] text-slate-700">Cancellation policy</h4>
              <div className="space-y-8">
                {data.cancellationPolicy.map((line, i) => (
                  <p key={i} className="text-xl text-red-400/80 font-normal leading-relaxed border-l-4 border-red-400/20 pl-8">{line}</p>
                ))}
              </div>
           </div>
        </section>

        <footer className="pt-24 pb-32 border-t border-white/10">
          <div className="max-w-6xl mx-auto space-y-20">
            <div className="text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-black font-['Montserrat',sans-serif] uppercase brand-text-primary">Ways to Reach us</h2>
              <p className="text-xl md:text-2xl text-slate-400 font-normal leading-relaxed max-w-3xl mx-auto">
                Have a question, a plan, or just an idea? Reach out to us anytime—we’re here to listen, guide, and make things happen together.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              <div className="space-y-4 text-center">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 mb-4 hover:border-yellow-400/50 transition-colors">
                    <Phone className="brand-text-primary" size={24} />
                  </div>
                </div>
                <h3 className="text-xs uppercase tracking-[0.3em] text-slate-500 font-normal">Phone</h3>
                <a href="tel:+917010933178" className="text-xl font-normal text-slate-300 hover:brand-text-primary transition-colors block">
                  +91 70109 33178
                </a>
              </div>

              <div className="space-y-4 text-center">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 mb-4 hover:border-yellow-400/50 transition-colors">
                    <Mail className="brand-text-primary" size={24} />
                  </div>
                </div>
                <h3 className="text-xs uppercase tracking-[0.3em] text-slate-500 font-normal">Email</h3>
                <a href="mailto:contact@adventureholidays.co" className="text-xl font-normal text-slate-300 hover:brand-text-primary transition-colors block break-words px-2">
                  contact@adventureholidays.co
                </a>
              </div>

              <div className="space-y-4 text-center">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 mb-4 hover:border-yellow-400/50 transition-colors">
                    <Globe className="brand-text-primary" size={24} />
                  </div>
                </div>
                <h3 className="text-xs uppercase tracking-[0.3em] text-slate-500 font-normal">Website</h3>
                <a href="https://www.adventureholidays.co" target="_blank" rel="noopener noreferrer" className="text-xl font-normal text-slate-300 hover:brand-text-primary transition-colors block">
                  www.adventureholidays.co
                </a>
              </div>

              <div className="space-y-4 text-center">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 mb-4 hover:border-yellow-400/50 transition-colors">
                    <MapPin className="brand-text-primary" size={24} />
                  </div>
                </div>
                <h3 className="text-xs uppercase tracking-[0.3em] text-slate-500 font-normal">Location</h3>
                <p className="text-xl font-normal text-slate-300 leading-relaxed px-2">
                  2nd Floor, Vishnu Complex,<br/>
                  1st Cross Street, Gandhipuram<br/>
                  Coimbatore - 641012
                </p>
              </div>
            </div>

            <div className="text-center pt-20">
              <img 
                src="https://www.adventureholidays.co/logo.png" 
                alt="Adventure holidays" 
                className="h-12 mx-auto opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700" 
              />
              <p className="text-[10px] text-slate-600 uppercase tracking-[0.5em] mt-8">Adventure Holidays &copy; 2024</p>
            </div>
          </div>
        </footer>

      </div>
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; background: #01003d !important; }
          .no-print { display: none !important; }
          #printable-area { 
            box-shadow: none !important; 
            border: none !important; 
            padding: 40px !important; 
            margin: 0 !important; 
            width: 100% !important; 
            max-width: 100% !important; 
            border-radius: 0 !important;
            background: #01003d !important;
            color: white !important;
          }
          .brand-bg-primary { background-color: #FECC00 !important; }
          h1, h2, h3, h4, p, li, span { color: inherit !important; font-weight: 400 !important; }
          .font-bold { font-weight: 700 !important; }
          img { -webkit-print-color-adjust: exact; }
          footer { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
};

export default PreviewPage;