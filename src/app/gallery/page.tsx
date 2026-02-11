'use client';

import React from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api'; 
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export default function AdminGallery() {
  const queryClient = useQueryClient();
  const { data: items } = useQuery({ 
    queryKey: ['adminGallery'], 
    queryFn: () => api.get('/admin/gallery').then(res => res.data) 
  });

  const handleUpload = (result: any) => {
    const { secure_url, public_id, resource_type, original_filename } = result.info;
    api.post('/admin/gallery', {
      title: original_filename || 'New Media',
      mediaUrl: secure_url,
      publicId: public_id,
      resourceType: resource_type
    }).then(() => queryClient.invalidateQueries({ queryKey: ['adminGallery'] }));
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this media?')) {
      api.delete(`/admin/gallery/${id}`).then(() => 
        queryClient.invalidateQueries({ queryKey: ['adminGallery'] })
      );
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-happy-dark">Admin Gallery Manager</h1>
        <CldUploadWidget 
          uploadPreset="happy_feet_preset" 
          options={{ resourceType: "auto" }} 
          onSuccess={handleUpload}
        >
          {({ open }) => (
            <Button onClick={() => open?.()} className="bg-happy-yellow text-happy-dark font-bold px-8">
              + Add Media (Image/Video)
            </Button>
          )}
        </CldUploadWidget>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {items?.map((item: any) => (
          <div key={item._id} className="relative group rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            {item.resourceType === 'video' ? (
              <video src={item.mediaUrl} className="h-56 w-full object-cover" muted />
            ) : (
              <img src={item.mediaUrl} className="h-56 w-full object-cover" />
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
              <Button variant="destructive" size="icon" onClick={() => handleDelete(item._id)}>
                <Trash2 size={20} />
              </Button>
            </div>
            <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded-md text-[10px] font-bold uppercase">
              {item.resourceType}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}