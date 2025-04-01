import React, { useState, useEffect } from 'react';
import { Upload, X, Check, AlertCircle, Folder, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { insertOne, findMany } from '@/lib/mongodb';

type ImageCategory = 'hero' | 'sermons' | 'events' | 'leadership' | 'general';

type ImageFile = {
  name: string;
  url: string;
  category: ImageCategory;
  uploadedAt: Date;
};

const ImageUploader = () => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [category, setCategory] = useState<ImageCategory>('leadership');
  const [uploadedImages, setUploadedImages] = useState<ImageFile[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const maxFileSizeMB = 5;
  
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const images = await findMany('images', { category: category === 'general' ? {} : { category } });
        const formattedImages = images.map((img: any) => ({
          name: img.name,
          url: img.url,
          category: img.category as ImageCategory,
          uploadedAt: new Date(img.uploadedAt || Date.now())
        }));
        setUploadedImages(formattedImages);
      } catch (err) {
        console.error('Error fetching images', err);
        const mockImages: ImageFile[] = [
          {
            name: 'hero-image.jpg',
            url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3',
            category: 'hero',
            uploadedAt: new Date(2023, 5, 15)
          },
          {
            name: 'sermon-cover.jpg',
            url: 'https://images.unsplash.com/photo-1508963493744-76fce69379c0',
            category: 'sermons',
            uploadedAt: new Date(2023, 6, 22)
          },
          {
            name: 'event-banner.jpg',
            url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94',
            category: 'events',
            uploadedAt: new Date(2023, 7, 10)
          },
          {
            name: 'pastor-john.jpg',
            url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
            category: 'leadership',
            uploadedAt: new Date(2023, 8, 5)
          },
          {
            name: 'elder-board.jpg',
            url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
            category: 'leadership',
            uploadedAt: new Date(2023, 9, 15)
          }
        ].filter(img => category === 'general' || img.category === category);
        
        setUploadedImages(mockImages);
      }
    };
    
    fetchImages();
  }, [category, refreshTrigger]);
  
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
    
    setIsUploading(true);
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        if (!e.target?.result) {
          throw new Error("Failed to read file");
        }
        
        const imageUrl = e.target.result as string;
        
        const newImage = {
          name: file.name,
          url: imageUrl,
          category,
          uploadedAt: new Date().toISOString()
        };
        
        await insertOne('images', newImage);
        
        const addedImage: ImageFile = {
          name: file.name,
          url: imageUrl,
          category,
          uploadedAt: new Date()
        };
        
        setUploadedImages(prev => [addedImage, ...prev]);
        
        toast({
          title: "Image Uploaded",
          description: `${file.name} has been uploaded successfully.`,
        });
        
        setIsUploading(false);
        setIsUploaded(true);
        
        setRefreshTrigger(prev => prev + 1);
        
        setTimeout(() => {
          setFile(null);
          setIsUploaded(false);
        }, 3000);
      };
      
      reader.onerror = () => {
        throw new Error("Failed to read file");
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error uploading image', err);
      setError('Failed to upload image. Please try again.');
      setIsUploading(false);
      
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your image.",
        variant: "destructive",
      });
    }
  };
  
  const handleImageClick = (image: ImageFile) => {
    setSelectedImage(image);
  };
  
  const handleCopyUrl = () => {
    if (selectedImage) {
      navigator.clipboard.writeText(selectedImage.url);
      toast({
        title: "URL Copied",
        description: "Image URL has been copied to clipboard.",
      });
    }
  };
  
  const handleDelete = async (image: ImageFile) => {
    try {
      await insertOne('deleted_images', {
        name: image.name,
        url: image.url,
        category: image.category,
        deletedAt: new Date().toISOString()
      });
      
      setUploadedImages(prev => prev.filter(img => img.url !== image.url));
      
      if (selectedImage && selectedImage.url === image.url) {
        setSelectedImage(null);
      }
      
      toast({
        title: "Image Deleted",
        description: `${image.name} has been deleted.`,
      });
      
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Error deleting image', err);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the image.",
        variant: "destructive",
      });
    }
  };
  
  const handleRefreshImages = () => {
    setRefreshTrigger(prev => prev + 1);
    toast({
      title: "Refreshed",
      description: "Image library has been refreshed.",
    });
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-church-neutral-900">Upload New Image</h2>
          
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
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              {!file ? (
                <>
                  <div className="p-3 bg-church-blue-light rounded-full">
                    <Upload size={24} className="text-church-blue" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-church-neutral-900">Upload Image</h3>
                    <p className="text-church-neutral-600 text-sm mt-1">Drag & drop or click to select an image</p>
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
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-church-neutral-900">Image Details</h2>
          {selectedImage ? (
            <div className="border border-church-neutral-200 rounded-lg p-4 space-y-4">
              <div className="aspect-video rounded-md overflow-hidden bg-church-neutral-100">
                <img 
                  src={selectedImage.url}
                  alt={selectedImage.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-church-neutral-900 truncate">{selectedImage.name}</h3>
                  <span className="text-xs bg-church-blue-light text-church-blue px-2 py-1 rounded-full">
                    {selectedImage.category}
                  </span>
                </div>
                
                <p className="text-sm text-church-neutral-500">
                  Uploaded: {formatDate(selectedImage.uploadedAt)}
                </p>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Input 
                    value={selectedImage.url} 
                    readOnly
                    className="text-sm"
                  />
                  <Button onClick={handleCopyUrl} variant="outline" size="sm" className="shrink-0">
                    Copy
                  </Button>
                </div>
                
                <div className="pt-2">
                  <Button 
                    onClick={() => handleDelete(selectedImage)} 
                    variant="destructive" 
                    size="sm"
                    className="w-full"
                  >
                    Delete Image
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-church-neutral-200 rounded-lg p-8 flex flex-col items-center justify-center text-center h-64">
              <Image size={40} className="text-church-neutral-300 mb-4" />
              <p className="text-church-neutral-600">Select an image to view details</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-church-neutral-900">Image Library</h2>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handleRefreshImages} 
              variant="outline" 
              size="sm" 
              className="flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </Button>
            <select
              value={category === 'general' ? 'all' : category}
              onChange={(e) => {
                const value = e.target.value;
                setCategory(value === 'all' ? 'general' : value as ImageCategory);
              }}
              className="px-3 py-2 border border-church-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-church-blue"
            >
              <option value="all">All Categories</option>
              <option value="hero">Hero Images</option>
              <option value="sermons">Sermons</option>
              <option value="events">Events</option>
              <option value="leadership">Leadership</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>
        
        <ScrollArea className="h-80 border border-church-neutral-200 rounded-lg p-4">
          {uploadedImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {uploadedImages.map((image, index) => (
                <div 
                  key={index} 
                  className={`cursor-pointer rounded-md overflow-hidden border-2 transition-all ${
                    selectedImage && selectedImage.url === image.url
                      ? 'border-church-blue scale-105 shadow-md'
                      : 'border-transparent hover:border-church-neutral-300'
                  }`}
                  onClick={() => handleImageClick(image)}
                >
                  <div className="aspect-square bg-church-neutral-100">
                    <img 
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2 bg-white">
                    <p className="text-xs font-medium truncate">{image.name}</p>
                    <p className="text-xs text-church-neutral-500">{image.category}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Folder size={40} className="text-church-neutral-300 mb-4" />
              <p className="text-church-neutral-600">No images found</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default ImageUploader;
