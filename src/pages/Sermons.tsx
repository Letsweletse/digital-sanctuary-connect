
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { 
  Search, Filter, Calendar, Clock, User, BookOpen, 
  Download, Play, ChevronDown, ChevronRight, Eye, Tag
} from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Sermons = () => {
  const { sermons } = useSermons();
  const [filteredSermons, setFilteredSermons] = useState(sermons);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedSpeaker, setSelectedSpeaker] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [activeView, setActiveView] = useState('list');

  // Get all unique topics from sermons
  const allTopics = Array.from(
    new Set(sermons.flatMap(sermon => sermon.tags || []))
  );

  // Get all unique speakers
  const allSpeakers = Array.from(
    new Set(sermons.map(sermon => sermon.speaker))
  );

  // Get all unique years
  const allYears = Array.from(
    new Set(sermons.map(sermon => new Date(sermon.date).getFullYear().toString()))
  ).sort((a, b) => b.localeCompare(a)); // Sort descending

  // Filter sermons based on search term and selected filters
  useEffect(() => {
    let result = sermons;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(sermon => 
        sermon.title.toLowerCase().includes(term) ||
        sermon.speaker.toLowerCase().includes(term) ||
        (sermon.description && sermon.description.toLowerCase().includes(term)) ||
        (sermon.scripture && sermon.scripture.toLowerCase().includes(term))
      );
    }
    
    // Filter by topic
    if (selectedTopic !== 'all') {
      result = result.filter(sermon => 
        sermon.tags && sermon.tags.includes(selectedTopic)
      );
    }
    
    // Filter by speaker
    if (selectedSpeaker !== 'all') {
      result = result.filter(sermon => 
        sermon.speaker === selectedSpeaker
      );
    }
    
    // Filter by year
    if (selectedYear !== 'all') {
      result = result.filter(sermon => 
        new Date(sermon.date).getFullYear().toString() === selectedYear
      );
    }
    
    setFilteredSermons(result);
  }, [searchTerm, selectedTopic, selectedSpeaker, selectedYear, sermons]);

  return (
    <Layout>
      <main className="flex-grow py-10 md:py-16 bg-white page-transition">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="max-w-4xl mx-auto mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-church-neutral-900 mb-4 font-serif text-center">
              Sermon Library
            </h1>
            <p className="text-lg text-church-neutral-700 text-center mb-8 max-w-2xl mx-auto">
              Browse our collection of sermons that bring biblical truth to life. 
              Search by speaker, topic, or scripture reference.
            </p>
            
            {/* Search & Filters */}
            <div className="bg-church-neutral-50 p-4 md:p-6 rounded-lg mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-church-neutral-500 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search by title, speaker, scripture..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Tag className="mr-2 h-4 w-4" />
                        Topic
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem 
                        onClick={() => setSelectedTopic('all')}
                        className={selectedTopic === 'all' ? "bg-church-blue-light/20" : ""}
                      >
                        All Topics
                      </DropdownMenuItem>
                      {allTopics.map((topic) => (
                        <DropdownMenuItem 
                          key={topic} 
                          onClick={() => setSelectedTopic(topic)}
                          className={selectedTopic === topic ? "bg-church-blue-light/20" : ""}
                        >
                          {topic}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <User className="mr-2 h-4 w-4" />
                        Speaker
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem 
                        onClick={() => setSelectedSpeaker('all')}
                        className={selectedSpeaker === 'all' ? "bg-church-blue-light/20" : ""}
                      >
                        All Speakers
                      </DropdownMenuItem>
                      {allSpeakers.map((speaker) => (
                        <DropdownMenuItem 
                          key={speaker} 
                          onClick={() => setSelectedSpeaker(speaker)}
                          className={selectedSpeaker === speaker ? "bg-church-blue-light/20" : ""}
                        >
                          {speaker}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        Year
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem 
                        onClick={() => setSelectedYear('all')}
                        className={selectedYear === 'all' ? "bg-church-blue-light/20" : ""}
                      >
                        All Years
                      </DropdownMenuItem>
                      {allYears.map((year) => (
                        <DropdownMenuItem 
                          key={year} 
                          onClick={() => setSelectedYear(year)}
                          className={selectedYear === year ? "bg-church-blue-light/20" : ""}
                        >
                          {year}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Active filters */}
              {(selectedTopic !== 'all' || selectedSpeaker !== 'all' || selectedYear !== 'all' || searchTerm) && (
                <div className="flex flex-wrap items-center gap-2 text-sm text-church-neutral-600">
                  <span>Active filters:</span>
                  {selectedTopic !== 'all' && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Topic: {selectedTopic}
                      <button 
                        onClick={() => setSelectedTopic('all')}
                        className="ml-1 hover:text-church-neutral-900"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {selectedSpeaker !== 'all' && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Speaker: {selectedSpeaker}
                      <button 
                        onClick={() => setSelectedSpeaker('all')}
                        className="ml-1 hover:text-church-neutral-900"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {selectedYear !== 'all' && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Year: {selectedYear}
                      <button 
                        onClick={() => setSelectedYear('all')}
                        className="ml-1 hover:text-church-neutral-900"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {searchTerm && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Search: "{searchTerm}"
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="ml-1 hover:text-church-neutral-900"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setSelectedTopic('all');
                      setSelectedSpeaker('all');
                      setSelectedYear('all');
                      setSearchTerm('');
                    }}
                    className="ml-auto text-xs"
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </div>
            
            {/* View options */}
            <Tabs value={activeView} onValueChange={setActiveView} className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-church-neutral-800">
                  {filteredSermons.length} {filteredSermons.length === 1 ? 'Sermon' : 'Sermons'}
                </h2>
                <TabsList>
                  <TabsTrigger value="list">List View</TabsTrigger>
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="list" className="mt-0">
                <SermonListView sermons={filteredSermons} />
              </TabsContent>
              
              <TabsContent value="grid" className="mt-0">
                <SermonGridView sermons={filteredSermons} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </Layout>
  );
};

// List View Component - Similar to SermonAudio style
const SermonListView = ({ sermons }) => {
  if (sermons.length === 0) {
    return (
      <div className="text-center py-10 bg-church-neutral-50 rounded-lg">
        <p className="text-church-neutral-600">No sermons match your search criteria.</p>
        <p className="text-church-neutral-500 text-sm mt-2">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-church-neutral-100">
            <th className="py-3 px-4 text-left font-medium text-church-neutral-700">Title</th>
            <th className="py-3 px-4 text-left font-medium text-church-neutral-700 hidden md:table-cell">Scripture</th>
            <th className="py-3 px-4 text-left font-medium text-church-neutral-700 hidden md:table-cell">Speaker</th>
            <th className="py-3 px-4 text-left font-medium text-church-neutral-700 hidden sm:table-cell">Date</th>
            <th className="py-3 px-4 text-center font-medium text-church-neutral-700">Listen</th>
          </tr>
        </thead>
        <tbody>
          {sermons.map((sermon, index) => (
            <tr 
              key={sermon.id} 
              className={cn(
                "hover:bg-church-neutral-50 transition-colors", 
                index % 2 === 0 ? "bg-white" : "bg-church-neutral-50/50"
              )}
            >
              <td className="py-3 px-4 border-t border-church-neutral-200">
                <div>
                  <p className="font-medium text-church-blue hover:text-church-blue-dark transition-colors cursor-pointer">
                    {sermon.title}
                  </p>
                  <p className="text-xs text-church-neutral-500 mt-1 sm:hidden">
                    {sermon.speaker} • {format(new Date(sermon.date), 'MMM d, yyyy')}
                  </p>
                </div>
              </td>
              <td className="py-3 px-4 border-t border-church-neutral-200 text-church-neutral-600 hidden md:table-cell">
                {sermon.scripture || "—"}
              </td>
              <td className="py-3 px-4 border-t border-church-neutral-200 text-church-neutral-600 hidden md:table-cell">
                {sermon.speaker}
              </td>
              <td className="py-3 px-4 border-t border-church-neutral-200 text-church-neutral-600 hidden sm:table-cell">
                {format(new Date(sermon.date), 'MMM d, yyyy')}
              </td>
              <td className="py-3 px-4 border-t border-church-neutral-200 text-center">
                <div className="flex justify-center gap-2">
                  <Button variant="ghost" size="icon" title="Listen">
                    <Play className="h-4 w-4 text-church-blue" />
                  </Button>
                  {sermon.youtubeId && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-red-500"
                      title="Watch on YouTube"
                      asChild
                    >
                      <a href={`https://www.youtube.com/watch?v=${sermon.youtubeId}`} target="_blank" rel="noopener noreferrer">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </a>
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    title="Download"
                  >
                    <Download className="h-4 w-4 text-church-neutral-600" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Grid View Component
const SermonGridView = ({ sermons }) => {
  if (sermons.length === 0) {
    return (
      <div className="text-center py-10 bg-church-neutral-50 rounded-lg">
        <p className="text-church-neutral-600">No sermons match your search criteria.</p>
        <p className="text-church-neutral-500 text-sm mt-2">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sermons.map((sermon) => (
        <div 
          key={sermon.id} 
          className="border border-church-neutral-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          itemScope 
          itemType="https://schema.org/AudioObject"
        >
          <div className="relative h-48 bg-church-neutral-100">
            <img 
              src={sermon.thumbnailUrl || `https://source.unsplash.com/random/400x300/?bible,church,${sermon.id}`} 
              alt={sermon.title}
              className="w-full h-full object-cover"
              itemProp="thumbnailUrl"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
            
            {sermon.tags && sermon.tags.length > 0 && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-church-gold text-church-neutral-900">
                  {sermon.tags[0]}
                </Badge>
              </div>
            )}
            
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-white font-bold text-lg mb-1 text-shadow" itemProp="name">
                {sermon.title}
              </h3>
              <div className="flex items-center gap-2 text-white/90 text-xs">
                <Calendar className="h-3 w-3" />
                <span itemProp="datePublished">
                  {format(new Date(sermon.date), 'MMMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-church-neutral-500" />
                <span className="text-sm font-medium text-church-neutral-700" itemProp="author">
                  {sermon.speaker}
                </span>
              </div>
              
              {sermon.scripture && (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-church-neutral-500" />
                  <span className="text-sm text-church-neutral-700" itemProp="about">
                    {sermon.scripture}
                  </span>
                </div>
              )}
            </div>
            
            {sermon.description && (
              <p className="text-sm text-church-neutral-600 mb-4 line-clamp-2" itemProp="description">
                {sermon.description}
              </p>
            )}
            
            <div className="flex justify-between items-center pt-2 border-t border-church-neutral-200">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-church-blue flex items-center gap-1"
              >
                <Play className="h-3.5 w-3.5" />
                Listen
              </Button>
              
              {sermon.youtubeId && (
                <Button 
                  variant="outline"
                  size="sm"
                  className="text-red-500 flex items-center gap-1"
                  asChild
                >
                  <a href={`https://www.youtube.com/watch?v=${sermon.youtubeId}`} target="_blank" rel="noopener noreferrer">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    Watch
                  </a>
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-church-neutral-600"
                title="Download"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper function to create text shadow for better readability on image backgrounds
const textShadow = {
  textShadow: '0px 1px 2px rgba(0, 0, 0, 0.5)'
};

export default Sermons;
