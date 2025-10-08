
import { EventData, EventCategoryObject, EventCategoryType } from '@/types/eventTypes';

export const events: EventData[] = [
  {
    id: '6',
    title: 'Apostolic Conference: November 2025',
    date: '2025-11-01',
    time: 'Conference schedule and details to be announced',
    location: 'Venue to be announced',
    description: 'Join us for our upcoming apostolic conference. More details about the schedule, speakers, and sessions will be announced soon. Free registration is now open!',
    category: 'conference',
    image: '/lovable-uploads/c7d7d70a-edce-451c-83fd-da92f8e07431.png',
    registration: true,
    registrationLink: '#register-event'
  },
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
    endDate: '2025-07-05',
    time: '• Thursday Evening: Session 1 (18:00–20:30)\n• Friday Morning: Sessions 2–4 (08:30–13:30)\n• Friday Evening: Session 5 (18:00–20:30)\n• Saturday Morning: Sessions 6–8 (08:30–13:30)',
    location: 'Travelodge Conference Centre',
    description: 'Join us for this transformative conference as we explore apostolic principles for ruling your domain. This three-day event features powerful teaching, workshops, and fellowship opportunities.',
    category: 'conference',
    image: '/lovable-uploads/6f1ed145-0434-4105-81e3-81bed7ee143a.png',
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
