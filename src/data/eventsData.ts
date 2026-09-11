import { EventData, EventCategoryObject, EventCategoryType } from '@/types/eventTypes';

const poaFlyer = { url: '/images/events/poa-august-2026.jpeg' };

export const events: EventData[] = [
  {
    id: 'couples-picnic-2026',
    title: 'Couples Picnic',
    date: '2026-09-19',
    time: '09:30 (arrival) - 10:00 (start)',
    location: "Ditlhareng Estate Gabane (Taylor's Place)",
    description: "Join us for a Couples Picnic. Registration Fee: P60 per couple. Bring: pen, notebook, picnic basket for two, picnic blanket or chairs. Picnic lunch ideas: ready cooked meat/chicken/sausage (no braai fires), finger foods (sliced fruits or vegetables), sandwiches, cold drinks. Tea, coffee and water will be provided. WhatsApp: +267 72171066.",
    category: 'fellowship',
    image: '/images/events/couples-picnic-2026.jpeg',
    registration: true
  },
  {
    id: 'poa-august-2026',
    title: 'Perspectives On The Apostolic with Thamo Naidoo',
    date: '2026-10-24',
    time: '09:00 - 13:30',
    location: 'Gate Gaborone, Plot 54014, Gaborone West',
    description: 'Join us for Perspectives On The Apostolic with Thamo Naidoo, Presiding Apostolic Elder of Gate Global Family. Reach • Resource • Reform. Registration is compulsory. Contact: otenggate@gmail.com or +267 75507981. Refreshments provided. Freewill offerings received.',
    category: 'conference',
    image: poaFlyer.url,
    registration: true
  }
];

export const categories: EventCategoryObject[] = [
  { id: 'all', name: 'All Events' },
  { id: 'worship', name: 'Worship Services' },
  { id: 'bible-study', name: 'Bible Studies' },
  { id: 'fellowship', name: 'Fellowship' },
  { id: 'outreach', name: 'Outreach' },
  { id: 'youth', name: 'Youth' },
  { id: 'children', name: 'Children' },
  { id: 'conference', name: 'Conferences' }
];
