"use client";

import React, { useState } from "react";
import { useContent } from "@/hooks/useContent";
import { useToggleFeatured } from '@/hooks/useFeatured';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Loader2, Plus, Pencil, Trash2, ArrowLeft, Save } from "lucide-react";

import GroupEditor, { Group } from "@/components/products/GroupEditor";

/* ================= TYPES ================= */

interface ProductPageData {
  _id: string;
  title: string;
  slug: string;
  image?: string;
  shortDescription?: string;
  groups: Group[];
  isFeatured?: boolean;
}

type ProductFormData = Omit<ProductPageData, "_id">;

/* ================= HELPERS ================= */

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


function getProductCoverImage(data: ProductFormData): string {
  for (const g of data.groups) {
    for (const i of g.items) {
      if (i.image && i.image.trim() !== "") return i.image;
    }
  }
  return "/images/placeholders/product-page.jpg";
}

function getProductShortDescription(data: ProductFormData): string {
  return data.groups?.[0]?.groupTitle || data.title || "Product Category";
}

/* ================= MAIN PAGE ================= */

export default function ProductsPage() {
  const { fetchAll, create, update, remove } = useContent("products");
const toggleFeaturedMutation = useToggleFeatured();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState: ProductFormData = {
    title: "",
    slug: "",
    image: "",
    shortDescription: "",
    groups: [],
  };

  const [formData, setFormData] = useState<ProductFormData>(initialFormState);

  /* ================= ACTIONS ================= */
const onFeaturedClick = (
  e: React.MouseEvent,
  id: string,
  current: any
) => {
  e.stopPropagation();

  toggleFeaturedMutation.mutate({
    id,
    type: 'products',
    isFeatured: !current,
  });
};

  const openCreate = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsEditorOpen(true);
  };

  const openEdit = (item: ProductPageData) => {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      slug: item.slug,
      image: item.image || "",
      shortDescription: item.shortDescription || "",
      groups: item.groups.map((g) => ({
        ...g,
        id: g._id || Math.random().toString(36),
        items: g.items.map((i) => ({
          ...i,
          id: i._id || Math.random().toString(36),
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
      image: getProductCoverImage(formData),
      shortDescription: getProductShortDescription(formData),
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

  const pages = (fetchAll.data || []) as ProductPageData[];

  /* ================= EDITOR ================= */

  if (isEditorOpen) {
    return (
      <div className="flex flex-col h-full ">
        {/* Top Bar */}
        <div className="bg-white border-b px-8 py-4 flex justify-between shadow-sm">
          <Button variant="ghost" onClick={closeEditor}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-hercules-gold border text-[#0f2a55] font-bold px-6
             hover:bg-[#d4a63f] hover:text-white transition-colors"
          >
            <Save className="w-4 h-4 mr-2" /> Save Category
          </Button>
        </div>

        {/* Body */}
        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
          {/* Category Config */}
          <Card>
            <CardContent className="p-8 space-y-2">
              <Label className="uppercase text-xs font-bold text-slate-500">
                Category Name
              </Label>

              <Input
                className="h-12 text-lg font-bold"
                placeholder="e.g. Basketball Equipment"
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
                  {formData.slug || "auto-generated"}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Groups */}
          <div className="space-y-8">
            {formData.groups.map((group, index) => (
              <GroupEditor
                key={group.id}
                group={group}
                onChange={(g) => {
                  const groups = [...formData.groups];
                  groups[index] = g;
                  setFormData({ ...formData, groups });
                }}
                onDelete={() =>
                  setFormData({
                    ...formData,
                    groups: formData.groups.filter((_, i) => i !== index),
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
                      id: Math.random().toString(),
                      groupTitle: "",
                      items: [],
                    },
                  ],
                })
              }
            >
              <Plus className="w-4 h-4 mr-2" /> Add Product Group
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ================= LIST VIEW ================= */

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between border-b pb-6">
        <h1 className="text-4xl font-extrabold text-[#0f2a55]">
          Product Categories
        </h1>
        <Button
          onClick={openCreate}
          className="bg-hercules-gold border text-[#0f2a55] font-bold px-6
             hover:bg-[#d4a63f] hover:text-white transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Groups</TableHead>

              <TableHead>Items</TableHead>
              <TableHead>Featured</TableHead>

              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {pages.map((p) => {
              const itemCount =
                p.groups?.reduce((a, g) => a + g.items.length, 0) || 0;

              return (
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
                  
                  <TableCell>{itemCount} Items</TableCell>
                  <TableCell
  onClick={(e) => onFeaturedClick(e, p._id, p.isFeatured)}
>
  <Badge
    className={`cursor-pointer transition-colors ${
      p.isFeatured
        ? 'bg-green-600 text-white'
        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
    }`}
  >
    {p.isFeatured ? 'Featured' : 'Not Featured'}
  </Badge>
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
                        remove.mutate(p._id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
