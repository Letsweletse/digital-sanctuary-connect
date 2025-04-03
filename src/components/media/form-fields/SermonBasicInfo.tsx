
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface SermonBasicInfoProps {
  title: string;
  setTitle: (title: string) => void;
  speaker: string;
  setSpeaker: (speaker: string) => void;
  date: Date;
  setDate: (date: Date) => void;
  youtubeId: string;
  setYoutubeId: (youtubeId: string) => void;
}

const SermonBasicInfo = ({
  title, 
  setTitle,
  speaker, 
  setSpeaker,
  date, 
  setDate,
  youtubeId, 
  setYoutubeId
}: SermonBasicInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="title">Sermon Title*</Label>
        <Input 
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter sermon title"
          className="w-full mt-1"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="speaker">Speaker Name*</Label>
        <Input 
          id="speaker"
          value={speaker}
          onChange={(e) => setSpeaker(e.target.value)}
          placeholder="Enter speaker name"
          className="w-full mt-1"
          required
        />
      </div>
      
      <div>
        <Label>Sermon Date*</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="w-full justify-start text-left font-normal mt-1"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div>
        <Label htmlFor="youtubeId">YouTube Video ID (optional)</Label>
        <Input 
          id="youtubeId"
          value={youtubeId}
          onChange={(e) => setYoutubeId(e.target.value)}
          placeholder="e.g., PpSxcNgBOqM"
          className="w-full mt-1"
        />
      </div>
    </div>
  );
};

export default SermonBasicInfo;
