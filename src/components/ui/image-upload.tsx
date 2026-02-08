'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '@/services/api';

interface ImageUploadProps {
  value: string; // The current Image URL
  onChange: (url: string) => void; // Function to update parent state
  onRemove: (url: string) => void; // Function to clear parent state
}

export default function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    setIsUploading(true);
    try {
      // 1. Send file to backend
      const url = await uploadImage(e.target.files[0]);
      // 2. Update parent form with the new URL
      onChange(url);
    } catch (error) {
      console.error("Upload failed", error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (value) {
    return (
      <div className="relative w-full h-64 md:w-64 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 group">
        {/* Preview Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
            src={value} 
            alt="Upload" 
            className="object-cover w-full h-full" 
        />
        
        {/* Overlay with Delete Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button 
            type="button" 
            variant="destructive" 
            size="sm" 
            onClick={() => onRemove(value)}
            className="bg-red-600 hover:bg-red-700"
            >
            <Trash2 className="w-4 h-4 mr-2" />
            Remove Image
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-64">
      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 border-slate-300 hover:bg-slate-100 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
          {isUploading ? (
            <>
                <Loader2 className="w-10 h-10 mb-3 animate-spin text-blue-600" />
                <p className="text-sm font-medium">Uploading...</p>
            </>
          ) : (
            <>
              <UploadCloud className="w-10 h-10 mb-3 text-slate-400" />
              <p className="text-sm font-semibold text-slate-700">Click to upload</p>
              <p className="text-xs text-slate-500 mt-1">SVG, PNG, JPG or GIF</p>
            </>
          )}
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="image/*" 
          onChange={handleUpload} 
          disabled={isUploading} 
        />
      </label>
    </div>
  );
}