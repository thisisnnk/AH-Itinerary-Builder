
export type ItineraryStatus = 'Converted' | 'Quote Sent' | 'Lost';

export interface Consultant {
  name: string;
  contact: string;
}

export interface CustomField {
  id: string;
  heading: string;
  value: string;
}

export interface TripSummary {
  consultant: Consultant;
  quotationDate: string;
  reference: string;
  leadTraveler: string;
  groupSize: number;
  travelDate: string;
  purpose: string;
  duration: string;
  destinations: string[];
  transport: string;
  costWithFood: string;
  costWithoutFood: string;
  hasNoFoodCost: boolean;
}

export interface ItineraryDay {
  day: number;
  date?: string;
  title: string;
  activities: string[];
  keywords?: string;
  images?: string[];
  isDisabled?: boolean;
}

export interface DayTemplate {
  id: string;
  keyword: string;
  title: string;
  activities: string[];
}

export interface BankDetails {
  accountName: string;
  bank: string;
  accountNumber: string;
  ifsc: string;
}

export interface ItineraryData {
  id: string;
  quotationNumber: string;
  status: ItineraryStatus;
  tripSummary: TripSummary;
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  notes: string[];
  termsAndConditions: string[];
  cancellationPolicy: string[];
  bankDetails: BankDetails;
  showDayZero: boolean;
  customFields: CustomField[];
}

export type AppView = 'dashboard' | 'editor' | 'preview' | 'keywords';
export type FormStep = 'summary' | 'itinerary' | 'details' | 'policies';
