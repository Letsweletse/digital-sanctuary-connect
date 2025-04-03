import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Trash2, Edit2, ChevronDown, Music, User, FileText, Plus } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import DragDropUploader from './DragDropUploader';
import { ImageCategory } from '@/types/imageTypes';

// Define the interface for our sermons
interface Sermon {
  id: string;
  title: string;
  speaker: string;
  speakerImage: string;
  date: Date;
  audioUrl: string;
  youtubeId?: string;
  description?: string;
  tags?: string[];
}

const SermonManager = () => {
  const { toast } = useToast();
  const [sermons, setSermons] = useState<Sermon[]>([
    {
      id: '1',
      title: 'He\'s Power In Us',
      speaker: 'Peter Taylor',
      speakerImage: '/lovable-uploads/8c65fe13-b78a-486c-b18b-796c1ca1e52b.png',
      date: new Date('2025-03-30'),
      audioUrl: 'https://cdn.devdojo.com/episode/June2023/the-making-of-wave.mp3',
      youtubeId: 'PpSxcNgBOqM',
      description: 'A powerful sermon about the Holy Spirit living in us.',
      tags: ['Holy Spirit', 'Power', 'Christian Living'],
    },
  ]);
  
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [tags, setTags] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [speakerImage, setSpeakerImage] = useState('');
  const [speakerImageFile, setSpeakerImageFile] = useState<File | null>(null);
  
  // Reset form fields
  const resetForm = () => {
    setTitle('');
    setSpeaker('');
    setDate(new Date());
    setDescription('');
    setYoutubeId('');
    setTags('');
    setAudioFile(null);
    setSpeakerImage('');
    setSpeakerImageFile(null);
    setSelectedSermon(null);
  };
  
  // Handle edit sermon
  const handleEdit = (sermon: Sermon) => {
    setSelectedSermon(sermon);
    setTitle(sermon.title);
    setSpeaker(sermon.speaker);
    setDate(new Date(sermon.date));
    setDescription(sermon.description || '');
    setYoutubeId(sermon.youtubeId || '');
    setTags(sermon.tags?.join(', ') || '');
    setSpeakerImage(sermon.speakerImage);
    setIsEditing(true);
    setIsAdding(false);
  };
  
  // Handle delete sermon
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this sermon?')) {
      setSermons(sermons.filter(sermon => sermon.id !== id));
      toast({
        title: "Sermon deleted",
        description: "The sermon has been successfully deleted.",
      });
    }
  };
  
  // Handle form submission
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
    
    // Create or update sermon
    if (isEditing && selectedSermon) {
      // Update existing sermon
      const updatedSermons = sermons.map(sermon => {
        if (sermon.id === selectedSermon.id) {
          return {
            ...sermon,
            title,
            speaker,
            date,
            description,
            youtubeId,
            tags: formattedTags,
            speakerImage: speakerImage || sermon.speakerImage,
            // Keep the original audioUrl unless a new file is uploaded
            // In a real app, you would upload the file and update the URL
          };
        }
        return sermon;
      });
      
      setSermons(updatedSermons);
      
      toast({
        title: "Sermon updated",
        description: "The sermon has been successfully updated.",
      });
    } else {
      // Create new sermon
      const newSermon: Sermon = {
        id: Date.now().toString(),
        title,
        speaker,
        speakerImage: speakerImage || '/placeholder.svg', // Placeholder if no image
        date,
        audioUrl: audioFile ? URL.createObjectURL(audioFile) : '', // In a real app, upload to server
        youtubeId,
        description,
        tags: formattedTags,
      };
      
      setSermons([newSermon, ...sermons]);
      
      toast({
        title: "Sermon added",
        description: "The sermon has been successfully added.",
      });
    }
    
    // Reset form and state
    resetForm();
    setIsAdding(false);
    setIsEditing(false);
  };
  
  // Handle speaker image upload
  const handleSpeakerImageUpload = async (file: File, category: ImageCategory) => {
    if (file) {
      // In a real app, upload the file to a server and get the URL
      // For now, create an object URL for preview
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
    <div className="space-y-6">
      {/* Add/Edit form */}
      {(isAdding || isEditing) ? (
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
                onClick={() => {
                  resetForm();
                  setIsAdding(false);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Sermon' : 'Add Sermon'}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-church-neutral-900">
            Sermon Library
          </h3>
          <Button onClick={() => setIsAdding(true)} className="flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Sermon
          </Button>
        </div>
      )}
      
      {/* Sermons list */}
      <div className="space-y-4">
        {sermons.length === 0 ? (
          <div className="text-center py-12 bg-church-neutral-50 rounded-lg">
            <FileText className="w-12 h-12 text-church-neutral-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-church-neutral-700">No sermons yet</h4>
            <p className="text-church-neutral-500">Add your first sermon to get started.</p>
          </div>
        ) : (
          sermons.map(sermon => (
            <div 
              key={sermon.id}
              className="glass-panel bg-white p-4 rounded-lg shadow-sm border border-church-neutral-100 hover:border-church-neutral-200 transition-all"
            >
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Avatar className="h-16 w-16 rounded-md shadow-sm flex-shrink-0">
                  <AvatarImage src={sermon.speakerImage} alt={sermon.speaker} />
                  <AvatarFallback className="rounded-md">{sermon.speaker?.charAt(0) || 'S'}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="text-lg font-semibold text-church-neutral-900">
                      {sermon.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(sermon)}
                        className="text-church-neutral-700 hover:text-church-blue"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(sermon.id)}
                        className="text-church-neutral-700 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-church-neutral-600">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {sermon.speaker}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      {format(new Date(sermon.date), 'MMMM d, yyyy')}
                    </span>
                    {sermon.youtubeId && (
                      <a
                        href={`https://www.youtube.com/watch?v=${sermon.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-church-blue hover:underline"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        YouTube
                      </a>
                    )}
                  </div>
                  
                  {sermon.description && (
                    <p className="mt-2 text-sm text-church-neutral-700 line-clamp-2">
                      {sermon.description}
                    </p>
                  )}
                  
                  {sermon.tags && sermon.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {sermon.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="bg-church-blue-light/30 text-church-blue text-xs px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SermonManager;
