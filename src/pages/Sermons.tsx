
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { CalendarDays, Search, MicVocal, VideoIcon, BookOpen, Filter, ChevronDown } from 'lucide-react';
import { useSermons } from '@/hooks/useSermons';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

const Sermons = () => {
  const { sermons } = useSermons();
  const [filteredSermons, setFilteredSermons] = useState(sermons);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');

  // Get all unique topics from sermons
  const allTopics = Array.from(
    new Set(sermons.flatMap(sermon => sermon.tags || []))
  );

  // Filter sermons based on search term and selected topic
  useEffect(() => {
    let result = sermons;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(sermon => 
        sermon.title.toLowerCase().includes(term) ||
        sermon.speaker.toLowerCase().includes(term) ||
        (sermon.description && sermon.description.toLowerCase().includes(term))
      );
    }
    
    // Filter by topic
    if (selectedTopic !== 'all') {
      result = result.filter(sermon => 
        sermon.tags && sermon.tags.includes(selectedTopic)
      );
    }
    
    setFilteredSermons(result);
  }, [searchTerm, selectedTopic, sermons]);

  return (
    <Layout>
      <main className="flex-grow pt-16 md:pt-24 page-transition">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-church-blue to-church-blue-dark py-16 md:py-24 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=1470&auto=format&fit=crop')] opacity-20 bg-cover bg-center"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium text-white mb-4">
                Word of God
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-serif">
                Sermons & Teachings
              </h1>
              <p className="text-lg text-white/90 max-w-2xl mx-auto font-sans">
                Dive into our collection of sermons that bring biblical truth to life. 
                Explore teachings on faith, grace, and living out God's Word in today's world.
              </p>
            </div>
          </div>
        </section>
        
        {/* Featured Sermon */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block bg-church-gold-light px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
                Featured Message
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-church-neutral-900 mb-6 font-serif">
                Latest Sunday Sermon
              </h2>
              <p className="max-w-2xl mx-auto text-church-neutral-700 font-sans">
                Watch our latest message delivered at Gate Gaborone.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto glass-panel p-2 md:p-6 shadow-xl rounded-xl overflow-hidden">
              <div className="aspect-video w-full rounded-lg overflow-hidden mb-6">
                <iframe 
                  className="w-full h-full" 
                  src="https://www.youtube.com/embed/PpSxcNgBOqM" 
                  title="He's Power In Us" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
              <div className="px-4">
                <h3 className="text-xl md:text-2xl font-bold text-church-neutral-900 mb-2 font-serif">
                  He's Power In Us
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-church-neutral-700 mb-4 font-sans">
                  <span className="flex items-center gap-1.5">
                    <MicVocal size={18} className="text-church-blue" />
                    Peter Taylor
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={18} className="text-church-blue" />
                    March 30, 2025
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Sermon Library */}
        <section id="sermon-library" className="py-16 bg-church-neutral-50/70">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block bg-church-blue-light px-3 py-1 rounded-full text-sm font-medium text-church-neutral-700 mb-4">
                Browse & Search
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-church-neutral-900 mb-6 font-serif">
                Sermon Library
              </h2>
              <p className="max-w-2xl mx-auto text-church-neutral-700 font-sans">
                Explore our complete sermon archive. Search by topic, speaker, or scripture reference to find exactly what you're looking for.
              </p>
            </div>
            
            {/* Search and Filter */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 items-stretch">
                  {/* Search bar */}
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-church-neutral-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search by title, speaker, or scripture..."
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-church-neutral-200 focus:outline-none focus:ring-2 focus:ring-church-blue focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      aria-label="Search sermons"
                    />
                  </div>
                  
                  {/* Topic filter dropdown */}
                  <div className="w-full md:w-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full md:w-auto border border-church-neutral-200 bg-white hover:bg-church-neutral-50 text-church-neutral-800">
                          <Filter className="mr-2 h-4 w-4" />
                          {selectedTopic === 'all' ? 'All Topics' : selectedTopic}
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 bg-white">
                        <DropdownMenuItem 
                          onClick={() => setSelectedTopic('all')}
                          className={cn(
                            "cursor-pointer",
                            selectedTopic === 'all' ? "bg-church-blue-light/20 text-church-blue" : ""
                          )}
                        >
                          All Topics
                        </DropdownMenuItem>
                        {allTopics.map((topic) => (
                          <DropdownMenuItem 
                            key={topic} 
                            onClick={() => setSelectedTopic(topic)}
                            className={cn(
                              "cursor-pointer",
                              selectedTopic === topic ? "bg-church-blue-light/20 text-church-blue" : ""
                            )}
                          >
                            {topic}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sermon Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSermons.length > 0 ? (
                filteredSermons.map((sermon) => (
                  <SermonCard key={sermon.id} sermon={sermon} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-church-neutral-700 font-medium">No sermons found matching your search criteria.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedTopic('all');
                    }}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
            
            {/* Call to Action */}
            <div className="mt-16 bg-white p-8 rounded-xl shadow-sm text-center max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-church-neutral-900 mb-4 font-serif">
                Subscribe for Sermon Updates
              </h3>
              <p className="text-church-neutral-700 mb-6 max-w-2xl mx-auto">
                Get notified when we publish new sermons. We'll deliver them straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-grow px-4 py-3 rounded-lg border border-church-neutral-300 focus:outline-none focus:ring-2 focus:ring-church-blue"
                  aria-label="Email subscription"
                />
                <Button 
                  className="bg-church-blue hover:bg-church-blue-dark text-white"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

// Sermon Card Component
const SermonCard = ({ sermon }) => {
  const formattedDate = format(new Date(sermon.date), 'MMMM d, yyyy');
  
  // Generate a random image if no specific sermon thumbnail is available
  const thumbnailUrl = sermon.thumbnailUrl || `https://source.unsplash.com/featured/?bible,church,${sermon.id}`;
  
  return (
    <article 
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col" 
      itemScope 
      itemType="https://schema.org/CreativeWork"
    >
      <div className="relative pb-[56.25%] bg-church-neutral-100">
        <img 
          src={thumbnailUrl} 
          alt={sermon.title} 
          className="absolute inset-0 w-full h-full object-cover"
          itemProp="image"
        />
        {sermon.tags && sermon.tags.length > 0 && (
          <div className="absolute top-3 right-3">
            <span className="bg-church-gold/90 text-church-neutral-900 px-3 py-1 text-xs font-medium rounded-full">
              {sermon.tags[0]}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-church-neutral-900 mb-2 font-serif" itemProp="name">
          {sermon.title}
        </h3>
        
        <div className="space-y-2 mb-3 text-sm text-church-neutral-700 font-sans">
          <div className="flex items-center gap-1.5">
            <MicVocal size={16} className="text-church-blue flex-shrink-0" />
            <span itemProp="author">{sermon.speaker}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <CalendarDays size={16} className="text-church-blue flex-shrink-0" />
            <span itemProp="datePublished">{formattedDate}</span>
          </div>
          
          {sermon.scripture && (
            <div className="flex items-center gap-1.5">
              <BookOpen size={16} className="text-church-blue flex-shrink-0" />
              <span itemProp="about">{sermon.scripture}</span>
            </div>
          )}
        </div>
        
        {sermon.description && (
          <p className="mt-2 text-church-neutral-700 line-clamp-2 mb-4 font-sans" itemProp="description">
            {sermon.description}
          </p>
        )}
        
        <div className="mt-auto pt-4 flex gap-2">
          {sermon.audioUrl && (
            <Button 
              variant="outline" 
              className="flex-1 gap-1 font-medium"
              asChild
            >
              <a href={sermon.audioUrl} target="_blank" rel="noopener noreferrer">
                <Headphones className="h-4 w-4" />
                Listen
              </a>
            </Button>
          )}
          
          {sermon.youtubeId && (
            <Button 
              variant="default" 
              className="flex-1 gap-1 bg-church-blue hover:bg-church-blue-dark font-medium"
              asChild
            >
              <a href={`https://www.youtube.com/watch?v=${sermon.youtubeId}`} target="_blank" rel="noopener noreferrer">
                <VideoIcon className="h-4 w-4" />
                Watch
              </a>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
};

// Helper component for audio player button
const Headphones = (props) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    </svg>
  );
};

export default Sermons;
