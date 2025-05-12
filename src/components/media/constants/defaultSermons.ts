
import { Sermon } from '@/types/sermonTypes';

export const defaultSermons: Sermon[] = [
  {
    id: '1',
    title: 'He\'s Power In Us',
    speaker: 'Peter Taylor',
    speakerImage: '/lovable-uploads/8c65fe13-b78a-486c-b18b-796c1ca1e52b.png',
    date: new Date('2025-03-30'),
    audioUrl: 'https://cdn.devdojo.com/episode/June2023/the-making-of-wave.mp3',
    youtubeId: 'PpSxcNgBOqM',
    description: 'A powerful sermon about the Holy Spirit living in us.',
    tags: ['Holy Spirit', 'Power', 'Christian Living'],
  },
  {
    id: '2',
    title: 'The Power of Community',
    speaker: 'Elder Sarah Smith',
    speakerImage: '/placeholder.svg',
    date: new Date('2025-03-23'),
    audioUrl: 'https://cdn.devdojo.com/episode/June2023/how-to-build-a-successful-team.mp3',
  },
  {
    id: '3',
    title: 'Walking in Faith',
    speaker: 'Pastor John Doe',
    speakerImage: '/placeholder.svg',
    date: new Date('2025-03-16'),
    audioUrl: 'https://cdn.devdojo.com/episode/May2023/wave-update-saas-starter-kit.mp3',
  },
];
