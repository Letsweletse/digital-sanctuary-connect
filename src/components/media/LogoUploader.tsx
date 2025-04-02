
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Image, X, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLogo } from '../layout/LogoContext';

const LogoUploader: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { logoUrl, setLogoUrl } = useLogo();

  useEffect(() => {
    // Cleanup function for the preview URL
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-church-blue', 'bg-church-blue-light/30');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-church-blue', 'bg-church-blue-light/30');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-church-blue', 'bg-church-blue-light/30');
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    setError(null);
    
    // Validate file type
    if (!file.type.match('image.*')) {
      setError('Please select an image file (JPEG, PNG, SVG)');
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should not exceed 2MB');
      return;
    }
    
    // Create a preview
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setSelectedFile(file);
  };

  const uploadLogo = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    // In a real implementation, you would upload the file to a server.
    // For now, we'll just simulate the upload with a timeout and use the preview URL
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Use the preview URL as the logo URL
      setLogoUrl(previewUrl);
      
      setIsUploaded(true);
      toast({
        title: "Logo updated successfully",
        description: "Your logo has been updated and is now visible on the website.",
      });
      
      // Reset the uploaded state after a short delay
      setTimeout(() => {
        setIsUploaded(false);
        setSelectedFile(null);
      }, 3000);
    } catch (error) {
      setError('Failed to upload logo. Please try again.');
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your logo.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-church-neutral-900">Church Logo</h3>
        {logoUrl && (
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setLogoUrl(null)}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            Reset Logo
          </Button>
        )}
      </div>
      
      {/* Current Logo Preview */}
      {logoUrl && !previewUrl && (
        <div className="p-4 border rounded-md mb-4">
          <p className="text-sm text-church-neutral-500 mb-2">Current Logo:</p>
          <div className="flex justify-center bg-church-neutral-100 rounded p-4">
            <img 
              src={logoUrl} 
              alt="Current Church Logo" 
              className="h-20 object-contain"
            />
          </div>
        </div>
      )}
      
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          isUploaded ? 'border-green-300 bg-green-50' :
          error ? 'border-red-300 bg-red-50' :
          'border-church-neutral-300 hover:border-church-blue'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!selectedFile ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-3 bg-church-blue-light rounded-full">
              <Upload size={24} className="text-church-blue" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-church-neutral-900">Upload Logo</h3>
              <p className="text-church-neutral-600 text-sm mt-1">
                Drag & drop your church logo or click to browse
              </p>
              <p className="text-church-neutral-500 text-xs mt-2">
                Supported formats: JPEG, PNG, SVG (max 2MB)
              </p>
              <p className="text-church-neutral-500 text-xs">
                Recommended size: 300x100 pixels
              </p>
            </div>
            <input
              type="file"
              id="logo-upload"
              className="hidden"
              accept="image/jpeg,image/png,image/svg+xml"
              onChange={handleFileChange}
            />
            <label
              htmlFor="logo-upload"
              className="btn-primary cursor-pointer text-center"
            >
              Select Logo
            </label>
          </div>
        ) : isUploaded ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 bg-green-100 rounded-full">
              <Check size={24} className="text-green-600" />
            </div>
            <p className="text-green-700 font-medium">Logo Updated Successfully!</p>
            <p className="text-church-neutral-500 text-sm">{selectedFile.name}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Logo Preview"
                    className="h-16 object-contain bg-white p-2 rounded border"
                  />
                )}
                <div>
                  <p className="text-church-neutral-900 font-medium">{selectedFile.name}</p>
                  <p className="text-church-neutral-500 text-xs">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="p-1 text-church-neutral-500 hover:text-church-neutral-700"
                type="button"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Upload Button */}
            {!isUploading ? (
              <Button
                className="btn-primary w-full"
                onClick={uploadLogo}
              >
                Update Logo
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
        )}
        
        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg mt-4">
            <AlertCircle size={18} />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>
      
      {/* Guidelines */}
      <div className="bg-church-neutral-50 p-4 rounded-md">
        <h4 className="text-sm font-medium text-church-neutral-800 mb-2">Logo Guidelines:</h4>
        <ul className="text-xs text-church-neutral-600 space-y-1 list-disc pl-5">
          <li>Use a transparent background for best results</li>
          <li>Ensure the logo is high-quality and clear</li>
          <li>Horizontal logos work best in the navigation header</li>
          <li>Logo will automatically resize to fit the header area</li>
        </ul>
      </div>
    </div>
  );
};

export default LogoUploader;
