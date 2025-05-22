
import { EventData, EventCategoryObject, EventCategoryType } from '@/types/eventTypes';

export const events: EventData[] = [
  {
    id: '4',
    title: 'Perspectives on the Apostolic with Thamo Naidoo',
    date: 'TBA',
    time: 'To be announced',
    location: 'Gate Gaborone Auditorium',
    description: 'Join us for our next Perspectives on the Apostolic conference with guest speaker Thamo Naidoo. Future dates will be announced soon. Stay tuned for powerful teachings, workshops, and fellowship.',
    category: 'conference',
    image: 'https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/POA_1743681812478.jpg',
    registration: true,
    registrationLink: '#register-event'
  },
  {
    id: '5',
    title: 'Apostolic Conference: Rule Your Domain',
    date: '2025-07-03',
    endDate: '2025-07-04',
    time: 'Multiple Sessions',
    location: 'Travelodge Conference Centre',
    description: 'Join us for this transformative conference as we explore apostolic principles for ruling your domain. This two-day event features powerful teaching, workshops, and fellowship opportunities.',
    category: 'conference',
    image: 'https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/images/leadership/May%2010%20Conference%20Gate%20Gaborone_1746167943667.jpeg',
    registration: true,
    registrationLink: '/conference'
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
