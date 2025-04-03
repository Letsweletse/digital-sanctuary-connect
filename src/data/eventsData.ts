
import { EventData, EventCategory } from '@/types/eventTypes';

export const events: EventData[] = [
  {
    id: '1',
    title: 'Sunday Worship Service',
    date: '2023-12-17',
    time: '9:00 AM & 11:00 AM',
    location: 'Main Sanctuary',
    description: 'Join us for worship, prayer, and Biblical teaching as we gather together as a church family.',
    category: 'worship',
    image: 'https://images.unsplash.com/photo-1508963493744-76fce69379c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  },
  {
    id: '2',
    title: 'Youth Group Night',
    date: '2023-12-15',
    time: '6:30 PM',
    location: 'Youth Center',
    description: 'A fun evening for teenagers with games, worship, and small group discussions about faith and life.',
    category: 'youth',
    image: 'https://images.unsplash.com/photo-1529333166437-7feb29c65e8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80'
  },
  {
    id: '3',
    title: 'Bible Study: Book of Romans',
    date: '2023-12-13',
    time: '7:00 PM',
    location: 'Fellowship Hall',
    description: 'An in-depth study of the Book of Romans led by Pastor John. All are welcome, bring your Bible!',
    category: 'bible-study',
    image: 'https://images.unsplash.com/photo-1612460424642-318229cf9a3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1933&q=80'
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
    registration: true
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
  },
  {
    id: '6',
    title: 'Christmas Eve Candlelight Service',
    date: '2023-12-24',
    time: '6:00 PM & 8:00 PM',
    location: 'Main Sanctuary',
    description: 'A beautiful tradition of carols, Scripture readings, and candlelight to celebrate the birth of Christ.',
    category: 'worship',
    image: 'https://images.unsplash.com/photo-1512130320987-194af7f7fcbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80'
  },
  {
    id: '7',
    title: 'Women\'s Bible Study',
    date: '2023-12-12',
    time: '9:30 AM',
    location: 'Room 201',
    description: 'Weekly women\'s Bible study focusing on the Psalms. Childcare provided for children under 5.',
    category: 'bible-study',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
  },
  {
    id: '8',
    title: 'Children\'s Christmas Program',
    date: '2023-12-17',
    time: '4:00 PM',
    location: 'Main Sanctuary',
    description: 'Our children\'s ministry presents "The First Christmas," a delightful retelling of the nativity story.',
    category: 'children',
    image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
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
