
import React from 'react';
import { Upload, X } from 'lucide-react';

interface FileDisplayProps {
  file: File;
  onRemoveFile: () => void;
}

const FileDisplay = ({ file, onRemoveFile }: FileDisplayProps) => {
  return (
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
          onClick={onRemoveFile}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default FileDisplay;
