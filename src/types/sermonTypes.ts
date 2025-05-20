
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
