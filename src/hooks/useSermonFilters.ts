
import { useState, useMemo } from 'react';
import { Sermon } from '@/types/sermonTypes';

export const useSermonFilters = (sermons: Sermon[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Extract unique speakers
  const speakers = useMemo(() => {
    const uniqueSpeakers = [...new Set(sermons.map(sermon => sermon.speaker))];
    return uniqueSpeakers.sort();
  }, [sermons]);

  // Extract unique series
  const series = useMemo(() => {
    const uniqueSeries = [...new Set(sermons.map(sermon => sermon.series).filter(Boolean))];
    return uniqueSeries.sort();
  }, [sermons]);

  // Extract unique tags
  const availableTags = useMemo(() => {
    const allTags = sermons.flatMap(sermon => sermon.tags || []);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags.sort();
  }, [sermons]);

  // Filter sermons based on all criteria
  const filteredSermons = useMemo(() => {
    return sermons.filter(sermon => {
      const matchesSearch = searchTerm === '' || 
        sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sermon.description && sermon.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesSpeaker = selectedSpeaker === '' || sermon.speaker === selectedSpeaker;
      const matchesSeries = selectedSeries === '' || sermon.series === selectedSeries;
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => sermon.tags?.includes(tag));

      return matchesSearch && matchesSpeaker && matchesSeries && matchesTags;
    });
  }, [sermons, searchTerm, selectedSpeaker, selectedSeries, selectedTags]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedSpeaker('');
    setSelectedSeries('');
    setSelectedTags([]);
  };

  return {
    filteredSermons,
    speakers,
    series,
    searchTerm,
    selectedSpeaker,
    selectedSeries,
    selectedTags,
    availableTags,
    setSearchTerm,
    setSelectedSpeaker,
    setSelectedSeries,
    setSelectedTags,
    clearAllFilters
  };
};
