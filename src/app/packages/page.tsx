// src/app/admin/packages/page.tsx
'use client';
import { useTravelContent } from '@/hooks/useTravelContent';
import GroupEditor from '@/components/products/GroupEditor'; // Reuse existing editor
import { useState } from 'react';

export default function AdminPackagesPage() {
  const { fetchAll, create } = useTravelContent('packages');
  const [formData, setFormData] = useState({ title: '', slug: '', image: '', groups: [] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await create.mutateAsync(formData);
    alert("Package added! Check the user site.");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Destinations</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
        <input placeholder="Title" onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border p-2" />
        <input placeholder="Slug (e.g. europe-tour)" onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full border p-2" />
        <GroupEditor 
          group={{ groupTitle: 'Itinerary', items: formData.groups }} 
          onChange={g => setFormData({...formData, groups: g.items})}
          onDelete={() => {}}
        />
        <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded">Save Destination</button>
      </form>
    </div>
  );
}