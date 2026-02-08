'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import ItemEditor, { Item } from './ItemEditor';

/* ================= TYPES ================= */

export interface Group {
  _id?: string;
  id: string;
  groupTitle: string;
  items: Item[];
}

interface Props {
  group: Group;
  onChange: (group: Group) => void;
  onDelete: () => void;
}

/* ================= COMPONENT ================= */

export default function GroupEditor({ group, onChange, onDelete }: Props) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex gap-4">
          <Input
            placeholder="Group Title"
            value={group.groupTitle}
            onChange={(e) =>
              onChange({ ...group, groupTitle: e.target.value })
            }
          />
          <Button variant="ghost" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid xl:grid-cols-2 gap-4">
          {group.items.map((item, i) => (
            <ItemEditor
              key={item.id}
              item={item}
              onChange={(ni) => {
                const next = [...group.items];
                next[i] = ni;
                onChange({ ...group, items: next });
              }}
              onDelete={() =>
                onChange({
                  ...group,
                  items: group.items.filter((_, x) => x !== i),
                })
              }
            />
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() =>
            onChange({
              ...group,
              items: [
                ...group.items,
                {
                  id: crypto.randomUUID(),
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
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </Button>
      </CardContent>
    </Card>
  );
}
