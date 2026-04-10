import { EventData, EventCategoryObject, EventCategoryType } from '@/types/eventTypes';

export const events: EventData[] = [
  {
    id: 'mens-gathering-apr-2026',
    title: "Men's Gathering",
    date: '2026-04-11',
    time: '09:00 AM',
    location: "Joe's Place, Notwane",
    description: "Reach. Resource. Reform. An exclusive Men's Gathering focused on leadership development and kingdom impact. Registration Fee: P200. Register via WhatsApp: +267 72 511 354.",
    category: 'fellowship',
    image: '/images/events/mens-gathering-2026.png',
    registration: true
  },
  {
    id: 'poa-feb-2026',
    title: 'Perspectives On The Apostolic with Thamo Naidoo',
    date: '2026-02-07',
    time: '09:00 - 13:30',
    location: 'Gate Gaborone Auditorium, Plot 54014, Gaborone West',
    description: 'Join us for Perspectives On The Apostolic with Thamo Naidoo, Presiding Apostolic Elder of Gate Global Family. A morning of apostolic insight and teaching. Refreshments provided. Freewill offerings received.',
    category: 'conference',
    image: '/lovable-uploads/poa-february-2026.jpg',
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
