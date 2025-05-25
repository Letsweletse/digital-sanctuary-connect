
import { Sermon } from '@/types/sermonTypes';
import { supabase } from '@/integrations/supabase/client';
import { findMany, insertOne, updateOne, deleteOne } from '@/lib/mongodb';
import { toast } from 'sonner';

export type DatabaseProvider = 'mongodb' | 'supabase';

interface SermonServiceConfig {
  primaryProvider: DatabaseProvider;
  fallbackProvider: DatabaseProvider;
  autoRetry: boolean;
}

class DualSermonService {
  private config: SermonServiceConfig = {
    primaryProvider: 'supabase',
    fallbackProvider: 'mongodb',
    autoRetry: true
  };

  async getSermons(): Promise<{ sermons: Sermon[], provider: DatabaseProvider }> {
    console.log(`Attempting to load sermons from ${this.config.primaryProvider}`);
    
    try {
      const sermons = await this.getSermonsFromProvider(this.config.primaryProvider);
      console.log(`Successfully loaded ${sermons.length} sermons from ${this.config.primaryProvider}`);
      return { sermons, provider: this.config.primaryProvider };
    } catch (error) {
      console.error(`Failed to load from ${this.config.primaryProvider}:`, error);
      
      if (this.config.autoRetry) {
        console.log(`Falling back to ${this.config.fallbackProvider}`);
        try {
          const sermons = await this.getSermonsFromProvider(this.config.fallbackProvider);
          console.log(`Successfully loaded ${sermons.length} sermons from ${this.config.fallbackProvider} (fallback)`);
          
          toast.warning(`Loaded sermons from backup database (${this.config.fallbackProvider})`);
          return { sermons, provider: this.config.fallbackProvider };
        } catch (fallbackError) {
          console.error(`Fallback also failed:`, fallbackError);
          toast.error('Both databases are unavailable. Using local data.');
          throw new Error('Both database providers failed');
        }
      }
      
      throw error;
    }
  }

  private async getSermonsFromProvider(provider: DatabaseProvider): Promise<Sermon[]> {
    switch (provider) {
      case 'supabase':
        return this.getSermonsFromSupabase();
      case 'mongodb':
        return this.getSermonsFromMongoDB();
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  private async getSermonsFromSupabase(): Promise<Sermon[]> {
    const { data, error } = await supabase
      .from('sermons')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log('No sermons found in Supabase');
      return [];
    }

    return data.map(sermon => ({
      id: sermon.id,
      title: sermon.title,
      speaker: sermon.speaker,
      speakerImage: sermon.speaker_image,
      date: new Date(sermon.date),
      audioUrl: sermon.audio_url,
      youtubeId: sermon.youtube_id,
      description: sermon.description,
      tags: sermon.tags || [],
      thumbnailUrl: sermon.thumbnail_url,
      featured: sermon.featured || false,
      duration: sermon.duration,
      downloads: sermon.downloads || 0,
      views: sermon.views || 0,
      series: sermon.series,
    }));
  }

  private async getSermonsFromMongoDB(): Promise<Sermon[]> {
    const mongoSermons = await findMany('sermons', {}, { sort: { date: -1 } });
    
    if (!mongoSermons || mongoSermons.length === 0) {
      console.log('No sermons found in MongoDB');
      return [];
    }

    return mongoSermons.map((doc: any) => {
      const { _id, ...rest } = doc;
      return {
        id: _id.toString(),
        ...rest,
        date: new Date(rest.date),
      } as Sermon;
    });
  }

  async addSermon(sermon: Omit<Sermon, 'id'>, provider?: DatabaseProvider): Promise<Sermon> {
    const targetProvider = provider || this.config.primaryProvider;
    console.log(`Adding sermon to ${targetProvider}`);

    try {
      const newSermon = await this.addSermonToProvider(sermon, targetProvider);
      
      // Try to sync to the other provider in the background
      if (this.config.autoRetry) {
        const otherProvider = targetProvider === 'supabase' ? 'mongodb' : 'supabase';
        this.syncSermonToProvider(newSermon, otherProvider).catch(error => {
          console.warn(`Failed to sync sermon to ${otherProvider}:`, error);
        });
      }
      
      return newSermon;
    } catch (error) {
      console.error(`Failed to add sermon to ${targetProvider}:`, error);
      
      if (this.config.autoRetry && !provider) {
        const fallbackProvider = this.config.fallbackProvider;
        console.log(`Trying to add sermon to ${fallbackProvider} instead`);
        return this.addSermonToProvider(sermon, fallbackProvider);
      }
      
      throw error;
    }
  }

  private async addSermonToProvider(sermon: Omit<Sermon, 'id'>, provider: DatabaseProvider): Promise<Sermon> {
    switch (provider) {
      case 'supabase':
        return this.addSermonToSupabase(sermon);
      case 'mongodb':
        return this.addSermonToMongoDB(sermon);
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  private async addSermonToSupabase(sermon: Omit<Sermon, 'id'>): Promise<Sermon> {
    const { data, error } = await supabase
      .from('sermons')
      .insert({
        title: sermon.title,
        speaker: sermon.speaker,
        speaker_image: sermon.speakerImage,
        date: sermon.date,
        audio_url: sermon.audioUrl,
        youtube_id: sermon.youtubeId,
        description: sermon.description,
        tags: sermon.tags,
        thumbnail_url: sermon.thumbnailUrl,
        featured: sermon.featured,
        duration: sermon.duration,
        downloads: sermon.downloads,
        views: sermon.views,
        series: sermon.series,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Supabase insert error: ${error.message}`);
    }

    return {
      id: data.id,
      title: data.title,
      speaker: data.speaker,
      speakerImage: data.speaker_image,
      date: new Date(data.date),
      audioUrl: data.audio_url,
      youtubeId: data.youtube_id,
      description: data.description,
      tags: data.tags || [],
      thumbnailUrl: data.thumbnail_url,
      featured: data.featured || false,
      duration: data.duration,
      downloads: data.downloads || 0,
      views: data.views || 0,
      series: data.series,
    };
  }

  private async addSermonToMongoDB(sermon: Omit<Sermon, 'id'>): Promise<Sermon> {
    const result = await insertOne('sermons', {
      ...sermon,
      date: sermon.date instanceof Date ? sermon.date.toISOString() : sermon.date,
    });

    return {
      ...sermon,
      id: result.insertedId || Date.now().toString(),
      date: sermon.date instanceof Date ? sermon.date : new Date(sermon.date),
    };
  }

  private async syncSermonToProvider(sermon: Sermon, provider: DatabaseProvider): Promise<void> {
    try {
      const { id, ...sermonWithoutId } = sermon;
      await this.addSermonToProvider(sermonWithoutId, provider);
      console.log(`Successfully synced sermon to ${provider}`);
    } catch (error) {
      console.warn(`Failed to sync sermon to ${provider}:`, error);
    }
  }

  async updateSermon(id: string, updates: Partial<Sermon>, provider?: DatabaseProvider): Promise<void> {
    const targetProvider = provider || this.config.primaryProvider;
    console.log(`Updating sermon in ${targetProvider}`);

    try {
      await this.updateSermonInProvider(id, updates, targetProvider);
    } catch (error) {
      console.error(`Failed to update sermon in ${targetProvider}:`, error);
      
      if (this.config.autoRetry && !provider) {
        const fallbackProvider = this.config.fallbackProvider;
        console.log(`Trying to update sermon in ${fallbackProvider} instead`);
        await this.updateSermonInProvider(id, updates, fallbackProvider);
      } else {
        throw error;
      }
    }
  }

  private async updateSermonInProvider(id: string, updates: Partial<Sermon>, provider: DatabaseProvider): Promise<void> {
    switch (provider) {
      case 'supabase':
        await this.updateSermonInSupabase(id, updates);
        break;
      case 'mongodb':
        await this.updateSermonInMongoDB(id, updates);
        break;
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  private async updateSermonInSupabase(id: string, updates: Partial<Sermon>): Promise<void> {
    const supabaseUpdates: any = {};
    
    if (updates.title !== undefined) supabaseUpdates.title = updates.title;
    if (updates.speaker !== undefined) supabaseUpdates.speaker = updates.speaker;
    if (updates.speakerImage !== undefined) supabaseUpdates.speaker_image = updates.speakerImage;
    if (updates.date !== undefined) supabaseUpdates.date = updates.date;
    if (updates.audioUrl !== undefined) supabaseUpdates.audio_url = updates.audioUrl;
    if (updates.youtubeId !== undefined) supabaseUpdates.youtube_id = updates.youtubeId;
    if (updates.description !== undefined) supabaseUpdates.description = updates.description;
    if (updates.tags !== undefined) supabaseUpdates.tags = updates.tags;
    if (updates.thumbnailUrl !== undefined) supabaseUpdates.thumbnail_url = updates.thumbnailUrl;
    if (updates.featured !== undefined) supabaseUpdates.featured = updates.featured;
    if (updates.duration !== undefined) supabaseUpdates.duration = updates.duration;
    if (updates.downloads !== undefined) supabaseUpdates.downloads = updates.downloads;
    if (updates.views !== undefined) supabaseUpdates.views = updates.views;
    if (updates.series !== undefined) supabaseUpdates.series = updates.series;

    const { error } = await supabase
      .from('sermons')
      .update(supabaseUpdates)
      .eq('id', id);

    if (error) {
      throw new Error(`Supabase update error: ${error.message}`);
    }
  }

  private async updateSermonInMongoDB(id: string, updates: Partial<Sermon>): Promise<void> {
    const mongoUpdates = { ...updates };
    if (mongoUpdates.date instanceof Date) {
      mongoUpdates.date = mongoUpdates.date.toISOString();
    }
    delete (mongoUpdates as any).id; // Remove id from updates

    await updateOne('sermons', { _id: id }, { $set: mongoUpdates });
  }

  async deleteSermon(id: string, provider?: DatabaseProvider): Promise<void> {
    const targetProvider = provider || this.config.primaryProvider;
    console.log(`Deleting sermon from ${targetProvider}`);

    try {
      await this.deleteSermonFromProvider(id, targetProvider);
    } catch (error) {
      console.error(`Failed to delete sermon from ${targetProvider}:`, error);
      
      if (this.config.autoRetry && !provider) {
        const fallbackProvider = this.config.fallbackProvider;
        console.log(`Trying to delete sermon from ${fallbackProvider} instead`);
        await this.deleteSermonFromProvider(id, fallbackProvider);
      } else {
        throw error;
      }
    }
  }

  private async deleteSermonFromProvider(id: string, provider: DatabaseProvider): Promise<void> {
    switch (provider) {
      case 'supabase':
        const { error } = await supabase
          .from('sermons')
          .delete()
          .eq('id', id);
        
        if (error) {
          throw new Error(`Supabase delete error: ${error.message}`);
        }
        break;
      case 'mongodb':
        await deleteOne('sermons', { _id: id });
        break;
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  // Configuration methods
  setPrimaryProvider(provider: DatabaseProvider): void {
    this.config.primaryProvider = provider;
    this.config.fallbackProvider = provider === 'supabase' ? 'mongodb' : 'supabase';
    console.log(`Primary provider set to ${provider}, fallback to ${this.config.fallbackProvider}`);
  }

  setAutoRetry(enabled: boolean): void {
    this.config.autoRetry = enabled;
    console.log(`Auto retry ${enabled ? 'enabled' : 'disabled'}`);
  }

  getConfig(): SermonServiceConfig {
    return { ...this.config };
  }
}

export const dualSermonService = new DualSermonService();
