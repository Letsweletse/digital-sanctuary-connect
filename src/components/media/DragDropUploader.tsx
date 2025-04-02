
import React, { useState } from 'react';
import { Upload, X, Check, AlertCircle, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ImageCategory } from '@/hooks/useImageLibrary';

interface DragDropUploaderProps {
  onUpload: (file: File, category: ImageCategory) => Promise<void>;
  isUploaded: boolean;
  isUploading: boolean;
  maxFileSizeMB: number;
}

const DragDropUploader: React.FC<DragDropUploaderProps> = ({ 
  onUpload, 
  isUploaded, 
  isUploading,
  maxFileSizeMB 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<ImageCategory>('leadership');
  const { toast } = useToast();
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };
  
  const validateAndSetFile = (file: File) => {
    setError(null);
    
    const fileType = file.type;
    if (!fileType.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
      setError(`Invalid file type. Please upload an image file.`);
      return;
    }
    
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSizeMB) {
      setError(`File is too large. Maximum size is ${maxFileSizeMB}MB.`);
      return;
    }
    
    setFile(file);
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    try {
      await onUpload(file, category);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Warning",
        description: "The image was uploaded but may not display correctly.",
        variant: "warning",
      });
    }
  };
  
  // Function to handle paste from clipboard
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    
    if (!items) return;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          validateAndSetFile(file);
          break;
        }
      }
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
        isDragging 
          ? 'border-church-blue bg-church-blue-light/30' 
          : error 
            ? 'border-red-300 bg-red-50'
            : isUploaded
              ? 'border-green-300 bg-green-50'
              : 'border-church-neutral-300 hover:border-church-blue'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onPaste={handlePaste}
      tabIndex={0}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        {!file ? (
          <>
            <div className="p-3 bg-church-blue-light rounded-full">
              <Upload size={24} className="text-church-blue" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-church-neutral-900">Upload Image</h3>
              <p className="text-church-neutral-600 text-sm mt-1">Drag & drop, paste, or click to select an image</p>
              <p className="text-church-neutral-500 text-xs mt-2">
                Max file size: {maxFileSizeMB}MB
              </p>
            </div>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="btn-primary cursor-pointer text-center"
            >
              Select Image
            </label>
          </>
        ) : isUploaded ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 bg-green-100 rounded-full">
              <Check size={24} className="text-green-600" />
            </div>
            <p className="text-green-700 font-medium">Upload Complete!</p>
            <p className="text-church-neutral-500 text-sm">{file.name}</p>
          </div>
        ) : (
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-church-blue-light rounded">
                  <Image size={18} className="text-church-blue" />
                </div>
                <div className="truncate">
                  <p className="text-church-neutral-900 font-medium truncate max-w-[200px]">{file.name}</p>
                  <p className="text-church-neutral-500 text-xs">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                className="p-1 text-church-neutral-500 hover:text-church-neutral-700"
                onClick={() => setFile(null)}
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-church-neutral-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ImageCategory)}
                  className="w-full px-3 py-2 border border-church-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-blue"
                >
                  <option value="hero">Hero Images</option>
                  <option value="sermons">Sermons</option>
                  <option value="events">Events</option>
                  <option value="leadership">Leadership</option>
                  <option value="general">General</option>
                </select>
              </div>
              
              {!isUploading ? (
                <Button 
                  className="btn-primary w-full"
                  onClick={handleUpload}
                >
                  Upload Image
                </Button>
              ) : (
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-church-blue-light">
                    <div 
                      className="animate-pulse bg-church-blue h-full"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                  <p className="text-center text-church-neutral-600 text-sm mt-2">Uploading...</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg w-full">
            <AlertCircle size={18} />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DragDropUploader;
