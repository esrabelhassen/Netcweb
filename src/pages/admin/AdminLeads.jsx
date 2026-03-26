import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import DataTable from '@/components/admin/DataTable';
import { format } from 'date-fns';

const statusOptions = ['new', 'contacted', 'qualified', 'converted', 'lost'];
const statusColors = {
  new: 'bg-primary/10 text-primary',
  contacted: 'bg-accent/10 text-accent',
  qualified: 'bg-success/10 text-success',
  converted: 'bg-success/10 text-success',
  lost: 'bg-destructive/10 text-destructive',
};

export default function AdminLeads() {
  const qc = useQueryClient();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['admin-leads'],
    queryFn: () => base44.entities.Lead.list('-created_date'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Lead.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-leads'] });
      toast.success('Lead updated');
    },
  });

  const columns = [
    { key: 'name', label: 'Name', render: (r) => <span className="font-medium">{r.name || '—'}</span> },
    { key: 'email', label: 'Email', render: (r) => <span className="text-sm">{r.email}</span> },
    { key: 'phone', label: 'Phone', render: (r) => <span className="text-sm text-muted-foreground">{r.phone || '—'}</span> },
    { key: 'interest', label: 'Interest', render: (r) => <span className="text-sm text-muted-foreground">{r.interest || '—'}</span> },
    { key: 'source', label: 'Source', render: (r) => (
      <Badge variant="outline" className="rounded-full text-xs">{r.source}</Badge>
    )},
    { key: 'status', label: 'Status', render: (r) => (
      <Select
        value={r.status || 'new'}
        onValueChange={(v) => updateMutation.mutate({ id: r.id, data: { status: v } })}
      >
        <SelectTrigger className="h-8 w-28 rounded-lg border-0 bg-transparent" onClick={(e) => e.stopPropagation()}>
          <Badge className={`${statusColors[r.status] || 'bg-muted text-muted-foreground'} rounded-full text-xs`}>
            {r.status}
          </Badge>
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((s) => (
            <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    )},
    { key: 'created_date', label: 'Date', render: (r) => (
      <span className="text-xs text-muted-foreground">
        {r.created_date ? format(new Date(r.created_date), 'MMM d, yyyy') : '—'}
      </span>
    )},
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
        <p className="text-muted-foreground text-sm mt-1">{leads.length} total leads captured</p>
      </div>

      <DataTable
        columns={columns}
        data={leads}
        isLoading={isLoading}
        searchFields={['name', 'email', 'interest']}
      />
    </div>
  );
}