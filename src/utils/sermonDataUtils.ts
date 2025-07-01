
import { supabase } from '@/integrations/supabase/client';
import { Sermon } from '@/types/sermonTypes';

export const addSermonToDatabase = async (sermonData: Omit<Sermon, 'id'>) => {
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

    if (error) {
      console.error('Error adding sermon:', error);
      throw error;
    }

    console.log('✅ Sermon added successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Failed to add sermon:', error);
    return { success: false, error };
  }
};

// Add the Pastor Kobus sermon immediately when this file loads
const addPastorKobusSermon = async () => {
  const sermonData: Omit<Sermon, 'id'> = {
    title: 'Prayer - A Blessing',
    speaker: 'Pastor Kobus Bezuidenhout',
    date: '2024-06-29',
    youtubeId: 'bGNGdIDzJeg',
    description: 'Sunday Sermon on Prayer as a Blessing delivered by Pastor Kobus Bezuidenhout',
    tags: ['Prayer', 'Blessing', 'Sunday Service'],
    featured: true,
    views: 0,
    downloads: 0
  };

  try {
    // Check if this sermon already exists
    const { data: existingSermons } = await supabase
      .from('sermons')
      .select('id')
      .eq('title', sermonData.title)
      .eq('speaker', sermonData.speaker)
      .eq('date', sermonData.date);

    if (!existingSermons || existingSermons.length === 0) {
      const result = await addSermonToDatabase(sermonData);
      if (result.success) {
        console.log('✅ Pastor Kobus sermon added successfully');
      }
    } else {
      console.log('ℹ️ Pastor Kobus sermon already exists in database');
    }
  } catch (error) {
    console.error('❌ Error checking/adding Pastor Kobus sermon:', error);
  }
};

// Execute the function
addPastorKobusSermon();
