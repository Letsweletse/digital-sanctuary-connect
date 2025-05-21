
import { Subscriber } from '@/types/subscriberTypes';

export const subscriberGroups = [
  'Newsletter',
  'Events',
  'Prayer',
  'Featured Conference',
  'Sermon Updates',
  'Perspective On The Apostolic'
];

export const subscribersData: Subscriber[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    source: 'Featured Conference Registration',
    subscribeDate: new Date('2025-04-15'),
    groups: ['Featured Conference', 'Events'],
    lastContactDate: new Date('2025-04-20')
  },
  {
    id: '2',
    email: 'sarah.smith@example.com',
    firstName: 'Sarah',
    lastName: 'Smith',
    source: 'Website Signup',
    subscribeDate: new Date('2025-03-10'),
    groups: ['Newsletter', 'Prayer'],
    lastContactDate: new Date('2025-04-01')
  },
  {
    id: '3',
    email: 'michael.johnson@example.com',
    firstName: 'Michael',
    lastName: 'Johnson',
    source: 'Featured Conference Registration',
    subscribeDate: new Date('2025-04-12'),
    groups: ['Featured Conference', 'Sermon Updates'],
    lastContactDate: new Date('2025-04-18')
  },
  {
    id: '4',
    email: 'emily.brown@example.com',
    firstName: 'Emily',
    lastName: 'Brown',
    source: 'Featured Conference Registration',
    subscribeDate: new Date('2025-04-14'),
    groups: ['Featured Conference', 'Events', 'Prayer'],
    lastContactDate: new Date('2025-04-21')
  },
  {
    id: '5',
    email: 'david.wilson@example.com',
    firstName: 'David',
    lastName: 'Wilson',
    source: 'Contact Form',
    subscribeDate: new Date('2025-02-25'),
    groups: ['Newsletter'],
    lastContactDate: new Date('2025-03-15')
  },
  {
    id: '6',
    email: 'rachel.garcia@example.com',
    firstName: 'Rachel',
    lastName: 'Garcia',
    source: 'Featured Conference Registration',
    subscribeDate: new Date('2025-04-16'),
    groups: ['Featured Conference', 'Sermon Updates'],
  },
  {
    id: '7',
    email: 'pastor.james@churchemail.com',
    firstName: 'James',
    lastName: 'Miller',
    source: 'Featured Conference Registration',
    subscribeDate: new Date('2025-04-10'),
    groups: ['Featured Conference', 'Prayer'],
    lastContactDate: new Date('2025-04-19')
  },
  {
    id: '8',
    email: 'maria.rodriguez@example.com',
    firstName: 'Maria',
    lastName: 'Rodriguez',
    source: 'Featured Conference Registration',
    subscribeDate: new Date('2025-04-13'),
    groups: ['Featured Conference', 'Events'],
  },
  {
    id: '9',
    email: 'thomas.johnson@example.com',
    firstName: 'Thomas',
    lastName: 'Johnson',
    source: 'Perspective On The Apostolic Registration',
    subscribeDate: new Date('2025-03-25'),
    groups: ['Perspective On The Apostolic'],
    lastContactDate: new Date('2025-03-28')
  },
  {
    id: '10',
    email: 'grace.smith@example.com',
    firstName: 'Grace',
    lastName: 'Smith',
    source: 'Perspective On The Apostolic Registration',
    subscribeDate: new Date('2025-03-24'),
    groups: ['Perspective On The Apostolic', 'Prayer'],
    lastContactDate: new Date('2025-03-27')
  },
  {
    id: '11',
    email: 'daniel.brown@example.com',
    firstName: 'Daniel',
    lastName: 'Brown',
    source: 'Perspective On The Apostolic Registration',
    subscribeDate: new Date('2025-03-22'),
    groups: ['Perspective On The Apostolic'],
    lastContactDate: new Date('2025-03-26')
  },
  {
    id: '12',
    email: 'olivia.williams@example.com',
    firstName: 'Olivia',
    lastName: 'Williams',
    source: 'Perspective On The Apostolic Registration',
    subscribeDate: new Date('2025-03-21'),
    groups: ['Perspective On The Apostolic', 'Newsletter'],
    lastContactDate: new Date('2025-03-25')
  },
  {
    id: '13',
    email: 'samuel.davis@example.com',
    firstName: 'Samuel',
    lastName: 'Davis',
    source: 'Perspective On The Apostolic Registration',
    subscribeDate: new Date('2025-03-20'),
    groups: ['Perspective On The Apostolic', 'Sermon Updates'],
    lastContactDate: new Date('2025-03-24')
  }
];
