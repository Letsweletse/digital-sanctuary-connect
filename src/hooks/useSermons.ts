
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
      description: 'A powerful sermon about the Holy Spirit living in us and empowering us for ministry and life.',
      tags: ['Holy Spirit', 'Power', 'Christian Living'],
      scripture: 'Acts 1:8',
      thumbnailUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      featured: true,
    },
    {
      id: '2',
      title: 'The Power of Community',
      speaker: 'Elder Sarah Smith',
      speakerImage: '/placeholder.svg',
      date: new Date('2025-03-23'),
      audioUrl: 'https://cdn.devdojo.com/episode/June2023/how-to-build-a-successful-team.mp3',
      description: 'Understanding the biblical principles of community and how we grow stronger together.',
      tags: ['Community', 'Fellowship', 'Church'],
      scripture: 'Hebrews 10:24-25',
      thumbnailUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    },
    {
      id: '3',
      title: 'Walking in Faith',
      speaker: 'Pastor John Doe',
      speakerImage: '/placeholder.svg',
      date: new Date('2025-03-16'),
      audioUrl: 'https://cdn.devdojo.com/episode/May2023/wave-update-saas-starter-kit.mp3',
      description: 'Learning to trust God even when we cannot see the path ahead clearly.',
      tags: ['Faith', 'Trust', 'Christian Living'],
      scripture: '2 Corinthians 5:7',
      thumbnailUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    },
    {
      id: '4',
      title: 'Grace That Transforms',
      speaker: 'Elder Sarah Smith',
      speakerImage: '/placeholder.svg',
      date: new Date('2025-03-09'),
      audioUrl: 'https://cdn.devdojo.com/episode/May2023/wave-update-saas-starter-kit.mp3',
      youtubeId: 'dQw4w9WgXcQ',
      description: 'Exploring how God\'s grace doesn\'t just save us but transforms every aspect of our lives.',
      tags: ['Grace', 'Salvation', 'Transformation'],
      scripture: 'Ephesians 2:8-10',
      thumbnailUrl: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    },
    {
      id: '5',
      title: 'The Heart of Worship',
      speaker: 'Pastor John Doe',
      speakerImage: '/placeholder.svg',
      date: new Date('2025-03-02'),
      audioUrl: 'https://cdn.devdojo.com/episode/May2023/wave-update-saas-starter-kit.mp3',
      description: 'What does it mean to truly worship God with our whole heart, mind, and strength?',
      tags: ['Worship', 'Devotion', 'Spiritual Growth'],
      scripture: 'John 4:23-24',
      thumbnailUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    },
    {
      id: '6',
      title: 'Overcoming Adversity',
      speaker: 'Elder Mark Johnson',
      speakerImage: '/placeholder.svg',
      date: new Date('2025-02-23'),
      audioUrl: 'https://cdn.devdojo.com/episode/May2023/wave-update-saas-starter-kit.mp3',
      youtubeId: 'dQw4w9WgXcQ',
      description: 'Finding God\'s strength in times of trial and difficulty, and emerging stronger in faith.',
      tags: ['Trials', 'Perseverance', 'Victory'],
      scripture: 'James 1:2-4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1508963493744-76fce69379c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
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
