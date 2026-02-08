'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import ImageUpload from '@/components/ui/image-upload';
import { Plus, X, Image as ImageIcon } from 'lucide-react';

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

interface Props {
  item: Item;
  onChange: (item: Item) => void;
  onDelete: () => void;
}

/* ================= COMPONENT ================= */

export default function ItemEditor({ item, onChange, onDelete }: Props) {
  const [open, setOpen] = useState(false);

  const addFeature = () =>
    onChange({ ...item, features: [...item.features, ''] });

  const updateFeature = (i: number, v: string) => {
    const next = [...item.features];
    next[i] = v;
    onChange({ ...item, features: next });
  };

  const removeFeature = (i: number) =>
    onChange({
      ...item,
      features: item.features.filter((_, x) => x !== i),
    });

  return (
    <div className={`border rounded-lg ${open ? 'ring-2 ring-blue-500' : ''}`}>
      {/* HEADER */}
      <div
        className="p-4 flex gap-4 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="w-16 h-16 bg-slate-100 rounded flex items-center justify-center overflow-hidden">
          {item.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-slate-400" />
          )}
        </div>

        <div className="flex-1 space-y-1">
          <Input
            value={item.title}
            placeholder="Item Title"
            className="font-bold"
            onClick={(e) => e.stopPropagation()}
            onChange={(e) =>
              onChange({ ...item, title: e.target.value })
            }
          />
          <Input
            value={item.model}
            placeholder="Model No"
            className="text-xs font-mono"
            onClick={(e) => e.stopPropagation()}
            onChange={(e) =>
              onChange({ ...item, model: e.target.value })
            }
          />

          {!open && (
            <p className="text-xs text-slate-500">
              {item.features.length
                ? `${item.features.length} specs`
                : 'No specs'}
            </p>
          )}
        </div>

        <Button
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* BODY */}
      {open && (
        <div className="p-4 border-t space-y-4">
          <ImageUpload
            value={item.image}
            onChange={(v) => onChange({ ...item, image: v })}
            onRemove={() => onChange({ ...item, image: '' })}
          />

          <Textarea
            value={item.description}
            placeholder="Description"
            onChange={(e) =>
              onChange({ ...item, description: e.target.value })
            }
          />

          <div>
            <div className="flex justify-between mb-2">
              <Label>Specifications</Label>
              <Button size="sm" variant="ghost" onClick={addFeature}>
                <Plus className="w-3 h-3 mr-1" /> Add
              </Button>
            </div>

            {item.features.map((f, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Textarea
                  value={f}
                  onChange={(e) =>
                    updateFeature(i, e.target.value)
                  }
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeFeature(i)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
