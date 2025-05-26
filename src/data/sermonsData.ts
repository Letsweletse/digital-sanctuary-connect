
import { Sermon } from '@/types/sermonTypes';
import { getSpeakerImage } from '@/components/media/utils/speakerImageUtils';

export const sermonsData: Sermon[] = [
  {
    id: '14',
    title: 'The Centrality Of The Word',
    speaker: 'Thabiso Thwane',
    speakerImage: '/lovable-uploads/e6febe02-1bbb-4eaf-97e1-9ee6e3fa12d4.png',
    date: new Date('2025-05-25'),
    youtubeId: 'jkDlHi3lWYU',
    description: 'A powerful sermon about the central importance of God\'s Word in our lives and ministry.',
    tags: ['Word of God', 'Scripture', 'Ministry', 'Christian Living'],
    thumbnailUrl: '/lovable-uploads/e6febe02-1bbb-4eaf-97e1-9ee6e3fa12d4.png',
    featured: false,
    duration: '',
    downloads: 0,
    views: 0,
    series: '',
  },
];
