
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
      duration: '42:15',
      downloads: 128,
      views: 356,
      series: 'Power Series'
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
      duration: '37:50',
      downloads: 86,
      views: 210,
      series: 'Church Life'
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
      duration: '45:10',
      downloads: 112,
      views: 289,
      series: 'Faith Journeys'
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
      duration: '39:25',
      downloads: 98,
      views: 245,
      series: 'Transformation'
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
      duration: '33:45',
      downloads: 76,
      views: 198,
      series: 'Worship Series'
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
      duration: '41:30',
      downloads: 104,
      views: 267,
      series: 'Overcoming Series'
    },
    {
      id: '7',
      title: 'The Kingdom of God',
      speaker: 'Pastor John Doe',
      speakerImage: '/placeholder.svg',
      date: new Date('2025-02-16'),
      audioUrl: 'https://cdn.devdojo.com/episode/May2023/wave-update-saas-starter-kit.mp3',
      description: 'Understanding what Jesus meant when he proclaimed the kingdom of God is at hand.',
      tags: ['Kingdom', 'Gospel', 'Discipleship'],
      scripture: 'Mark 1:14-15',
      thumbnailUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      duration: '44:15',
      downloads: 92,
      views: 231,
      series: 'Kingdom Series'
    },
    {
      id: '8',
      title: 'The Call to Holiness',
      speaker: 'Elder Sarah Smith',
      speakerImage: '/placeholder.svg',
      date: new Date('2025-02-09'),
      audioUrl: 'https://cdn.devdojo.com/episode/May2023/wave-update-saas-starter-kit.mp3',
      description: 'What does it mean to be holy as God is holy, and how does it transform our daily lives?',
      tags: ['Holiness', 'Sanctification', 'Christian Living'],
      scripture: '1 Peter 1:15-16',
      thumbnailUrl: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      duration: '38:20',
      downloads: 83,
      views: 204,
      series: 'Holiness Series'
    },
    {
      id: '9',
      title: 'The Great Commission',
      speaker: 'Elder Mark Johnson',
      speakerImage: '/placeholder.svg',
      date: new Date('2025-02-02'),
      audioUrl: 'https://cdn.devdojo.com/episode/May2023/wave-update-saas-starter-kit.mp3',
      youtubeId: 'dQw4w9WgXcQ',
      description: 'Examining our call to make disciples of all nations and what it means for us today.',
      tags: ['Missions', 'Evangelism', 'Discipleship'],
      scripture: 'Matthew 28:18-20',
      thumbnailUrl: 'https://images.unsplash.com/photo-1464014067446-04e33644d719?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      duration: '40:05',
      downloads: 115,
      views: 278,
      series: 'Mission Series'
    },
    {
      id: '10',
      title: 'Spiritual Warfare',
      speaker: 'Pastor John Doe',
      speakerImage: '/placeholder.svg',
      date: new Date('2025-01-26'),
      audioUrl: 'https://cdn.devdojo.com/episode/May2023/wave-update-saas-starter-kit.mp3',
      description: 'Understanding the reality of spiritual warfare and how to stand firm in Christ.',
      tags: ['Spiritual Warfare', 'Armor of God', 'Victory'],
      scripture: 'Ephesians 6:10-18',
      thumbnailUrl: 'https://images.unsplash.com/photo-1534531173927-aeb928d54385?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      duration: '46:30',
      downloads: 127,
      views: 315,
      series: 'Spiritual Warfare'
    }
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
