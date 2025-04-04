
import React from 'react';
import { Search, Tag, User, Calendar, ChevronDown } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedTopic: string;
  setSelectedTopic: (value: string) => void;
  selectedSpeaker: string;
  setSelectedSpeaker: (value: string) => void;
  selectedYear: string;
  setSelectedYear: (value: string) => void;
  allTopics: string[];
  allSpeakers: string[];
  allYears: string[];
}

const FilterBar = ({
  searchTerm,
  setSearchTerm,
  selectedTopic,
  setSelectedTopic,
  selectedSpeaker,
  setSelectedSpeaker,
  selectedYear,
  setSelectedYear,
  allTopics,
  allSpeakers,
  allYears
}: FilterBarProps) => {
  const resetFilters = () => {
    setSelectedTopic('all');
    setSelectedSpeaker('all');
    setSelectedYear('all');
    setSearchTerm('');
  };

  const hasActiveFilters = selectedTopic !== 'all' || selectedSpeaker !== 'all' || selectedYear !== 'all' || searchTerm;

  return (
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
  );
};

export default FilterBar;
