
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CalendarIcon, MicIcon, FileAudioIcon, UserIcon, TagIcon } from 'lucide-react';
import { FormItem, FormLabel, FormDescription } from '@/components/ui/form';

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
    <div className="space-y-6">
      <div className="bg-church-blue-light/10 p-4 rounded-md mb-4">
        <h3 className="font-medium text-church-blue-dark mb-2 flex items-center">
          <FileAudioIcon className="w-4 h-4 mr-2" />
          Required Sermon Information
        </h3>
        <p className="text-sm text-church-neutral-600 mb-4">
          This information will be used to identify and categorize your sermon audio file.
          All fields marked with * are required.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="flex items-center">
            <MicIcon className="w-4 h-4 mr-2" />
            Sermon Title*
          </Label>
          <Input 
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter sermon title"
            className="w-full"
            required
          />
          <p className="text-xs text-church-neutral-500">
            The main title that will appear in the sermon library
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="speaker" className="flex items-center">
            <UserIcon className="w-4 h-4 mr-2" />
            Speaker Name*
          </Label>
          <Input 
            id="speaker"
            value={speaker}
            onChange={(e) => setSpeaker(e.target.value)}
            placeholder="Enter speaker name"
            className="w-full"
            required
          />
          <p className="text-xs text-church-neutral-500">
            The name of the person who delivered this sermon
          </p>
        </div>
        
        <div className="space-y-2">
          <Label className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Sermon Date*
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-full justify-start text-left font-normal"
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
          <p className="text-xs text-church-neutral-500">
            When this sermon was delivered
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="youtubeId" className="flex items-center">
            <TagIcon className="w-4 h-4 mr-2" />
            YouTube Video ID (optional)
          </Label>
          <Input 
            id="youtubeId"
            value={youtubeId}
            onChange={(e) => setYoutubeId(e.target.value)}
            placeholder="e.g., PpSxcNgBOqM"
            className="w-full"
          />
          <p className="text-xs text-church-neutral-500">
            If this sermon is also on YouTube, enter the video ID here
          </p>
        </div>
      </div>
    </div>
  );
};

export default SermonBasicInfo;
