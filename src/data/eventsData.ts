
import { EventData, EventCategory } from '@/types/eventTypes';

export const events: EventData[] = [
  {
    id: '1',
    title: 'Sunday Worship Service',
    date: '2023-12-17',
    time: '8:30 AM & 11:00 AM',
    location: 'Main Sanctuary',
    description: 'Join us for worship, prayer, and Biblical teaching as we gather together as a church family.',
    category: 'worship',
    image: 'https://images.unsplash.com/photo-1508963493744-76fce69379c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  },
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
    registrationLink: 'https://www.gategaborone.com/event/registernow'
  },
  {
    id: '5',
    title: 'Men\'s Breakfast',
    date: '2023-12-09',
    time: '8:00 AM',
    location: 'Fellowship Hall',
    description: 'Monthly gathering for men of all ages. Enjoy breakfast, fellowship, and a short devotional.',
    category: 'fellowship',
    image: 'https://images.unsplash.com/photo-1542641728-6ca359b085f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
  }
];

export const categories: EventCategory[] = [
  { id: 'all', name: 'All Events' },
  { id: 'worship', name: 'Worship Services' },
  { id: 'bible-study', name: 'Bible Studies' },
  { id: 'fellowship', name: 'Fellowship' },
  { id: 'outreach', name: 'Outreach' },
  { id: 'youth', name: 'Youth' },
  { id: 'children', name: 'Children' },
  { id: 'conference', name: 'Conferences' }
];
