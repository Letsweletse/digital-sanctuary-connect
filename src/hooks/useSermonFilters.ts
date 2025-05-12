
import { useState, useEffect } from 'react';
import { Sermon } from '@/types/sermonTypes';

export const useSermonFilters = (sermons: Sermon[]) => {
  const [filteredSermons, setFilteredSermons] = useState<Sermon[]>(sermons);
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
    new Set(sermons.map(sermon => {
      const date = new Date(sermon.date);
      return date.getFullYear().toString();
    }))
  ).sort((a, b) => b.localeCompare(a)); // Sort descending

  // Filter sermons based on search term and selected filters
  useEffect(() => {
    console.log('useSermonFilters - Input sermons:', sermons);
    
    let result = [...sermons];
    
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
    
    // Filter by speaker
    if (selectedSpeaker !== 'all') {
      result = result.filter(sermon => 
        sermon.speaker === selectedSpeaker
      );
    }
    
    // Filter by year
    if (selectedYear !== 'all') {
      result = result.filter(sermon => {
        const date = new Date(sermon.date);
        return date.getFullYear().toString() === selectedYear;
      });
    }
    
    console.log('useSermonFilters - Filtered result:', result);
    setFilteredSermons(result);
  }, [searchTerm, selectedTopic, selectedSpeaker, selectedYear, sermons]);

  // Reset filters when sermons change
  useEffect(() => {
    setFilteredSermons(sermons);
  }, [sermons]);

  return {
    filteredSermons,
    searchTerm,
    setSearchTerm,
    selectedTopic,
    setSelectedTopic,
    selectedSpeaker,
    setSelectedSpeaker,
    selectedYear,
    setSelectedYear,
    activeView,
    setActiveView,
    allTopics,
    allSpeakers,
    allYears
  };
};
