'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import {
  Plus,
  Trash2,
  ChevronDown,
  X,
  Image as ImageIcon,
  List,
} from 'lucide-react';

import ImageUpload from '@/components/ui/image-upload';

/* ================= TYPES ================= */

export interface Item {
  _id?: string;
  id: string;
  title: string;
  model: string;
  description: string;
  image: string;
  features: string[];
}

export interface Group {
  _id?: string;
  id: string;
  groupTitle: string;
  items: Item[];
}

/* ================= GROUP EDITOR ================= */

export default function GroupEditor({
  group,
  onChange,
  onDelete,
}: {
  group: Group;
  onChange: (g: Group) => void;
  onDelete: () => void;
}) {
  return (
    <Card className="shadow-md">
      <div className="bg-slate-100 px-6 py-4 flex justify-between items-center">
        <Input
          className="font-bold text-lg"
          placeholder="Product Group Title (e.g. Hydraulic Systems)"
          value={group.groupTitle}
          onChange={(e) =>
            onChange({ ...group, groupTitle: e.target.value })
          }
        />
        <Button variant="ghost" onClick={onDelete}>
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </div>

      <CardContent className="p-6 space-y-4">
        {group.items.map((item, index) => (
          <ItemEditor
            key={item.id}
            item={item}
            onChange={(it) => {
              const items = [...group.items];
              items[index] = it;
              onChange({ ...group, items });
            }}
            onDelete={() =>
              onChange({
                ...group,
                items: group.items.filter((_, i) => i !== index),
              })
            }
          />
        ))}

        <Button
          variant="outline"
          onClick={() =>
            onChange({
              ...group,
              items: [
                ...group.items,
                {
                  id: Math.random().toString(),
                  title: '',
                  model: '',
                  description: '',
                  image: '',
                  features: [],
                },
              ],
            })
          }
        >
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </CardContent>
    </Card>
  );
}

/* ================= ITEM EDITOR ================= */

function ItemEditor({
  item,
  onChange,
  onDelete,
}: {
  item: Item;
  onChange: (i: Item) => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const addFeature = () =>
    onChange({ ...item, features: [...item.features, ''] });

  const updateFeature = (idx: number, value: string) => {
    const next = [...item.features];
    next[idx] = value;
    onChange({ ...item, features: next });
  };

  const removeFeature = (idx: number) =>
    onChange({
      ...item,
      features: item.features.filter((_, i) => i !== idx),
    });

  return (
    <div
      className={`border rounded-lg transition-all ${
        expanded
          ? 'ring-2 ring-blue-500 bg-white shadow-lg'
          : 'bg-white shadow-sm'
      }`}
    >
      {/* HEADER */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex gap-4 items-start">
          {/* IMAGE */}
          <div className="w-16 h-16 bg-slate-100 rounded border flex items-center justify-center overflow-hidden">
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image} className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-6 h-6 text-slate-300" />
            )}
          </div>

          {/* TITLE */}
          <div className="flex-1 space-y-2">
            <Input
              placeholder="Product Name"
              value={item.title}
              onChange={(e) =>
                onChange({ ...item, title: e.target.value })
              }
              onClick={(e) => e.stopPropagation()}
              className="font-bold"
            />

            <Input
              placeholder="Model No"
              value={item.model}
              onChange={(e) =>
                onChange({ ...item, model: e.target.value })
              }
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-mono"
            />

            {!expanded && (
              <div className="text-xs text-slate-500">
                {item.features.length
                  ? `• ${item.features.slice(0, 2).join(', ')}`
                  : 'No specifications'}
              </div>
            )}
          </div>

          {/* CONTROLS */}
          <div className="flex gap-1">
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                expanded ? 'rotate-180 text-blue-500' : ''
              }`}
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <X className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>
      </div>

      {/* BODY */}
      {expanded && (
        <div className="px-6 pb-6 pt-4 border-t">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* LEFT */}
            <div className="space-y-4">
              <Label className="text-xs font-bold uppercase">
                Product Image
              </Label>
              <ImageUpload
                value={item.image}
                onChange={(url) =>
                  onChange({ ...item, image: url })
                }
                onRemove={() =>
                  onChange({ ...item, image: '' })
                }
              />

              <Label className="text-xs font-bold uppercase">
                Description
              </Label>
              <Textarea
                value={item.description}
                onChange={(e) =>
                  onChange({
                    ...item,
                    description: e.target.value,
                  })
                }
              />
            </div>

            {/* RIGHT — FEATURES */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-bold uppercase">
                  Specifications
                </Label>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={addFeature}
                >
                  <Plus className="w-3 h-3 mr-1" /> Add
                </Button>
              </div>

              <div className="bg-slate-50 border rounded p-4 space-y-2 max-h-[240px] overflow-y-auto">
                {item.features.length === 0 && (
                  <div className="text-xs text-slate-400 flex flex-col items-center">
                    <List className="w-6 h-6 opacity-30" />
                    No features added
                  </div>
                )}

                {item.features.map((feat, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Textarea
                      value={feat}
                      placeholder="Feature..."
                      onChange={(e) =>
                        updateFeature(idx, e.target.value)
                      }
                      className="resize-none min-h-[38px]"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeFeature(idx)}
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
