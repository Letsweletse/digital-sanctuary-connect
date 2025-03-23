
import React, { useState } from 'react';

interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  audioUrl: string;
  topics: string[];
}

const SermonGrid = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample sermon data
  const sermons: Sermon[] = [
    {
      id: '1',
      title: 'Finding Peace in Troubled Times',
      speaker: 'Pastor John Doe',
      date: '2023-12-10',
      description: 'How to maintain your faith and find God\'s peace even in the midst of life\'s storms and challenges.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      audioUrl: '#',
      topics: ['Faith', 'Peace', 'Challenges']
    },
    {
      id: '2',
      title: 'The Power of Community',
      speaker: 'Elder Sarah Smith',
      date: '2023-12-03',
      description: 'Exploring how we grow stronger in our faith when we connect with others and build meaningful relationships.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      audioUrl: '#',
      topics: ['Community', 'Relationships', 'Growth']
    },
    {
      id: '3',
      title: 'Walking in Faith',
      speaker: 'Pastor John Doe',
      date: '2023-11-26',
      description: 'Understanding what it means to truly walk by faith and not by sight in our daily lives.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      audioUrl: '#',
      topics: ['Faith', 'Trust', 'Guidance']
    },
    {
      id: '4',
      title: 'The Grace of Giving',
      speaker: 'Elder Mark Johnson',
      date: '2023-11-19',
      description: 'Exploring the biblical principles of generosity and how giving shapes our hearts and communities.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      audioUrl: '#',
      topics: ['Giving', 'Generosity', 'Stewardship']
    },
    {
      id: '5',
      title: 'Renewing Your Mind',
      speaker: 'Pastor John Doe',
      date: '2023-11-12',
      description: 'How to transform your thinking and align your mind with God\'s truth for a more fulfilling life.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      audioUrl: '#',
      topics: ['Mind', 'Transformation', 'Truth']
    },
    {
      id: '6',
      title: 'The Heart of Worship',
      speaker: 'Elder Rachel Thompson',
      date: '2023-11-05',
      description: 'Discovering what true worship means beyond just music and how it transforms our relationship with God.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1508963493744-76fce69379c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      audioUrl: '#',
      topics: ['Worship', 'Relationship', 'Devotion']
    }
  ];
  
  // Get unique speakers for filter
  const speakers = [...new Set(sermons.map(sermon => sermon.speaker))];
  
  // Get unique topics for filter
  const topics = [...new Set(sermons.flatMap(sermon => sermon.topics))];
  
  // Filter sermons based on active filter and search term
  const filteredSermons = sermons.filter(sermon => {
    // Filter by speaker or topic
    const matchesFilter = activeFilter === 'all' || 
                          sermon.speaker === activeFilter || 
                          sermon.topics.includes(activeFilter);
    
    // Filter by search term
    const matchesSearch = sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         sermon.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <div>
      {/* Filters and Search */}
      <div className="mb-10 space-y-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search sermons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-church-neutral-300 focus:outline-none focus:ring-2 focus:ring-church-blue"
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-church-neutral-500" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'all' 
                ? 'bg-church-blue text-church-neutral-800' 
                : 'bg-church-neutral-100 text-church-neutral-700 hover:bg-church-neutral-200'
            }`}
            onClick={() => setActiveFilter('all')}
          >
            All Sermons
          </button>
          
          <div className="h-6 border-r border-church-neutral-300 mx-1"></div>
          
          {/* Speaker filters */}
          {speakers.map(speaker => (
            <button
              key={speaker}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === speaker 
                  ? 'bg-church-blue text-church-neutral-800' 
                  : 'bg-church-neutral-100 text-church-neutral-700 hover:bg-church-neutral-200'
              }`}
              onClick={() => setActiveFilter(speaker)}
            >
              {speaker}
            </button>
          ))}
          
          <div className="h-6 border-r border-church-neutral-300 mx-1"></div>
          
          {/* Topic filters */}
          {topics.map(topic => (
            <button
              key={topic}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === topic 
                  ? 'bg-church-blue text-church-neutral-800' 
                  : 'bg-church-neutral-100 text-church-neutral-700 hover:bg-church-neutral-200'
              }`}
              onClick={() => setActiveFilter(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
      
      {/* Sermons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSermons.map(sermon => (
          <div key={sermon.id} className="glass-panel overflow-hidden flex flex-col h-full transition-transform duration-300 hover:scale-[1.02]">
            <div className="relative pb-[56.25%]">
              <img 
                src={sermon.thumbnailUrl} 
                alt={sermon.title}
                className="absolute top-0 left-0 w-full h-full object-cover rounded-t-xl"
              />
              <div className="absolute top-3 right-3 bg-church-gold/90 text-church-neutral-900 px-3 py-1 text-xs font-medium rounded-full">
                {formatDate(sermon.date)}
              </div>
              <a 
                href={sermon.videoUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-8 w-8 text-church-neutral-900" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
              </a>
            </div>
            
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-church-neutral-900 mb-2">
                  {sermon.title}
                </h3>
                <p className="text-sm text-church-neutral-600 mb-3">
                  {sermon.speaker}
                </p>
                <p className="text-church-neutral-700 mb-4">
                  {sermon.description}
                </p>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {sermon.topics.map(topic => (
                  <span key={topic} className="bg-church-blue-light text-church-neutral-700 px-2 py-1 text-xs rounded-full">
                    {topic}
                  </span>
                ))}
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <a 
                  href={sermon.videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-church-neutral-800 hover:text-church-gold flex items-center gap-1 text-sm font-medium"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  Watch
                </a>
                
                <a 
                  href={sermon.audioUrl} 
                  className="text-church-neutral-800 hover:text-church-gold flex items-center gap-1 text-sm font-medium"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                    <line x1="6" y1="1" x2="6" y2="4"></line>
                    <line x1="10" y1="1" x2="10" y2="4"></line>
                    <line x1="14" y1="1" x2="14" y2="4"></line>
                  </svg>
                  Listen
                </a>
                
                <a 
                  href="#" 
                  className="text-church-neutral-800 hover:text-church-gold flex items-center gap-1 text-sm font-medium"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Subscribe Section */}
      <div className="mt-16 glass-panel p-8 bg-church-gold-light/70">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-church-neutral-900 mb-4">
            Subscribe for Sermon Updates
          </h3>
          <p className="text-church-neutral-700 mb-6 max-w-2xl mx-auto">
            Get notified whenever we publish new sermons. We'll send you updates straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 rounded-lg border border-church-neutral-300 focus:outline-none focus:ring-2 focus:ring-church-blue"
            />
            <button className="btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SermonGrid;
