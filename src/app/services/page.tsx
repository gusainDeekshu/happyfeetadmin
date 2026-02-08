'use client';

import React, { useState } from 'react';
import { useContent } from '@/hooks/useContent';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  Save,
  X,
  Image as ImageIcon,
  ChevronDown,
  List,
} from 'lucide-react';

import ImageUpload from '@/components/ui/image-upload';
import GroupEditor from '@/components/products/GroupEditor';

/* =========================================================
   TYPES
========================================================= */

interface Item {
  _id?: string;
  id: string;
  title: string;
  model: string;
  description: string;
  image: string;
  features: string[];
}

interface Group {
  _id?: string;
  id: string;
  groupTitle: string;
  items: Item[];
}

interface ServicePageData {
  _id: string;
  title: string;
  slug: string;
  groups: Group[];
}

type ServiceFormData = Omit<ServicePageData, '_id'>;

/* =========================================================
   HELPERS
========================================================= */

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getCoverImage(data: ServiceFormData): string {
  for (const g of data.groups) {
    for (const i of g.items) {
      if (i.image && i.image.trim()) return i.image;
    }
  }
  return '/images/placeholders/service-page.jpg';
}

function getShortDescription(data: ServiceFormData): string {
  return data.groups?.[0]?.groupTitle || data.title || 'Service Category';
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function ServicesPage() {
  const { fetchAll, create, update, remove } = useContent('services');

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState: ServiceFormData = {
    title: '',
    slug: '',
    groups: [],
  };

  const [formData, setFormData] =
    useState<ServiceFormData>(initialFormState);

  /* ================= ACTIONS ================= */

  const openCreate = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsEditorOpen(true);
  };

  const openEdit = (page: ServicePageData) => {
    setEditingId(page._id);
    setFormData({
      title: page.title,
      slug: page.slug,
      groups: page.groups.map((g) => ({
        ...g,
        id: g._id || crypto.randomUUID(),
        items: g.items.map((i) => ({
          ...i,
          id: i._id || crypto.randomUUID(),
          features: i.features || [],
        })),
      })),
    });
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    const payload = {
      title: formData.title,
      slug: formData.slug,
      image: getCoverImage(formData),
      shortDescription: getShortDescription(formData),
      groups: formData.groups.map((g) => ({
        groupTitle: g.groupTitle,
        items: g.items.map((i) => ({
          title: i.title,
          model: i.model,
          description: i.description,
          image: i.image,
          features: i.features,
        })),
      })),
    };

    if (editingId) {
      await update.mutateAsync({ id: editingId, data: payload });
    } else {
      await create.mutateAsync(payload);
    }

    closeEditor();
  };

  /* ================= LOADING ================= */

  if (fetchAll.isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-blue-900" />
      </div>
    );
  }

  const pages = (fetchAll.data || []) as ServicePageData[];

  /* =========================================================
     EDITOR VIEW
  ========================================================= */

  if (isEditorOpen) {
    return (
      <div className="flex flex-col h-full bg-slate-50">
        {/* TOP BAR */}
        <div className="bg-white border-b px-8 py-4 flex justify-between shadow-sm">
          <Button variant="ghost" onClick={closeEditor}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          <Button
            onClick={handleSubmit}
            className="bg-hercules-gold text-[#0f2a55] font-bold px-6
                       hover:bg-[#d4a63f] hover:text-white transition-colors"
          >
            <Save className="w-4 h-4 mr-2" /> Save Service Category
          </Button>
        </div>

        {/* BODY */}
        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
          {/* CATEGORY CONFIG */}
          <Card>
            <CardContent className="p-8 space-y-2">
              <Label className="uppercase text-xs font-bold text-slate-500">
                Service Category
              </Label>

              <Input
                className="h-12 text-lg font-bold"
                placeholder="e.g. Lighting & Seating Solutions"
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setFormData({
                    ...formData,
                    title,
                    slug: generateSlug(title),
                  });
                }}
              />

              <div className="text-xs text-slate-500">
                URL Slug:
                <code className="ml-2 bg-slate-100 px-2 py-1 rounded font-mono">
                  {formData.slug || 'auto-generated'}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* GROUPS */}
          <div className="space-y-8">
            {formData.groups.map((group, gi) => (
              <GroupEditor
                key={group.id}
                group={group}
                onChange={(g) => {
                  const next = [...formData.groups];
                  next[gi] = g;
                  setFormData({ ...formData, groups: next });
                }}
                onDelete={() =>
                  setFormData({
                    ...formData,
                    groups: formData.groups.filter((_, i) => i !== gi),
                  })
                }
              />
            ))}

            <Button
              variant="outline"
              onClick={() =>
                setFormData({
                  ...formData,
                  groups: [
                    ...formData.groups,
                    {
                      id: crypto.randomUUID(),
                      groupTitle: '',
                      items: [],
                    },
                  ],
                })
              }
            >
              <Plus className="w-4 h-4 mr-2" /> Add Service Group
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     LIST VIEW
  ========================================================= */

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between border-b pb-6">
        <h1 className="text-4xl font-extrabold text-[#0f2a55]">
          Service Categories
        </h1>

        <Button
          onClick={openCreate}
          className="bg-hercules-gold border text-[#0f2a55] font-bold px-6
             hover:bg-[#d4a63f] hover:text-white transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Service Category
        </Button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Groups</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {pages.map((p) => (
              <TableRow key={p._id} onClick={() => openEdit(p)}>
                <TableCell className="font-bold">{p.title}</TableCell>
                <TableCell>
                  <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                    {p.slug}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge>{p.groups.length} Groups</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(p);
                    }}
                  >
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-2 text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirm('Delete?') && remove.mutate(p._id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
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

/* =========================================================
   GROUP EDITOR + ITEM EDITOR
   (Same UX as Products, includes FEATURES)
========================================================= */
