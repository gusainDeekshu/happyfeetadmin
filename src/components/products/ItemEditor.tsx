'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import ImageUpload from '@/components/ui/image-upload';
import { X, Image as ImageIcon } from 'lucide-react';

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
  onChange: (i: Item) => void;
  onDelete: () => void;
}

export default function ItemEditor({ item, onChange, onDelete }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      {/* Header */}
      <div
        className="p-4 flex gap-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="w-16 h-16 bg-slate-100 rounded-md border flex items-center justify-center">
          {item.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-slate-300" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <Input
            placeholder="Product Title"
            value={item.title}
            onChange={(e) =>
              onChange({ ...item, title: e.target.value })
            }
            className="font-bold"
          />
          <Input
            placeholder="Model No."
            value={item.model}
            onChange={(e) =>
              onChange({ ...item, model: e.target.value })
            }
            className="text-xs font-mono"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-slate-300 hover:text-red-600"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Expanded */}
      {isExpanded && (
        <div className="px-6 pb-6 pt-4 border-t space-y-4">
          <Label className="text-xs font-bold uppercase text-slate-500">
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

          <Label className="text-xs font-bold uppercase text-slate-500">
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
            className="h-[120px]"
          />
        </div>
      )}
    </div>
  );
}
