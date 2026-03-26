import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import DataTable from '@/components/admin/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const emptyForm = { name: '', description: '', icon: '', image_url: '', sort_order: 0, status: 'active' };

export default function AdminCategories() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const qc = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => base44.entities.Category.list('-created_date'),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editing
      ? base44.entities.Category.update(editing.id, data)
      : base44.entities.Category.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-categories'] });
      setFormOpen(false);
      setEditing(null);
      setForm(emptyForm);
      toast.success(editing ? 'Category updated' : 'Category created');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Category.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Category deleted');
    },
  });

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({
      name: cat.name || '',
      description: cat.description || '',
      icon: cat.icon || '',
      image_url: cat.image_url || '',
      sort_order: cat.sort_order || 0,
      status: cat.status || 'active',
    });
    setFormOpen(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm({ ...form, image_url: file_url });
  };

  const columns = [
    { key: 'name', label: 'Name', render: (r) => <span className="font-medium">{r.name}</span> },
    { key: 'description', label: 'Description', render: (r) => <span className="text-muted-foreground text-xs line-clamp-1 max-w-xs">{r.description}</span> },
    { key: 'status', label: 'Status', render: (r) => (
      <Badge variant="secondary" className={`rounded-full text-xs ${r.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
        {r.status}
      </Badge>
    )},
    { key: 'sort_order', label: 'Order' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage service categories</p>
        </div>
        <Button onClick={openNew} className="rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        isLoading={isLoading}
        searchFields={['name', 'description']}
        actions={(row) => (
          <div className="flex gap-1">
            <button onClick={(e) => { e.stopPropagation(); openEdit(row); }} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); if(confirm('Delete this category?')) deleteMutation.mutate(row.id); }} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
              <Trash2 className="w-3.5 h-3.5 text-destructive" />
            </button>
          </div>
        )}
      />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Category' : 'New Category'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-4">
            <Input placeholder="Category name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="h-11 rounded-xl" />
            <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl" />
            <Input placeholder="Icon name (lucide)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="h-11 rounded-xl" />
            <div>
              <label className="text-sm font-medium mb-1 block">Image</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
              {form.image_url && <img src={form.image_url} alt="" className="w-16 h-16 rounded-xl object-cover mt-2" />}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input type="number" placeholder="Sort order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className="h-11 rounded-xl" />
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="submit" disabled={saveMutation.isPending} className="rounded-xl">
                {saveMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}