'use client';

import React, { useState } from 'react';
import { useContent } from '@/hooks/useContent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Pencil, Trash2, ImageIcon } from 'lucide-react';
// 1. IMPORT THE UPLOAD COMPONENT
import ImageUpload from '@/components/ui/image-upload';

export default function ProjectsPage() {
  const { fetchAll, create, update, remove } = useContent('projects');
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [formData, setFormData] = useState({ title: '', image: '', description: '' });

  // Open Modal for Create
  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ title: '', image: '', description: '' });
    setIsOpen(true);
  };

  // Open Modal for Edit
  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ 
      title: item.title, 
      image: item.image, 
      description: item.description || '' 
    });
    setIsOpen(true);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      await update.mutateAsync({ id: editingItem._id, data: formData });
    } else {
      await create.mutateAsync(formData);
    }
    setIsOpen(false);
  };

  if (fetchAll.isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-blue-900 w-8 h-8" /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0f2a55]">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your portfolio and case studies.</p>
        </div>
        <Button onClick={handleCreate} className="bg-hercules-gold text-[#0f2a55] hover:bg-yellow-500 font-bold">
          <Plus className="w-4 h-4 mr-2"/> Add Project
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[100px]">Preview</TableHead>
              <TableHead>Project Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fetchAll.data?.map((item: any) => (
              <TableRow key={item._id} className="hover:bg-slate-50/50">
                <TableCell>
                  <div className="w-16 h-12 bg-slate-100 rounded overflow-hidden relative border">
                    {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon className="w-6 h-6 text-slate-300 absolute inset-0 m-auto" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-[#0f2a55]">{item.title}</TableCell>
                <TableCell className="text-gray-500 max-w-md truncate">{item.description || '-'}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                    <Pencil className="w-4 h-4 text-blue-600"/>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => {
                    if(confirm('Delete this project?')) remove.mutate(item._id);
                  }}>
                    <Trash2 className="w-4 h-4 text-red-500"/>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {fetchAll.data?.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                        No projects found. Add one to get started.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Project' : 'Create Project'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Project Title</Label>
              <Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="e.g. Indoor Stadium Pune" />
            </div>

            {/* 2. REPLACED INPUT WITH IMAGE UPLOAD COMPONENT */}
            <div className="grid gap-2">
              <Label>Project Image</Label>
              <ImageUpload 
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                onRemove={() => setFormData({ ...formData, image: '' })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Short description..." />
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={create.isPending || update.isPending}>
                    {create.isPending || update.isPending ? <Loader2 className="animate-spin w-4 h-4" /> : 'Save Changes'}
                </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}