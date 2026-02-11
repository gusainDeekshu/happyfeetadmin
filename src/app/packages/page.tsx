'use client';

import React, { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { useTravelContent } from '@/hooks/useTravelContent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, TableBody, TableCell, TableHeader, TableRow 
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export default function PackageDashboard() {
  const { fetchAll, create, update, remove } = useTravelContent('packages');

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '', slug: '', description: '', price: 0, 
    duration: '', location: '', image: '', category: 'Group Tour',
  });

  const generateSlug = (title: string) => {
    return title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
  };

  const handleEdit = (pkg: any) => {
    setFormData({ ...pkg });
    setEditingId(pkg._id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tour?')) return;
    setDeletingId(id);
    try {
      await remove.mutateAsync(id);
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleUploadSuccess = (result: any) => {
    if (result.info && typeof result.info !== 'string') {
      setFormData((prev) => ({ ...prev, image: result.info.secure_url }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.image || !formData.title || !formData.description || !formData.duration) {
      alert("All fields (Title, Duration, Description, and Image) are required!");
      return;
    }

    try {
      if (editingId) {
        await update.mutateAsync({ id: editingId, data: formData });
      } else {
        await create.mutateAsync(formData);
      }
      resetForm();
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ 
      title: '', slug: '', description: '', price: 0, 
      duration: '', location: '', image: '', category: 'Group Tour' 
    });
  };

  if (fetchAll.isLoading) return <div className="p-10 text-center">Syncing Packages...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Tour Packages</h1>
        <Button onClick={() => isAdding ? resetForm() : setIsAdding(true)} variant={isAdding ? "outline" : "default"}>
          {isAdding ? 'Cancel' : 'Add New Trip'}
        </Button>
      </div>

      {isAdding && (
        <div className="p-6 border-2 border-blue-100 rounded-2xl bg-white shadow-sm space-y-6">
          <h2 className="text-xl font-semibold">{editingId ? 'Edit Package' : 'Create New Package'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input 
                placeholder="Title" value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value, slug: generateSlug(e.target.value)})} 
              />
              <Input 
                placeholder="Duration (e.g. 5 Days / 4 Nights)" value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})} 
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  placeholder="Price" type="number" value={formData.price}
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} 
                />
                <Select onValueChange={(v) => setFormData({...formData, category: v})} value={formData.category}>
                  <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    {['Group Tour', 'Honeymoon', 'Adventure', 'Cultural', 'Family'].map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input 
                placeholder="Location" value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})} 
              />
              <Textarea 
                placeholder="Description" value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
              />
            </div>

            {/* PREVIEW SECTION */}
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 bg-gray-50 min-h-[300px]">
              {formData.image ? (
                <div className="relative w-full h-full min-h-[250px]">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover rounded-lg shadow-md" />
                  <Button 
                    variant="destructive" size="sm" className="absolute top-2 right-2"
                    onClick={() => setFormData({...formData, image: ''})}
                  >
                    Remove Photo
                  </Button>
                </div>
              ) : (
                <CldUploadWidget uploadPreset="happy_feet_preset" onSuccess={handleUploadSuccess}>
                  {({ open }) => (
                    <Button 
                      type="button" onClick={() => open?.()} 
                      className="bg-blue-600 hover:bg-blue-700 h-16 text-lg"
                    >
                      📸 Upload Tour Photo
                    </Button>
                  )}
                </CldUploadWidget>
              )}
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-bold">
            {editingId ? 'Update Package' : 'Save Complete Package'}
          </Button>
        </div>
      )}

      {/* Table Section */}
      <div className="border rounded-2xl overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50"><TableRow>
            <th className="p-4">Image</th><th className="p-4 text-left">Tour Name</th><th className="p-4 text-center">Actions</th>
          </TableRow></TableHeader>
          <TableBody>
            {fetchAll.data?.map((pkg: any) => (
              <TableRow key={pkg._id} className="hover:bg-blue-50/30">
                <TableCell className="p-4"><img src={pkg.image} className="w-20 h-12 object-cover rounded border" /></TableCell>
                <TableCell className="p-4 font-bold">{pkg.title}</TableCell>
                <TableCell className="p-4 text-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(pkg)} disabled={deletingId === pkg._id}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(pkg._id)} disabled={deletingId === pkg._id}>
                    {deletingId === pkg._id ? 'Deleting...' : 'Delete'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}