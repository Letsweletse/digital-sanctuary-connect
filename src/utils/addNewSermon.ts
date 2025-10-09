import { supabase } from '@/integrations/supabase/client';
import { Sermon } from '@/types/sermonTypes';

const addNewSermon = async () => {
  const sermonData: Omit<Sermon, 'id'> = {
    title: 'Sunday Sermon - The Wisdom Of God',
    speaker: 'Pastor Kobus Bezuidenhout',
    date: '2025-10-05',
    youtubeId: 'OVYHy6jebeo',
    description: 'Sunday Sermon on The Wisdom of God delivered by Pastor Kobus Bezuidenhout',
    tags: ['Wisdom', 'Sunday Service', 'Teaching'],
    featured: false,
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
      .eq('date', sermonData.date as string);

    if (!existingSermons || existingSermons.length === 0) {
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
      } else {
        console.log('✅ Sermon "The Wisdom Of God" added successfully');
      }
    } else {
      console.log('ℹ️ Sermon "The Wisdom Of God" already exists in database');
    }
  } catch (error) {
    console.error('❌ Error checking/adding sermon:', error);
  }
};

// Execute the function
addNewSermon();
