
import { useState, useEffect } from 'react';
import { Sermon } from '@/types/sermonTypes';

export const useSermons = () => {
  const [sermons, setSermons] = useState<Sermon[]>([
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
      featured: true,
    },
    {
      id: '2',
      title: 'The Power of Community',
      speaker: 'Elder Sarah Smith',
      speakerImage: '/placeholder.svg',
      date: new Date('2025-03-23'),
      audioUrl: 'https://cdn.devdojo.com/episode/June2023/how-to-build-a-successful-team.mp3',
      tags: ['Community', 'Fellowship', 'Church'],
    },
    {
      id: '3',
      title: 'Walking in Faith',
      speaker: 'Pastor John Doe',
      speakerImage: '/placeholder.svg',
      date: new Date('2025-03-16'),
      audioUrl: 'https://cdn.devdojo.com/episode/May2023/wave-update-saas-starter-kit.mp3',
      tags: ['Faith', 'Trust', 'Christian Living'],
    },
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In a real application, you would fetch sermons from a server/database
  const fetchSermons = async () => {
    try {
      setLoading(true);
      // Simulating API call
      // const response = await fetch('/api/sermons');
      // const data = await response.json();
      // setSermons(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load sermons.');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Uncomment this when you have a real API
    // fetchSermons();
  }, []);

  // Add a new sermon
  const addSermon = (sermon: Omit<Sermon, 'id'>) => {
    const newSermon: Sermon = {
      ...sermon,
      id: Date.now().toString(),
    };
    setSermons(prev => [newSermon, ...prev]);
    return newSermon;
  };

  // Update a sermon
  const updateSermon = (id: string, updatedSermon: Partial<Sermon>) => {
    setSermons(prev => 
      prev.map(sermon => 
        sermon.id === id ? { ...sermon, ...updatedSermon } : sermon
      )
    );
  };

  // Delete a sermon
  const deleteSermon = (id: string) => {
    setSermons(prev => prev.filter(sermon => sermon.id !== id));
  };

  // Get a featured sermon
  const getFeaturedSermon = (): Sermon | undefined => {
    return sermons.find(sermon => sermon.featured);
  };

  return {
    sermons,
    loading,
    error,
    addSermon,
    updateSermon,
    deleteSermon,
    getFeaturedSermon,
  };
};
