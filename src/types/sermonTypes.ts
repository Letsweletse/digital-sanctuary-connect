
import { z } from 'zod';

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  speakerImage: string;
  date: Date;
  audioUrl: string;
  youtubeId?: string;
  description?: string;
  tags?: string[];
  featured?: boolean;
  scripture?: string;
  thumbnailUrl?: string;
  duration?: string;
  series?: string;
  downloads?: number;
  views?: number;
}

export const SermonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  speaker: z.string().min(1, "Speaker name is required"),
  speakerImage: z.string().nullable(),
  date: z.date(),
  audioUrl: z.string().nullable(),
  youtubeId: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  scripture: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  duration: z.string().optional(),
  series: z.string().optional(),
  downloads: z.number().optional(),
  views: z.number().optional(),
});
