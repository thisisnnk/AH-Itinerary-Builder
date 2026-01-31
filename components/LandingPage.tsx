
import React, { useState } from 'react';
import { Upload, Loader2, Compass, AlertCircle } from 'lucide-react';
import { extractItineraryData } from '../services/geminiService';
import { ItineraryData } from '../types';
import * as mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs`;

interface Props {
  onComplete: (data: Partial<ItineraryData>) => void;
  setIsLoading: (loading: boolean) => void;
}

const LandingPage: React.FC<Props> = ({ onComplete, setIsLoading }) => {
  const [quotationNo, setQuotationNo] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const parsePdf = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return fullText;
  };

  const parseDocx = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10MB.");
      return;
    }

    setUploading(true);
    setIsLoading(true);
    setError('');

    try {
      let extractedText = '';
      const arrayBuffer = await file.arrayBuffer();

      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        extractedText = await parsePdf(arrayBuffer);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
        extractedText = await parseDocx(arrayBuffer);
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        extractedText = new TextDecoder().decode(arrayBuffer);
      } else {
        throw new Error("Unsupported file format. Please upload PDF, DOCX, or TXT.");
      }

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error("Could not extract any text from the document.");
      }

      // Limit extracted text to reasonable length if it's still massive (safety)
      const sanitizedText = extractedText.slice(0, 50000); 

      const extracted = await extractItineraryData(sanitizedText);
      onComplete({ ...extracted, quotationNumber: quotationNo || extracted.quotationNumber });
      
    } catch (err: any) {
      console.error("Extraction process failed:", err);
      setError(`Analysis failed: ${err.message || "Unknown error"}.`);
    } finally {
      setUploading(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto mt-20">
      <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-8">
        <Compass className="text-[#007AFF] w-10 h-10" />
      </div>
      
      <h1 className="text-5xl font-bold tracking-tight mb-4 text-slate-900">LuxePath</h1>
      <p className="text-xl text-gray-500 mb-12">
        Create world-class travel itineraries in seconds. <br/>
        Upload your quotation and let AI handle the rest.
      </p>

      <div className="w-full apple-card p-8 space-y-8">
        <div className="flex flex-col items-start w-full">
          <label className="text-sm font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider">
            Quotation Number (Optional)
          </label>
          <input 
            type="text" 
            placeholder="e.g. LUX-2024-001"
            className="w-full apple-input text-lg"
            value={quotationNo}
            onChange={(e) => setQuotationNo(e.target.value)}
          />
        </div>

        <div className="relative group">
          <input 
            type="file" 
            accept=".pdf,.docx,.txt"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            disabled={uploading}
          />
          <div className={`border-2 border-dashed border-gray-200 rounded-2xl p-10 transition-all duration-300 ${uploading ? 'bg-gray-50' : 'group-hover:border-[#007AFF] group-hover:bg-blue-50'}`}>
            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="animate-spin text-[#007AFF] mb-4" size={40} />
                <p className="text-lg font-medium">Analyzing document...</p>
                <p className="text-sm text-gray-400 mt-1">Our AI is extracting your itinerary details</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 transition-colors group-hover:bg-blue-100">
                  <Upload className="text-gray-400 group-hover:text-[#007AFF]" size={28} />
                </div>
                <p className="text-lg font-medium">Click or drag quotation</p>
                <p className="text-sm text-gray-400 mt-1">Supports PDF, DOCX and Text files</p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-center gap-3 text-left">
            <AlertCircle className="shrink-0" size={20} />
            <span>{error}</span>
          </div>
        )}

        <button 
          onClick={() => onComplete({ quotationNumber: quotationNo })}
          className="w-full text-blue-600 font-medium hover:underline py-2"
        >
          Or start with a blank itinerary
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
