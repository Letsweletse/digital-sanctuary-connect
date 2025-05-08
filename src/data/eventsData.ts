
import { EventData, EventCategoryObject, EventCategoryType } from '@/types/eventTypes';

export const events: EventData[] = [
  {
    id: '4',
    title: 'Perspectives on the Apostolic with Thamo Naidoo',
    date: '2025-05-10',
    time: '9:00 AM - 13:30 PM',
    location: 'Gate Gaborone Auditorium',
    description: 'A special conference exploring apostolic ministry in the modern church with guest speaker Thamo Naidoo. Join us for powerful teachings, workshops, and fellowship.',
    category: 'conference',
    image: 'https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/POA_1743681812478.jpg',
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
