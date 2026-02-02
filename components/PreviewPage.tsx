import React, { useState } from 'react';
import { ItineraryData } from '../types';
import { 
  Edit2, ArrowLeft, MapPin, Calendar, Users, 
  Phone, Mail, Car, Heart, CheckCircle2, XCircle, CreditCard, Star, Clock, Globe, Download, Loader2, MessageSquare, Compass
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
      const originalStyle = element.style.height;
      element.style.height = 'auto';

      await new Promise(resolve => setTimeout(resolve, 800));

      const canvas = await html2canvas(element, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#01003d',
        logging: false,
        width: 1000,
        windowWidth: 1000,
      });

      element.style.height = originalStyle;

      const imgData = canvas.toDataURL('image/jpeg', 0.85);
      
      const margin = 0;
      const pdfWidth = canvas.width;
      const pdfHeight = canvas.height;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [pdfWidth, pdfHeight],
        compress: true
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
      
      const destStr = data.tripSummary.destinations.join(', ');
      const fileName = `${data.quotationNumber} - ${data.tripSummary.leadTraveler} - ${destStr}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const row1 = [
    { icon: MapPin, label: 'Destinations', val: data.tripSummary.destinations.join(', ') || 'Various' },
    { icon: Clock, label: 'Duration', val: data.tripSummary.duration || 'TBA' },
  ];
  const row2 = [
    { icon: Heart, label: 'Group Type', val: data.tripSummary.purpose || 'Leisure' },
    { icon: Users, label: 'Group size', val: `${data.tripSummary.groupSize} Pax` },
  ];
  const row3 = [
    { icon: Calendar, label: 'Date of travel', val: data.tripSummary.travelDate || 'Flexible' },
    { icon: Car, label: 'Transport details', val: data.tripSummary.transport || 'Private vehicle' },
  ];

  return (
    <div className="bg-[#01003d] min-h-screen text-white font-['Poppins'] antialiased font-normal overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 topography-pattern"></div>
      
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
            {isDownloading ? 'Optimizing...' : 'Download PDF'}
          </button>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto p-0 space-y-0 bg-[#01003d] border border-white/5 flex flex-col items-stretch relative z-10" id="printable-area">
        
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] topography-pattern hidden print:block"></div>

        {/* --- PAGE 1: HEADER & OVERVIEW --- */}
        <div className="p-12 md:p-24 space-y-24">
          <header className="pt-24 pb-0 text-center relative">
            <div className="absolute -top-10 -left-10 opacity-5 rotate-12 pointer-events-none text-white">
               <svg width="400" height="400" viewBox="0 0 24 24" fill="currentColor"><path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z"/></svg>
            </div>

            <img 
              src="https://www.adventureholidays.co/logo.png" 
              alt="Adventure holidays" 
              className="h-48 mx-auto mb-80 relative z-10" 
            />
            
            <div className="space-y-6 relative z-10">
              <p className="text-[31px] md:text-[41px] text-white font-['Montserrat',sans-serif] font-black tracking-[0.1em] [font-variant:small-caps]">
                Greetings from Adventure Holidays
              </p>
              
              <div className="flex flex-col items-center">
                <p className="text-xl md:text-2xl text-white/90 font-normal leading-tight">
                  It is our heartfelt pleasure to present this quotation to
                </p>
                <h1 className="font-['Montserrat',sans-serif] font-black brand-text-primary uppercase tracking-tighter leading-none text-5xl md:text-7xl lg:text-[100px] px-4 break-words py-1">
                  {(data.tripSummary.leadTraveler || 'Valued Guest').toUpperCase()}
                </h1>
                <p className="text-xl md:text-2xl text-white/90 font-normal leading-tight max-w-5xl mx-auto px-4 text-center">
                  We would be truly honoured to craft a journey filled with comfort, care, and unforgettable moments, tailored especially for you.
                </p>
              </div>
            </div>
          </header>

          <section className="space-y-8 mt-20 relative">
            <h2 className="text-2xl font-black font-['Montserrat',sans-serif] uppercase tracking-[0.6em] text-white/80 text-center mb-12">Journey overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {row1.map((card, idx) => (
                <div key={idx} className="p-8 bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-[32px] group">
                  <div className="flex items-center gap-5 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-yellow-400/50 transition-colors">
                      <card.icon className="brand-text-primary" size={20} />
                    </div>
                    <p className="text-[10px] font-normal text-white/70 uppercase tracking-[0.2em]">{card.label}</p>
                  </div>
                  <p className="text-2xl font-normal leading-tight brand-text-primary break-words">{card.val}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {row2.map((card, idx) => (
                <div key={idx} className="p-8 bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-[32px] group">
                  <div className="flex items-center gap-5 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-yellow-400/50 transition-colors">
                      <card.icon className="brand-text-primary" size={20} />
                    </div>
                    <p className="text-[10px] font-normal text-white/70 uppercase tracking-[0.2em]">{card.label}</p>
                  </div>
                  <p className="text-2xl font-normal leading-tight brand-text-primary break-words">{card.val}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {row3.map((card, idx) => (
                <div key={idx} className="p-8 bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-[32px] group">
                  <div className="flex items-center gap-5 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-yellow-400/50 transition-colors">
                      <card.icon className="brand-text-primary" size={20} />
                    </div>
                    <p className="text-[10px] font-normal text-white/70 uppercase tracking-[0.2em]">{card.label}</p>
                  </div>
                  <p className="text-2xl font-normal leading-tight brand-text-primary break-words">{card.val}</p>
                </div>
              ))}
            </div>
            {data.customFields && data.customFields.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {data.customFields.map((field) => (
                  <div key={field.id} className="p-8 bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-[32px] group">
                    <div className="flex items-center gap-5 mb-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-yellow-400/50 transition-colors">
                        <MessageSquare className="brand-text-primary" size={20} />
                      </div>
                      <p className="text-[10px] font-normal text-white/70 uppercase tracking-[0.2em]">{field.heading}</p>
                    </div>
                    <p className="text-2xl font-normal leading-tight brand-text-primary break-words">{field.value}</p>
                  </div>
                ))}
              </div>
            )}
            {(data.tripSummary.pricingSlots && data.tripSummary.pricingSlots.length > 0) && (
              <div className="p-12 brand-bg-primary rounded-[40px] flex flex-col justify-center items-center gap-12 shadow-2xl border-none relative overflow-hidden group mt-12 w-full">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                   <CreditCard size={120} className="text-[#01003d]" />
                </div>
                <div className="w-full flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-[#01003d]/10 flex items-center justify-center border border-[#01003d]/5">
                      <CreditCard className="text-[#01003d]" size={32} />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#01003d]/40">Investment</p>
                      <p className="text-2xl font-black text-[#01003d] font-['Montserrat',sans-serif] leading-tight">PACKAGE COST</p>
                    </div>
                  </div>
                  <div className={`grid gap-12 text-center md:text-left flex-1 justify-end relative z-10 ${
                    data.tripSummary.pricingSlots.length === 1 ? 'grid-cols-1' : 
                    data.tripSummary.pricingSlots.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 
                    'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  }`}>
                    {data.tripSummary.pricingSlots.map((slot, index) => (
                      <div key={slot.id} className={`space-y-1 ${index > 0 ? 'border-l border-[#01003d]/10 pl-12' : ''}`}>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#01003d]/50 leading-tight">
                          {slot.label}
                        </p>
                        <p className="text-6xl font-normal text-[#01003d] tracking-tighter whitespace-nowrap leading-none">
                          {slot.price || 'On Request'}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#01003d]/60 mt-1">
                          {slot.unit}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          <div className="pt-24"></div>

          {/* --- EXPERIENCE --- */}
          <section className="space-y-16 relative">
            <div className="absolute top-1/2 -right-20 opacity-5 -translate-y-1/2 pointer-events-none rotate-45 text-white">
               <Compass size={400} />
            </div>
            <h2 className="text-3xl font-black font-['Montserrat',sans-serif] uppercase tracking-[0.6em] text-white/80 text-center">The experience</h2>
            <div className="space-y-48 relative z-10">
              {data.itinerary.map((day, i) => (
                (!day.isDisabled || day.day !== 0) && (
                  <div key={i} className="group border-b border-white/5 pb-32 last:border-0">
                    <div className="flex flex-col md:flex-row gap-24">
                      <div className="shrink-0 text-center md:text-left min-w-[180px]">
                        <div className="text-[150px] font-black text-white/10 group-hover:brand-text-primary leading-none transition-colors duration-500">{String(day.day).padStart(2, '0')}</div>
                        <div className="text-[16px] font-normal text-white/70 mt-4 uppercase tracking-[0.2em]">{getDayDate(day.day, day.date).formatted}</div>
                        <div className="text-[14px] font-normal brand-text-primary mt-1 uppercase tracking-[0.1em]">{getDayDate(day.day, day.date).dayName}</div>
                      </div>
                      <div className="flex-1 space-y-12 pt-10">
                        <h3 className="text-6xl font-normal text-white leading-tight uppercase tracking-tighter">{day.title || 'Adventure day'}</h3>
                        <div className="space-y-8">
                          {day.activities.map((act, j) => (
                            act && (
                              <div key={j} className="flex items-start gap-8 text-2xl text-white font-normal border-l-8 border-[#FECC00]/20 pl-8 group-hover:border-[#FECC00] leading-relaxed">
                                {act}
                              </div>
                            )
                          ))}
                        </div>
                        {day.images && day.images.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-16">
                            {day.images.map((img, k) => (
                              <div key={k} className="aspect-[4/5] rounded-[48px] overflow-hidden shadow-2xl border-4 border-white/10 relative">
                                <img src={img} className="w-full h-full object-cover" alt="Travel capture" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
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

          {/* --- INCLUSIONS / EXCLUSIONS --- */}
          <section className="flex flex-col gap-12 py-32 border-y border-white/5 relative">
            <div className="space-y-12 bg-green-500/5 backdrop-blur-sm p-16 rounded-[60px] border border-green-500/10 h-auto">
               <div className="flex items-center gap-6">
                 <CheckCircle2 className="text-green-400" size={32} />
                 <h3 className="text-4xl font-normal uppercase tracking-[0.2em] text-green-400">Inclusions</h3>
              </div>
              <ul className="space-y-8">
                {data.inclusions.map((inc, i) => (
                  <li key={i} className="flex items-start gap-6 text-xl font-normal text-white leading-relaxed">
                    <Star size={20} className="text-green-400 mt-1.5 shrink-0" /> {inc}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-12 bg-red-500/5 backdrop-blur-sm p-16 rounded-[60px] border border-red-500/10 h-auto">
               <div className="flex items-center gap-6">
                 <XCircle className="text-red-400" size={32} />
                 <h3 className="text-4xl font-normal uppercase tracking-[0.2em] text-red-400">Exclusions</h3>
              </div>
              <ul className="space-y-8">
                {data.exclusions.map((exc, i) => (
                  <li key={i} className="flex items-start gap-6 text-xl font-normal text-white leading-relaxed">
                    <XCircle size={20} className="text-red-400 mt-1.5 shrink-0" /> {exc}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* --- POLICIES --- */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 py-10 font-normal">
             <div className="space-y-12">
                <h4 className="text-4xl font-black font-['Montserrat',sans-serif] uppercase tracking-[0.3em] text-white/60">Terms & conditions</h4>
                <div className="space-y-8">
                  {data.termsAndConditions.map((line, i) => (
                    <p key={i} className="text-xl text-white font-normal leading-relaxed border-l-4 border-white/5 pl-8">{line}</p>
                  ))}
                </div>
             </div>
             <div className="space-y-12">
                <h4 className="text-4xl font-black font-['Montserrat',sans-serif] uppercase tracking-[0.3em] text-white/60">Cancellation policy</h4>
                <div className="space-y-8">
                  {data.cancellationPolicy.map((line, i) => (
                    <p key={i} className="text-xl text-red-400/80 font-normal leading-relaxed border-l-4 border-red-400/20 pl-8">{line}</p>
                  ))}
                </div>
             </div>
          </section>

          {/* --- GOOGLE RATING & ABOUT US --- */}
          <section className="py-24 space-y-20 border-t border-white/5 flex flex-col items-center relative z-10">
            <div className="flex flex-col items-center text-center space-y-4">
               <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <svg key={i} width="50" height="50" viewBox="0 0 24 24" fill="#FECC00" className="drop-shadow-lg"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  ))}
               </div>
               <div className="flex flex-col md:flex-row items-center gap-6">
                  <span className="text-[140px] md:text-[200px] font-['Montserrat',sans-serif] font-black brand-text-primary leading-none tracking-tighter drop-shadow-[0_10px_10px_rgba(254,204,0,0.2)]">
                    4.8
                  </span>
                  <div className="flex flex-col items-center md:items-start">
                     <span className="text-4xl md:text-6xl font-['Montserrat',sans-serif] font-black brand-text-primary tracking-tight leading-none">GOOGLE</span>
                     <span className="text-4xl md:text-6xl font-['Montserrat',sans-serif] font-black brand-text-primary tracking-tight leading-none">RATING</span>
                  </div>
               </div>
               <p className="text-2xl md:text-3xl text-white font-bold leading-tight max-w-2xl px-4">
                  Loved by 500+ travelers who trusted us with their journeys
               </p>
            </div>
            <div className="w-full text-left space-y-4 px-4 md:px-0">
               <h3 className="text-4xl md:text-5xl font-['Montserrat',sans-serif] font-black brand-text-primary uppercase tracking-tighter">ABOUT US:</h3>
               <p className="text-2xl md:text-3xl text-white font-bold leading-[1.3] max-w-none">
                  Adventure Holidays is a travel agency offering domestic and international tour packages, designed to plan, manage, and deliver complex travel experiences at scale with institutional-grade precision
               </p>
            </div>
          </section>
        </div>

        {/* --- STATS & CONTACT FINAL PAGE (Theme-Integrated) --- */}
        <section className="p-12 md:p-24 space-y-24 min-h-screen flex flex-col items-center justify-between font-['Poppins'] text-white border-t border-white/5 relative z-10">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-16 text-center">
            <div className="space-y-4">
              <h4 className="text-9xl md:text-[140px] font-['Bebas_Neue',cursive] brand-text-primary leading-none tracking-tight">25000+</h4>
              <p className="text-xl md:text-2xl font-bold leading-tight max-w-[320px] mx-auto text-white/80">Travelers holding memories crafted by us</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-9xl md:text-[120px] font-['Bebas_Neue',cursive] brand-text-primary leading-none tracking-tight">1500+</h4>
              <p className="text-xl md:text-2xl font-bold leading-tight max-w-[320px] mx-auto text-white/80">Journeys executed with institutional-grade precision</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center space-y-12 relative w-full">
            <div className="space-y-4">
              <p className="text-3xl md:text-5xl font-['Gloock',serif] italic leading-none">need a <span className="text-[#FECC00] not-italic font-['Montserrat'] font-black uppercase">PERSONALISED</span></p>
              <h2 className="text-6xl md:text-[90px] font-['Montserrat',sans-serif] font-black brand-text-primary uppercase tracking-tighter leading-none">TOUR PACKAGE?</h2>
            </div>

            <div className="relative py-12 flex flex-col items-center group">
               {/* Dotted Flight Path */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] opacity-10 group-hover:opacity-30 transition-opacity">
                  <svg viewBox="0 0 400 200" className="w-full h-full" fill="none" stroke="white" strokeWidth="2" strokeDasharray="8 8">
                    <path d="M50 150 Q200 0 350 150" />
                  </svg>
               </div>
               <div className="brand-bg-primary text-[#01003d] p-6 rounded-full shadow-2xl relative z-10 scale-125">
                 <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
               </div>
               <p className="text-3xl md:text-4xl font-['Poppins',sans-serif] font-normal mt-12">we are <span className="font-['Montserrat'] not-italic font-black brand-text-primary">HERE</span> to hear your voice</p>
            </div>
          </div>

          <div className="w-full space-y-16">
            <div className="relative flex justify-center py-10">
               <div className="absolute inset-0 bg-yellow-400/5 rounded-full scale-150 opacity-20 blur-3xl"></div>
               <div className="flex items-center gap-6 relative z-10">
                 <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white border border-white/10">
                    <Phone size={24} />
                 </div>
                 <h3 className="text-3xl md:text-5xl font-['Montserrat',sans-serif] font-black tracking-tighter text-white">+91-7010933178</h3>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 border-t border-white/10 pt-16">
              <div className="space-y-10">
                <div className="flex items-center gap-6 group">
                   <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-[#FECC00] group-hover:brand-bg-primary group-hover:text-[#01003d] transition-all border border-white/5">
                      <Globe size={32} />
                   </div>
                   <p className="text-2xl md:text-3xl font-['Poppins',sans-serif] font-normal text-white hover:brand-text-primary transition-colors cursor-pointer">www.adventureholidays.co</p>
                </div>
                <div className="flex items-center gap-6 group">
                   <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-[#FECC00] group-hover:brand-bg-primary group-hover:text-[#01003d] transition-all border border-white/5">
                      <Mail size={32} />
                   </div>
                   <p className="text-2xl md:text-3xl font-['Poppins',sans-serif] font-normal text-white hover:brand-text-primary transition-colors cursor-pointer">contact@adventureholidays.co</p>
                </div>
              </div>
              
              <div className="flex gap-6 group">
                 <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-[#FECC00] shrink-0 group-hover:brand-bg-primary group-hover:text-[#01003d] transition-all border border-white/5">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>
                 </div>
                 <div className="space-y-1">
                   <p className="text-2xl md:text-3xl font-['Poppins',sans-serif] font-normal leading-tight text-white/90">
                     2nd Floor, Vishnu Complex,<br/>
                     1st Cross Street, Gandhipuram<br/>
                     Coimbatore - 641012
                   </p>
                 </div>
              </div>
            </div>
          </div>
        </section>

      </div>
      <style>{`
        .topography-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='500' height='500' viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 20C40 10 80 50 120 40C160 30 200 70 240 60C280 50 320 90 360 80C400 70 440 110 480 100M20 60C50 50 90 90 130 80C170 70 210 110 250 100C290 90 330 130 370 120C410 110 450 150 490 140M30 100C60 90 100 130 140 120C180 110 220 150 260 140C300 130 340 170 380 160C420 150 460 190 500 180M0 140C30 130 70 170 110 160C150 150 190 190 230 180C270 170 310 210 350 200C390 190 430 230 470 220' stroke='white' fill='transparent' stroke-width='0.5' stroke-dasharray='2,2'/%3E%3C/svg%3E");
          background-size: 500px 500px;
        }

        @media print {
          body { -webkit-print-color-adjust: exact; background-color: #01003d !important; }
          .no-print { display: none !important; }
          #printable-area { 
            box-shadow: none !important; 
            border: none !important; 
            padding: 0 !important; 
            margin: 0 !important; 
            width: 100% !important; 
            max-width: 100% !important; 
            border-radius: 0 !important;
            background-color: #01003d !important;
          }
          .brand-bg-primary { background-color: #FECC00 !important; }
          .brand-text-primary { color: #FECC00 !important; }
          h1, h2, h3, h4, p, li, span { color: white !important; -webkit-print-color-adjust: exact; }
          .brand-text-primary { color: #FECC00 !important; }
          img { -webkit-print-color-adjust: exact; }
          section { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
};

export default PreviewPage;