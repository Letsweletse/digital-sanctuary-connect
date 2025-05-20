
import { z } from 'zod';

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  speakerImage?: string;
  date: Date | string;
  audioUrl?: string;
  youtubeId?: string;
  description?: string;
  tags?: string[];
  thumbnailUrl?: string;
  featured?: boolean;
  duration?: string;
  downloads?: number;
  views?: number;
  series?: string;
}

// Add Zod schema for sermon validation
export const SermonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  speaker: z.string().min(1, "Speaker is required"),
  date: z.union([z.date(), z.string()]).transform(val => 
    typeof val === 'string' ? new Date(val) : val
  ),
  audioUrl: z.string().optional(),
  youtubeId: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  thumbnailUrl: z.string().optional(),
  featured: z.boolean().optional(),
  duration: z.string().optional(),
  downloads: z.number().optional(),
  views: z.number().optional(),
  series: z.string().optional(),
  speakerImage: z.string().optional(),
});
