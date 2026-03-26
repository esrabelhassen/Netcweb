import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const sections = ['home', 'about', 'contact', 'footer', 'seo'];

export default function AdminContent() {
  const qc = useQueryClient();
  const [activeSection, setActiveSection] = useState('home');
  const [newItem, setNewItem] = useState({ key: '', value: '', section: 'home' });

  const { data: content = [], isLoading } = useQuery({
    queryKey: ['admin-content'],
    queryFn: () => base44.entities.SiteContent.list(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.SiteContent.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-content'] });
      toast.success('Content saved');
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.SiteContent.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-content'] });
      setNewItem({ key: '', value: '', section: activeSection });
      toast.success('Content added');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SiteContent.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-content'] });
      toast.success('Content deleted');
    },
  });

  const sectionContent = content.filter((c) => c.section === activeSection);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Website Content</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your website's text and metadata</p>
      </div>

      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="mb-6 rounded-xl bg-muted">
          {sections.map((s) => (
            <TabsTrigger key={s} value={s} className="rounded-lg capitalize">{s}</TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => (
          <TabsContent key={section} value={section}>
            <div className="space-y-4">
              {sectionContent.map((item) => (
                <ContentItem
                  key={item.id}
                  item={item}
                  onSave={(data) => updateMutation.mutate({ id: item.id, data })}
                  onDelete={() => { if (confirm('Delete this content?')) deleteMutation.mutate(item.id); }}
                  saving={updateMutation.isPending}
                />
              ))}

              {sectionContent.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No content items for this section yet.</p>
              )}

              {/* Add new */}
              <div className="bg-card rounded-2xl border border-dashed border-border p-6">
                <h4 className="text-sm font-semibold mb-3">Add New Content</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Key (e.g. hero_title)"
                    value={newItem.key}
                    onChange={(e) => setNewItem({ ...newItem, key: e.target.value })}
                    className="h-11 rounded-xl"
                  />
                  <Textarea
                    placeholder="Value"
                    value={newItem.value}
                    onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
                    className="rounded-xl md:col-span-1"
                    rows={1}
                  />
                  <Button
                    onClick={() => createMutation.mutate({ ...newItem, section: activeSection })}
                    disabled={!newItem.key || !newItem.value || createMutation.isPending}
                    className="rounded-xl h-11"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function ContentItem({ item, onSave, onDelete, saving }) {
  const [value, setValue] = useState(item.value);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    setValue(item.value);
    setChanged(false);
  }, [item.value]);

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-5">
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{item.key}</span>
        </div>
        <div className="flex gap-2">
          {changed && (
            <Button size="sm" onClick={() => { onSave({ value }); setChanged(false); }} disabled={saving} className="rounded-lg h-8">
              <Save className="w-3 h-3 mr-1" /> Save
            </Button>
          )}
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
            <Trash2 className="w-3.5 h-3.5 text-destructive" />
          </button>
        </div>
      </div>
      <Textarea
        value={value}
        onChange={(e) => { setValue(e.target.value); setChanged(true); }}
        className="rounded-xl bg-background border-border/50"
        rows={Math.max(2, value.split('\n').length)}
      />
    </div>
  );
}