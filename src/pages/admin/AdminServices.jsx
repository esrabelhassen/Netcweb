import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import DataTable from '@/components/admin/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const emptyForm = {
  title: '', description: '', long_description: '', category_id: '', price: 0,
  price_label: '', type: 'dev', images: [], cta_type: 'contact', features: [], status: 'active', sort_order: 0,
};

export default function AdminServices() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [featuresText, setFeaturesText] = useState('');
  const qc = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: () => base44.entities.Service.list('-created_date'),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => base44.entities.Category.list(),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => {
      const payload = { ...data, features: featuresText.split('\n').filter(Boolean) };
      return editing ? base44.entities.Service.update(editing.id, payload) : base44.entities.Service.create(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-services'] });
      setFormOpen(false);
      setEditing(null);
      setForm(emptyForm);
      setFeaturesText('');
      toast.success(editing ? 'Service updated' : 'Service created');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Service.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Service deleted');
    },
  });

  const openEdit = (svc) => {
    setEditing(svc);
    setForm({
      title: svc.title || '', description: svc.description || '', long_description: svc.long_description || '',
      category_id: svc.category_id || '', price: svc.price || 0, price_label: svc.price_label || '',
      type: svc.type || 'dev', images: svc.images || [], cta_type: svc.cta_type || 'contact',
      features: svc.features || [], status: svc.status || 'active', sort_order: svc.sort_order || 0,
    });
    setFeaturesText((svc.features || []).join('\n'));
    setFormOpen(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setFeaturesText('');
    setFormOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm({ ...form, images: [...form.images, file_url] });
  };

  const removeImage = (idx) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== idx) });
  };

  const getCatName = (id) => categories.find((c) => c.id === id)?.name || '—';

  const columns = [
    { key: 'title', label: 'Title', render: (r) => <span className="font-medium">{r.title}</span> },
    { key: 'category_id', label: 'Category', render: (r) => <span className="text-muted-foreground text-xs">{getCatName(r.category_id)}</span> },
    { key: 'type', label: 'Type', render: (r) => (
      <Badge variant="secondary" className={`rounded-full text-xs ${r.type === 'dev' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
        {r.type}
      </Badge>
    )},
    { key: 'price', label: 'Price', render: (r) => r.price ? `$${r.price}` : '—' },
    { key: 'status', label: 'Status', render: (r) => (
      <Badge variant="secondary" className={`rounded-full text-xs ${r.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
        {r.status}
      </Badge>
    )},
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your services</p>
        </div>
        <Button onClick={openNew} className="rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Add Service
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={services}
        isLoading={isLoading}
        searchFields={['title', 'description']}
        actions={(row) => (
          <div className="flex gap-1">
            <button onClick={(e) => { e.stopPropagation(); openEdit(row); }} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); if(confirm('Delete?')) deleteMutation.mutate(row.id); }} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
              <Trash2 className="w-3.5 h-3.5 text-destructive" />
            </button>
          </div>
        )}
      />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Service' : 'New Service'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form); }} className="space-y-4">
            <Input placeholder="Service title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="h-11 rounded-xl" />
            <Textarea placeholder="Short description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl" rows={2} />
            <Textarea placeholder="Detailed description (HTML supported)" value={form.long_description} onChange={(e) => setForm({ ...form, long_description: e.target.value })} className="rounded-xl" rows={4} />

            <div className="grid grid-cols-2 gap-4">
              <Select value={form.category_id || 'none'} onValueChange={(v) => setForm({ ...form, category_id: v === 'none' ? '' : v })}>
                <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Category</SelectItem>
                  {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dev">Development</SelectItem>
                  <SelectItem value="non-dev">Non-Development</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="h-11 rounded-xl" />
              <Input placeholder="Price label" value={form.price_label} onChange={(e) => setForm({ ...form, price_label: e.target.value })} className="h-11 rounded-xl" />
              <Select value={form.cta_type} onValueChange={(v) => setForm({ ...form, cta_type: v })}>
                <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="request">Request Quote</SelectItem>
                  <SelectItem value="contact">Contact</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Features (one per line)</label>
              <Textarea
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                className="rounded-xl"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Images</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm mb-2" />
              <div className="flex gap-2 flex-wrap">
                {form.images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img} alt="" className="w-16 h-16 rounded-xl object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
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