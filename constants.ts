
import { ItineraryData, DayTemplate } from './types';

export const DEFAULT_TC = [
  "Package confirmation will only be upon half of the payment and the balance before 72 Hours of Departure.",
  "The Accommodation, Vehicle, Tour Organizer allotments will be done thereafter.",
  "Hotels are Subject to Availability.",
  "Natural Calamities, Road Traffic, Public Crowd, Sightseeing Walk is mandatory.",
  "A Detailed PPT Presentation will be done before 72 hours before the tour date.",
  "The Co-operation of all the Tourists are merely important as traffic delays, some long Walks are unavoidable in a trip.",
  "The Tourists should Co-operate the organizers in the timings allotted for all sightseeing places, which in delay will end in the forthcoming place which was planned to visit.",
  "The Internal/External belongings of the Tourists should be taken care by themselves whereas the Organizers or the Management or the Chauffer is not responsible for the same.",
  "The Prices given above has a validity of 48 hours from the date of quote provided. Please contact the undersigned before making payment without fail.",
  "The payments made without intimation will be on hold.",
  "Account Details will be sent as per Request.",
  "Changes in tour must be before 30 days of the tour.",
  "If so 5% of the package cost will be deducted."
];

export const DEFAULT_CANCELLATION = [
  "45 days prior to Tour: 10% of the Tour package.",
  "15 days prior to Tour: 25% of the Tour Package.",
  "07 days prior to Tour: 50% of the Tour Package.",
  "72 hours prior to Tour OR No Show: No Refund."
];

export const MOCK_TEMPLATES: DayTemplate[] = [
  { id: '1', keyword: 'Munnar1Day', title: 'Munnar Arrival & Sightseeing', activities: ['Arrival at Kochi', 'Transfer to Munnar', 'Cheeyappara Waterfalls', 'Tea Museum visit'] },
  { id: '2', keyword: 'Ooty1Day', title: 'Ooty Local Sightseeing', activities: ['Botanical Garden', 'Rose Garden', 'Ooty Lake', 'Doddabetta Peak'] },
  { id: '3', keyword: 'Mysore1Day', title: 'Royal Mysore Experience', activities: ['Mysore Palace', 'Chamundi Hills', 'St. Philomena\'s Church', 'Brindavan Gardens'] },
  ...Array.from({ length: 47 }).map((_, i) => ({
    id: `mock-${i}`,
    keyword: `Template${i + 4}`,
    title: `Day Plan Template ${i + 4}`,
    activities: ['Activity 1', 'Activity 2', 'Activity 3']
  }))
];

export const INITIAL_ITINERARY_DATA = (id: string = ''): ItineraryData => ({
  id: id || Math.random().toString(36).substr(2, 9),
  quotationNumber: 'AH26-DOM-FIT-001',
  status: 'Quote Sent',
  tripSummary: {
    consultant: { name: 'Siva', contact: '+91 70109 33178' },
    quotationDate: new Date().toISOString().split('T')[0],
    reference: '',
    leadTraveler: '',
    groupSize: 1,
    travelDate: '',
    purpose: '',
    duration: '2N/3D',
    destinations: [],
    transport: 'Private Vehicle',
    costWithFood: '',
    costWithFoodLabel: 'Inclusive of all meals',
    costWithoutFood: '',
    costWithoutFoodLabel: 'Room & breakfast only',
    costUnit: 'Per Pax',
    hasNoFoodCost: true
  },
  itinerary: [
    { day: 0, title: 'Pre-Arrival Notes', activities: [], images: [], isDisabled: true },
    { day: 1, title: 'Arrival & Welcome', activities: ['Check-in and relaxation'], images: [] }
  ],
  inclusions: ['Private Vehicle', 'Driver Allowance', 'Parking & Toll', 'Accommodation'],
  exclusions: ['GST 5%', 'Personal Expenses', 'Airfare / Train fare'],
  notes: [],
  termsAndConditions: DEFAULT_TC,
  cancellationPolicy: DEFAULT_CANCELLATION,
  bankDetails: {
    accountName: 'Adventure Holidays',
    bank: 'Yes Bank, Gandhipuram, Coimbatore',
    accountNumber: '135261900002320',
    ifsc: 'YESB0001352'
  },
  showDayZero: false,
  customFields: []
});

export const MOCK_ITINERARIES = (): ItineraryData[] => {
  const categories = ['DOM', 'INTL'];
  const types = ['FIT', 'SCH', 'CLG', 'COR', 'CPL', 'GD'];
  const clients = ['Arun Kumar', 'Deepak S', 'Meera V', 'Rajesh K', 'Sowmya R'];
  
  return Array.from({ length: 25 }).map((_, i) => {
    const cat = categories[i % 2];
    const type = types[i % 6];
    const itin = INITIAL_ITINERARY_DATA(`mock-itin-${i}`);
    itin.quotationNumber = `AH26-${cat}-${type}-${String(i + 1).padStart(3, '0')}`;
    itin.tripSummary.leadTraveler = clients[i % clients.length];
    itin.tripSummary.destinations = ['Munnar', 'Thekkady', 'Alleppey'];
    itin.tripSummary.duration = '3N/4D';
    itin.tripSummary.groupSize = (i % 4) + 2;
    return itin;
  });
};
