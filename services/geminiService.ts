
import { GoogleGenAI, Type } from "@google/genai";
import { ItineraryData } from "../types";

export const extractItineraryData = async (text: string): Promise<Partial<ItineraryData>> => {
  /**
   * Always use `const ai = new GoogleGenAI({apiKey: process.env.API_KEY});`.
   * The API key must be obtained exclusively from the environment variable `process.env.API_KEY`.
   */
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional travel coordinator. Extract structured travel itinerary data from the provided text. 
      If certain information is missing, leave the field empty. 
      Ensure dates are in DD.MM.YYYY format where possible.
      
      Text to analyze:
      ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quotationNumber: { type: Type.STRING },
            tripSummary: {
              type: Type.OBJECT,
              properties: {
                consultant: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    contact: { type: Type.STRING }
                  }
                },
                quotationDate: { type: Type.STRING },
                reference: { type: Type.STRING },
                leadTraveler: { type: Type.STRING },
                groupSize: { type: Type.NUMBER },
                travelDate: { type: Type.STRING },
                purpose: { type: Type.STRING },
                duration: {
                  type: Type.OBJECT,
                  properties: {
                    nights: { type: Type.NUMBER },
                    days: { type: Type.NUMBER }
                  }
                },
                destinations: { type: Type.ARRAY, items: { type: Type.STRING } },
                transport: { type: Type.STRING },
                costPerHead: { type: Type.STRING }
              }
            },
            itinerary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.NUMBER },
                  title: { type: Type.STRING },
                  activities: { type: Type.ARRAY, items: { type: Type.STRING } },
                  transport: { type: Type.STRING },
                  accommodation: { type: Type.STRING },
                  meals: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            inclusions: { type: Type.ARRAY, items: { type: Type.STRING } },
            exclusions: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    const output = response.text;
    if (!output) {
      throw new Error("The AI returned an empty response.");
    }

    return JSON.parse(output.trim());
  } catch (error: any) {
    console.error("Gemini Extraction Error:", error);
    throw new Error(error.message || "Failed to parse document content.");
  }
};
