
import { Subscriber, SubscriberFilter } from '@/types/subscriberTypes';

export const getFilteredSubscribers = (subscribers: Subscriber[], filter: SubscriberFilter): Subscriber[] => {
  switch(filter) {
    case 'conference':
      return subscribers.filter(s => s.groups?.includes('Featured Conference'));
    case 'newsletter':
      return subscribers.filter(s => s.groups?.includes('Newsletter'));
    case 'events':
      return subscribers.filter(s => s.groups?.includes('Events'));
    case 'apostolic':
      return subscribers.filter(s => s.groups?.includes('Perspective On The Apostolic'));
    case 'all':
    default:
      return subscribers;
  }
};
