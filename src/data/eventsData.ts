
import { EventData, EventCategoryObject, EventCategoryType } from '@/types/eventTypes';

export const events: EventData[] = [
  {
    id: '6',
    title: 'Perspectives on the Apostolic',
    date: '2025-11-01',
    time: '09:00 - 13:30',
    location: 'Gate Gaborone, Plot 54014, Gaborone West',
    description: 'Join us for Perspectives on the Apostolic with Thamo Naidoo, Presiding Apostolic Elder of Gate Global Family. Registration is compulsory. Refreshments provided, freewill offerings received.',
    category: 'conference',
    image: '/lovable-uploads/poa-november-2025.jpeg',
    registration: true,
    registrationLink: '#register-event'
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
