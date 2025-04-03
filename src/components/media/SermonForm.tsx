
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Music, Trash2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import DragDropUploader from './DragDropUploader';
import { ImageCategory } from '@/types/imageTypes';
import { Sermon } from '@/types/sermonTypes';

interface SermonFormProps {
  sermon?: Sermon;
  onSubmit: (sermon: Omit<Sermon, 'id'>) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const SermonForm = ({ sermon, onSubmit, onCancel, isEditing }: SermonFormProps) => {
  const { toast } = useToast();
  
  // Form state
  const [title, setTitle] = useState(sermon?.title || '');
  const [speaker, setSpeaker] = useState(sermon?.speaker || '');
  const [date, setDate] = useState<Date>(sermon?.date ? new Date(sermon.date) : new Date());
  const [description, setDescription] = useState(sermon?.description || '');
  const [youtubeId, setYoutubeId] = useState(sermon?.youtubeId || '');
  const [tags, setTags] = useState(sermon?.tags?.join(', ') || '');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [speakerImage, setSpeakerImage] = useState(sermon?.speakerImage || '');
  const [speakerImageFile, setSpeakerImageFile] = useState<File | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!title || !speaker || !date) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const formattedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    
    const formData = {
      title,
      speaker,
      speakerImage: speakerImage || '/placeholder.svg',
      date,
      audioUrl: audioFile ? URL.createObjectURL(audioFile) : sermon?.audioUrl || '',
      youtubeId,
      description,
      tags: formattedTags,
    };
    
    onSubmit(formData);
  };
  
  // Handle speaker image upload
  const handleSpeakerImageUpload = async (file: File, category: ImageCategory) => {
    if (file) {
      // In a real app, upload the file to a server and get the URL
      setSpeakerImage(URL.createObjectURL(file));
      setSpeakerImageFile(file);
      
      toast({
        title: "Image uploaded",
        description: "Speaker image has been uploaded.",
      });
      
      return true;
    }
    return false;
  };
  
  // Handle audio file upload
  const handleAudioUpload = async (file: File, category: ImageCategory) => {
    if (file) {
      setAudioFile(file);
      
      toast({
        title: "Audio uploaded",
        description: `File "${file.name}" has been uploaded.`,
      });
      
      return true;
    }
    return false;
  };

  return (
    <div className="glass-panel bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-bold text-church-neutral-900 mb-6">
        {isEditing ? 'Edit Sermon' : 'Add New Sermon'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
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
        
        <div>
          <Label htmlFor="description">Sermon Description</Label>
          <Textarea 
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a brief description of the sermon"
            className="w-full mt-1"
            rows={4}
          />
        </div>
        
        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input 
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., Faith, Prayer, Holy Spirit"
            className="w-full mt-1"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="block mb-2">Speaker Image</Label>
            {speakerImage && (
              <div className="mb-4 flex items-center space-x-4">
                <Avatar className="h-16 w-16 border">
                  <AvatarImage src={speakerImage} alt={speaker} />
                  <AvatarFallback>{speaker?.charAt(0) || 'S'}</AvatarFallback>
                </Avatar>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSpeakerImage('')}
                >
                  Remove
                </Button>
              </div>
            )}
            <DragDropUploader 
              onFileAccepted={handleSpeakerImageUpload}
              category="leadership"
              acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
            />
          </div>
          
          <div>
            <Label className="block mb-2">Sermon Audio File (MP3)</Label>
            {audioFile && (
              <div className="mb-4 p-3 bg-church-neutral-50 rounded-md flex items-center justify-between">
                <div className="flex items-center">
                  <Music className="h-5 w-5 text-church-blue mr-2" />
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {audioFile.name}
                  </span>
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setAudioFile(null)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
            <DragDropUploader 
              onFileAccepted={handleAudioUpload}
              category="sermons"
              acceptedFileTypes={['audio/mpeg', 'audio/mp3']}
              maxSize={50 * 1024 * 1024} // 50MB limit
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? 'Update Sermon' : 'Add Sermon'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SermonForm;
