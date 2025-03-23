
import React, { useState } from 'react';
import { Upload, X, Check, AlertCircle } from 'lucide-react';

type UploadProps = {
  title: string;
  description: string;
  acceptedFileTypes: string;
  maxFileSizeMB: number;
  onUpload?: (file: File) => void;
};

const MediaUploader = ({ 
  title, 
  description, 
  acceptedFileTypes, 
  maxFileSizeMB,
  onUpload 
}: UploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  
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
    
    // Check file type
    const fileType = file.type;
    if (!fileType.match(acceptedFileTypes)) {
      setError(`Invalid file type. Please upload ${acceptedFileTypes.replace('audio/', 'audio').replace('image/', 'image')} files.`);
      return;
    }
    
    // Check file size
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
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setIsUploaded(true);
      
      if (onUpload) {
        onUpload(file);
      }
      
      // Reset after 3 seconds
      setTimeout(() => {
        setFile(null);
        setIsUploaded(false);
      }, 3000);
    }, 2000);
  };
  
  return (
    <div className="w-full">
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
                <h3 className="text-lg font-semibold text-church-neutral-900">{title}</h3>
                <p className="text-church-neutral-600 text-sm mt-1">{description}</p>
                <p className="text-church-neutral-500 text-xs mt-2">
                  Max file size: {maxFileSizeMB}MB
                </p>
              </div>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept={acceptedFileTypes}
                onChange={handleFileChange}
              />
              <label
                htmlFor="file-upload"
                className="btn-primary cursor-pointer text-center"
              >
                Select File
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
                    <Upload size={18} className="text-church-blue" />
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
              
              {!isUploading ? (
                <button 
                  className="btn-primary w-full"
                  onClick={handleUpload}
                >
                  Upload File
                </button>
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
          
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg w-full">
              <AlertCircle size={18} />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaUploader;
