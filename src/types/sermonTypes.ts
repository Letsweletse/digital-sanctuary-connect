
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
