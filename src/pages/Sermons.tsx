import React, { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { useSermons } from '@/hooks/useSermons';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Tag, User, Calendar, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import ViewSelector from '@/components/sermons/ViewSelector';
import { Card } from '@/components/ui/card';

const Sermons = () => {
  const { sermons, isLoading, error } = useSermons();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedSpeaker, setSelectedSpeaker] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  // Extract unique values
  const allTopics = useMemo(() => {
    const topics = [...new Set(sermons.flatMap(s => s.tags || []))];
    return topics.sort();
  }, [sermons]);

  const allSpeakers = useMemo(() => {
    const speakers = [...new Set(sermons.map(s => s.speaker))];
    return speakers.sort();
  }, [sermons]);

  const allYears = useMemo(() => {
    const years = [...new Set(sermons.map(s => new Date(s.date).getFullYear().toString()))];
    return years.sort().reverse();
  }, [sermons]);

  // Filter sermons
  const filteredSermons = useMemo(() => {
    return sermons.filter(sermon => {
      const matchesSearch = searchTerm === '' || 
        sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sermon.description && sermon.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesTopic = selectedTopic === 'all' || sermon.tags?.includes(selectedTopic);
      const matchesSpeaker = selectedSpeaker === 'all' || sermon.speaker === selectedSpeaker;
      const matchesYear = selectedYear === 'all' || new Date(sermon.date).getFullYear().toString() === selectedYear;

      return matchesSearch && matchesTopic && matchesSpeaker && matchesYear;
    });
  }, [sermons, searchTerm, selectedTopic, selectedSpeaker, selectedYear]);

  const resetFilters = () => {
    setSelectedTopic('all');
    setSelectedSpeaker('all');
    setSelectedYear('all');
    setSearchTerm('');
  };

  const hasActiveFilters = selectedTopic !== 'all' || selectedSpeaker !== 'all' || selectedYear !== 'all' || searchTerm;

  if (isLoading) {
    return (
      <Layout>
        <main className="flex-grow pt-24 page-transition">
          <div className="container mx-auto px-4 py-10">
            <div className="text-center py-10">
              <div className="w-10 h-10 border-2 border-church-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-church-neutral-600">Loading sermons...</p>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <main className="flex-grow pt-24 page-transition">
          <div className="container mx-auto px-4 py-10">
            <Card className="mx-auto max-w-2xl bg-red-50 border-red-200">
              <div className="text-center py-10">
                <p className="text-red-600 mb-2">Error: {error}</p>
                <p className="text-church-neutral-500 text-sm">Please check the Admin panel to upload sermons.</p>
              </div>
            </Card>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="flex-grow pt-24 page-transition">
        <div className="container mx-auto px-4 py-10">
          {/* Header */}
          <div className="max-w-4xl mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-church-neutral-900 mb-3">
              Sermon Library
            </h1>
            <p className="text-church-neutral-600 mb-4 max-w-3xl">
              Listen to and download sermons that bring biblical truth to life. 
              Browse by speaker, topic, or scripture reference.
            </p>
            <div className="text-sm text-church-neutral-500">
              Our library contains {sermons.length} sermon{sermons.length !== 1 ? 's' : ''} for your spiritual growth.
            </div>
          </div>

          {/* Filter Bar */}
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
            {hasActiveFilters && (
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
                  onClick={resetFilters}
                  className="ml-auto text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>

          {/* View Selector and Results */}
          <ViewSelector filteredSermons={filteredSermons} />
        </div>
      </main>
    </Layout>
  );
};

export default Sermons;
