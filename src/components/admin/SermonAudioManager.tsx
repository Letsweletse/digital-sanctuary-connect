import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Trash2, Edit, Play, Pause, Calendar as CalendarIcon, AlertTriangle, FileAudio } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatFileSize } from '@/utils/audioMetadataUtils';

interface SermonFile {
  id: string;
  title: string;
  speaker: string;
  date: string;
  notes?: string;
  url: string;
  size: number;
  filename: string;
  created_at: string;
}

const SermonAudioManager = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});
  const [sermons, setSermons] = useState<SermonFile[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [audioValidationError, setAudioValidationError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    try {
      const { data, error } = await supabase
        .storage
        .from('sermon_audio')
        .list();

      if (error) {
        console.error('Error fetching sermons:', error);
        toast({
          title: "Error fetching sermons",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      const sermonFiles = await Promise.all(data
        .filter(item => !item.id.endsWith('/'))
        .map(async (item) => {
          // Get public URL
          const { data: { publicUrl } } = supabase
            .storage
            .from('sermon_audio')
            .getPublicUrl(item.name);

          // Try to parse metadata from filename (expected format: title_speaker_date.mp3)
          let filenameParts = item.name.replace('.mp3', '').split('_');
          let parsedTitle = filenameParts[0]?.replace(/_/g, ' ') || 'Unknown Title';
          let parsedSpeaker = filenameParts[1]?.replace(/_/g, ' ') || 'Unknown Speaker';
          
          // Convert date from filename if possible, otherwise use upload date
          let parsedDate;
          try {
            if (filenameParts[2]) {
              parsedDate = new Date(filenameParts[2].replace(/-/g, '/'));
              if (isNaN(parsedDate.getTime())) {
                parsedDate = new Date(item.created_at);
              }
            } else {
              parsedDate = new Date(item.created_at);
            }
          } catch {
            parsedDate = new Date(item.created_at);
          }

          return {
            id: item.id,
            title: parsedTitle,
            speaker: parsedSpeaker,
            date: format(parsedDate, 'yyyy-MM-dd'),
            url: publicUrl,
            size: item.metadata?.size || 0,
            filename: item.name,
            created_at: item.created_at
          };
        }));

      setSermons(sermonFiles);
    } catch (err) {
      console.error("Error processing sermon files:", err);
      toast({
        title: "Error loading sermons",
        description: "There was a problem retrieving the sermon list",
        variant: "destructive"
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (!selectedFile.type.includes('audio/mpeg') && !selectedFile.type.includes('audio/mp3')) {
        setAudioValidationError("Only MP3 files are supported");
        setFile(null);
        return;
      }
      
      // Validate file size
      if (selectedFile.size > 100 * 1024 * 1024) { // 100 MB
        setAudioValidationError("File size must be under 100MB");
        setFile(null);
        return;
      }
      
      // Clear previous errors
      setAudioValidationError(null);
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Validate file type
      if (!droppedFile.type.includes('audio/mpeg') && !droppedFile.type.includes('audio/mp3')) {
        setAudioValidationError("Only MP3 files are supported");
        return;
      }
      
      // Validate file size
      if (droppedFile.size > 100 * 1024 * 1024) { // 100 MB
        setAudioValidationError("File size must be under 100MB");
        return;
      }
      
      // Clear previous errors
      setAudioValidationError(null);
      setFile(droppedFile);
    }
  };

  const createSafeFilename = () => {
    // Create a filename with underscores
    const titlePart = title.trim().replace(/[^\w]/g, '_');
    const speakerPart = speaker.trim().replace(/[^\w]/g, '_');
    const datePart = format(date, 'yyyy_MM_dd');
    
    return `${titlePart}_${speakerPart}_${datePart}.mp3`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      toast({ title: "Missing title", description: "Please enter a sermon title", variant: "destructive" });
      return;
    }
    
    if (!speaker.trim()) {
      toast({ title: "Missing speaker", description: "Please enter a speaker name", variant: "destructive" });
      return;
    }
    
    if (!file && !isEditing) {
      toast({ title: "No file selected", description: "Please select an audio file to upload", variant: "destructive" });
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      if (isEditing && editingId) {
        // Update sermon metadata (Supabase doesn't support metadata updates, so we need to rename)
        const sermon = sermons.find(s => s.id === editingId);
        if (sermon) {
          // Create new filename
          const newFilename = createSafeFilename();
          
          // Only rename if filename changed
          if (newFilename !== sermon.filename) {
            // Copy file with new name
            const { data: copyData, error: copyError } = await supabase
              .storage
              .from('sermon_audio')
              .copy(sermon.filename, newFilename);
              
            if (copyError) throw copyError;
            
            // Delete old file
            const { error: deleteError } = await supabase
              .storage
              .from('sermon_audio')
              .remove([sermon.filename]);
              
            if (deleteError) throw deleteError;
          }
          
          setUploadProgress(100);
          
          toast({
            title: "Sermon updated",
            description: "The sermon details have been updated successfully"
          });
          
          // Reset form after short delay
          setTimeout(() => {
            resetForm();
            fetchSermons();
          }, 1000);
        }
      } else if (file) {
        // Upload new file
        const filename = createSafeFilename();
        
        // Use our improved upload service
        const result = await uploadAudioToSupabase(file, 'sermons', (progress) => {
          setUploadProgress(progress);
        });
        
        if (!result.success) {
          throw new Error('Failed to upload the file to storage');
        }
        
        setUploadProgress(100);
        
        toast({
          title: "Upload successful",
          description: "Your sermon has been uploaded successfully"
        });
        
        // Reset form after short delay
        setTimeout(() => {
          resetForm();
          fetchSermons();
        }, 1000);
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "There was a problem uploading your file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePlayPause = (id: string, audioUrl: string) => {
    // Create or get the audio element
    let audioElement = document.getElementById(`sermon-audio-${id}`) as HTMLAudioElement;
    if (!audioElement) {
      audioElement = document.createElement('audio');
      audioElement.id = `sermon-audio-${id}`;
      audioElement.src = audioUrl;
      document.body.appendChild(audioElement);
      
      audioElement.addEventListener('ended', () => {
        setIsPlaying(prev => ({ ...prev, [id]: false }));
      });
    }
    
    if (isPlaying[id]) {
      audioElement.pause();
      setIsPlaying(prev => ({ ...prev, [id]: false }));
    } else {
      // Pause all other playing audio
      Object.keys(isPlaying).forEach(key => {
        if (isPlaying[key] && key !== id) {
          const otherAudio = document.getElementById(`sermon-audio-${key}`) as HTMLAudioElement;
          if (otherAudio) otherAudio.pause();
        }
      });
      
      // Play this audio
      audioElement.play().catch(err => {
        console.error("Error playing audio:", err);
        toast({
          title: "Playback error",
          description: "Could not play the audio file",
          variant: "destructive"
        });
      });
      
      setIsPlaying(prev => {
        const newState = { ...prev };
        Object.keys(newState).forEach(key => { newState[key] = false; });
        newState[id] = true;
        return newState;
      });
    }
  };

  const handleEditSermon = (sermon: SermonFile) => {
    setTitle(sermon.title);
    setSpeaker(sermon.speaker);
    setDate(new Date(sermon.date));
    setNotes(sermon.notes || '');
    setEditingId(sermon.id);
    setIsEditing(true);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSermon = async (id: string, filename: string) => {
    if (window.confirm("Are you sure you want to delete this sermon?")) {
      try {
        const { error } = await supabase
          .storage
          .from('sermon_audio')
          .remove([filename]);
          
        if (error) throw error;
        
        toast({
          title: "Sermon deleted",
          description: "The sermon has been successfully deleted"
        });
        
        // Refresh the list
        fetchSermons();
      } catch (error: any) {
        console.error("Delete error:", error);
        toast({
          title: "Delete failed",
          description: error.message || "There was a problem deleting the sermon",
          variant: "destructive"
        });
      }
    }
  };

  const resetForm = () => {
    setTitle('');
    setSpeaker('');
    setDate(new Date());
    setNotes('');
    setFile(null);
    setAudioUrl(null);
    setIsEditing(false);
    setEditingId(null);
    setAudioValidationError(null);
    setUploadProgress(0);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-church-blue">
          <FileAudio className="h-6 w-6" />
          <span>📥 Upload Sermon Audio</span>
        </h1>
        <p className="text-church-neutral-600 mt-2">
          Upload and manage audio files for your church sermons.
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title" className="text-church-neutral-700">Sermon Title*</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="mt-1" 
                placeholder="Enter sermon title"
                required 
              />
            </div>
            
            <div>
              <Label htmlFor="speaker" className="text-church-neutral-700">Speaker Name*</Label>
              <Input 
                id="speaker" 
                value={speaker} 
                onChange={(e) => setSpeaker(e.target.value)} 
                className="mt-1" 
                placeholder="Enter speaker name"
                required 
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className="text-church-neutral-700">Date*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal mt-1"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "MMMM d, yyyy") : <span>Pick a date</span>}
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
              <Label htmlFor="notes" className="text-church-neutral-700">Optional Notes</Label>
              <Textarea 
                id="notes" 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                className="mt-1" 
                placeholder="Add any extra notes or description"
                rows={1}
              />
            </div>
          </div>
          
          {!isEditing && (
            <div className="mt-4">
              <Label className="text-church-neutral-700 mb-2 block">Audio File* (.mp3 only, max 100MB)</Label>
              
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  audioValidationError ? 'border-red-500 bg-red-50' : 'border-church-blue-light/40 hover:border-church-blue-light'
                } transition-colors cursor-pointer`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('audio-upload')?.click()}
              >
                <input 
                  id="audio-upload" 
                  type="file"
                  className="hidden"
                  accept=".mp3,audio/mpeg"
                  onChange={handleFileChange}
                />
                
                {file ? (
                  <div className="flex items-center justify-center">
                    <FileAudio className="h-6 w-6 text-church-blue mr-2" />
                    <span className="font-medium">{file.name}</span>
                    <span className="text-sm text-church-neutral-500 ml-2">({formatFileSize(file.size)})</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <FileAudio className="h-10 w-10 text-church-blue-light/60 mx-auto" />
                    <p className="text-church-neutral-600">Drag and drop your MP3 file here, or click to browse</p>
                    <p className="text-sm text-church-neutral-500">Only .mp3 format (max 100MB)</p>
                    <p className="text-xs text-church-neutral-500">
                      Filenames must use underscores only, no spaces or special characters
                    </p>
                  </div>
                )}
              </div>
              
              {audioValidationError && (
                <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  {audioValidationError}
                </div>
              )}

              {file && (
                <div className="mt-4 bg-church-neutral-50 p-4 rounded-lg">
                  <h3 className="font-medium text-church-neutral-800 mb-2">Preview Filename</h3>
                  <p className="font-mono text-xs text-church-neutral-600 break-all">
                    {createSafeFilename()}
                  </p>
                  <p className="text-xs text-church-neutral-500 mt-1">
                    This is the filename that will be used when uploading
                  </p>
                </div>
              )}
            </div>
          )}
          
          {isUploading && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-church-neutral-700 mb-1">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={resetForm}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isUploading || (!file && !isEditing)}
              className="bg-church-blue hover:bg-church-blue-dark"
            >
              {isEditing ? "Update Sermon" : "Save Sermon"}
            </Button>
          </div>
        </form>
      </div>
      
      <Separator className="my-8" />
      
      <div className="mb-8">
        <h2 className="text-xl font-bold flex items-center gap-2 text-church-blue mb-6">
          <FileAudio className="h-5 w-5" />
          <span>📚 Uploaded Sermons</span>
        </h2>
        
        {sermons.length === 0 ? (
          <div className="text-center py-12 bg-church-neutral-50 rounded-lg">
            <FileAudio className="h-12 w-12 text-church-neutral-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-church-neutral-700">No sermons uploaded yet</h4>
            <p className="text-church-neutral-500">Upload your first sermon to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sermons.map(sermon => (
              <Card key={sermon.id} className="overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <h3 className="font-medium text-church-blue-dark truncate" title={sermon.title}>
                        {sermon.title}
                      </h3>
                      <p className="text-sm text-church-neutral-600">{sermon.speaker}</p>
                      <p className="text-xs text-church-neutral-500 flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" /> {format(new Date(sermon.date), "MMM d, yyyy")}
                      </p>
                    </div>
                    <div className="text-xs text-church-neutral-500 whitespace-nowrap">
                      {formatFileSize(sermon.size)}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0 pb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => handlePlayPause(sermon.id, sermon.url)}
                  >
                    {isPlaying[sermon.id] ? (
                      <>
                        <Pause className="h-4 w-4" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" /> Play
                      </>
                    )}
                  </Button>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditSermon(sermon)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteSermon(sermon.id, sermon.filename)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SermonAudioManager;
