
import { useState, useEffect } from 'react';
import { Sermon } from '@/types/sermonTypes';
import { supabase } from '@/integrations/supabase/client';

export const useSermons = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSermons = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔍 Fetching sermons from Supabase...');
      
      const { data, error: supabaseError } = await supabase
        .from('sermons')
        .select('*')
        .order('date', { ascending: false });

      if (supabaseError) {
        console.error('❌ Supabase error:', supabaseError);
        setError(`Database error: ${supabaseError.message}`);
        return;
      }

      console.log(`✅ Found ${data.length} sermons in database`);
      
      if (data.length === 0) {
        console.log('ℹ️ No sermons found in database');
        setError('No sermons found. Please upload some sermons using the Admin panel.');
        return;
      }

      // Transform the data to match our Sermon type
      const transformedSermons: Sermon[] = data.map(sermon => ({
        id: sermon.id,
        title: sermon.title,
        speaker: sermon.speaker,
        date: new Date(sermon.date).toISOString().split('T')[0],
        duration: sermon.duration || undefined,
        description: sermon.description || undefined,
        audioUrl: sermon.audio_url || undefined,
        youtubeId: sermon.youtube_id || undefined,
        series: sermon.series || undefined,
        tags: sermon.tags || [],
        featured: sermon.featured || false,
        thumbnailUrl: sermon.thumbnail_url || undefined,
        speakerImage: sermon.speaker_image || undefined,
        views: sermon.views || 0,
        downloads: sermon.downloads || 0
      }));

      setSermons(transformedSermons);
      console.log('✅ Sermons loaded successfully');
      
    } catch (err) {
      console.error('❌ Error fetching sermons:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSermons();
  }, []);

  const refreshSermons = () => {
    fetchSermons();
  };

  const addSermon = async (sermonData: Omit<Sermon, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('sermons')
        .insert([{
          title: sermonData.title,
          speaker: sermonData.speaker,
          date: typeof sermonData.date === 'string' ? sermonData.date : sermonData.date.toISOString().split('T')[0],
          duration: sermonData.duration,
          description: sermonData.description,
          audio_url: sermonData.audioUrl,
          youtube_id: sermonData.youtubeId,
          series: sermonData.series,
          tags: sermonData.tags,
          featured: sermonData.featured,
          thumbnail_url: sermonData.thumbnailUrl,
          speaker_image: sermonData.speakerImage,
          views: sermonData.views || 0,
          downloads: sermonData.downloads || 0
        }])
        .select()
        .single();

      if (error) throw error;

      await refreshSermons();
      return { success: true, data };
    } catch (error) {
      console.error('Error adding sermon:', error);
      return { success: false, error };
    }
  };

  const updateSermon = async (id: string, sermonData: Partial<Sermon>) => {
    try {
      const { error } = await supabase
        .from('sermons')
        .update({
          title: sermonData.title,
          speaker: sermonData.speaker,
          date: sermonData.date ? (typeof sermonData.date === 'string' ? sermonData.date : sermonData.date.toISOString().split('T')[0]) : undefined,
          duration: sermonData.duration,
          description: sermonData.description,
          audio_url: sermonData.audioUrl,
          youtube_id: sermonData.youtubeId,
          series: sermonData.series,
          tags: sermonData.tags,
          featured: sermonData.featured,
          thumbnail_url: sermonData.thumbnailUrl,
          speaker_image: sermonData.speakerImage,
          views: sermonData.views,
          downloads: sermonData.downloads
        })
        .eq('id', id);

      if (error) throw error;

      await refreshSermons();
      return { success: true };
    } catch (error) {
      console.error('Error updating sermon:', error);
      return { success: false, error };
    }
  };

  const deleteSermon = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sermons')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await refreshSermons();
      return { success: true };
    } catch (error) {
      console.error('Error deleting sermon:', error);
      return { success: false, error };
    }
  };

  return {
    sermons,
    isLoading,
    error,
    refreshSermons,
    addSermon,
    updateSermon,
    deleteSermon,
    isUsingSupabase: true
  };
};
