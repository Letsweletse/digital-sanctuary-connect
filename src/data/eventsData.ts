import { EventData, EventCategoryObject, EventCategoryType } from '@/types/eventTypes';

const poaFlyer = { url: '/images/events/poa-august-2026.jpeg' };

export const events: EventData[] = [
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
