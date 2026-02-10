'use client';

import React, { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { useTravelContent } from '@/hooks/useTravelContent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

export default function PackageDashboard() {
  // Destructure hooks from your travel content service
  const { fetchAll, create, remove } = useTravelContent('packages');

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: 0,
    location: '',
    image: '',
    category: 'Group Tour',
  });

  // Handle successful Cloudinary upload
  const handleUploadSuccess = (result: any) => {
    if (result.info && typeof result.info !== 'string') {
      const imageUrl = result.info.secure_url;
      setFormData((prev) => ({ ...prev, image: imageUrl }));
      console.log('✅ Image uploaded to Cloudinary:', imageUrl);
    }
  };

  const handleSubmit = async () => {
    if (!formData.image) {
      alert("Please upload an image first!");
      return;
    }
    try {
      await create.mutateAsync(formData);
      setIsAdding(false);
      setFormData({ title: '', price: 0, location: '', image: '', category: 'Group Tour' });
    } catch (error) {
      console.error("Failed to save package:", error);
    }
  };

  if (fetchAll.isLoading) return <div className="p-10 text-center">Syncing Happy Feet Database...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Tour Packages</h1>
        <Button onClick={() => setIsAdding(!isAdding)} variant={isAdding ? "outline" : "default"}>
          {isAdding ? 'Cancel' : 'Add New Trip'}
        </Button>
      </div>

      {isAdding && (
        <div className="p-6 border-2 border-blue-100 rounded-2xl bg-white shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Trip Details</label>
              <Input 
                placeholder="Package Title (e.g. Manali Adventure)" 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
              />
              <Input 
                placeholder="Price (INR)" 
                type="number" 
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} 
              />
              <Input 
                placeholder="Location" 
                onChange={(e) => setFormData({...formData, location: e.target.value})} 
              />
            </div>

            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50">
              {formData.image ? (
                <div className="relative w-full h-48">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover rounded-lg shadow-md" />
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => setFormData({...formData, image: ''})}
                  >Remove</Button>
                </div>
              ) : (
                <CldUploadWidget 
                  uploadPreset="happy_feet_preset" // MUST match your Cloudinary Unsigned Preset
                  onSuccess={handleUploadSuccess}
                >
                  {({ open }) => (
                    <Button 
                      type="button" 
                      onClick={() => open()} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 h-auto text-lg"
                    >
                      📸 Upload Tour Photo
                    </Button>
                  )}
                </CldUploadWidget>
              )}
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={!formData.image || !formData.title}
            className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-bold"
          >
            Save Complete Package
          </Button>
        </div>
      )}

      <div className="border rounded-2xl overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <th className="p-4">Image</th>
              <th className="p-4 text-left">Tour Name</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-center">Actions</th>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fetchAll.data?.map((pkg: any) => (
              <TableRow key={pkg._id} className="hover:bg-blue-50/30 transition">
                <TableCell className="p-4">
                  <img src={pkg.image} className="w-20 h-12 object-cover rounded-md border" />
                </TableCell>
                <TableCell className="p-4 font-bold text-blue-900">{pkg.title}</TableCell>
                <TableCell className="p-4 text-gray-600">{pkg.location}</TableCell>
                <TableCell className="p-4 font-mono font-bold">₹{pkg.price}</TableCell>
                <TableCell className="p-4 text-center">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => { if(confirm('Delete this tour?')) remove.mutate(pkg._id) }}
                  >
                    Delete
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