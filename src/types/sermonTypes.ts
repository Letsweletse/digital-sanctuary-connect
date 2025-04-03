
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
}
