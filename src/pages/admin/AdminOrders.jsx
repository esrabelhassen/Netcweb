import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import DataTable from '@/components/admin/DataTable';
import { format } from 'date-fns';

const statusOptions = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
const paymentOptions = ['unpaid', 'paid', 'refunded'];
const statusColors = {
  pending: 'bg-accent/10 text-accent',
  confirmed: 'bg-primary/10 text-primary',
  in_progress: 'bg-primary/10 text-primary',
  completed: 'bg-success/10 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
};
const paymentColors = {
  unpaid: 'bg-accent/10 text-accent',
  paid: 'bg-success/10 text-success',
  refunded: 'bg-destructive/10 text-destructive',
};

export default function AdminOrders() {
  const qc = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => base44.entities.Order.list('-created_date'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Order.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order updated');
    },
  });

  const columns = [
    { key: 'service_title', label: 'Service', render: (r) => <span className="font-medium">{r.service_title || '—'}</span> },
    { key: 'customer_email', label: 'Customer', render: (r) => (
      <div>
        <div className="text-sm">{r.customer_name || '—'}</div>
        <div className="text-xs text-muted-foreground">{r.customer_email}</div>
      </div>
    )},
    { key: 'amount', label: 'Amount', render: (r) => <span className="font-semibold">{r.amount ? `$${r.amount}` : '—'}</span> },
    { key: 'status', label: 'Status', render: (r) => (
      <Select
        value={r.status || 'pending'}
        onValueChange={(v) => updateMutation.mutate({ id: r.id, data: { status: v } })}
      >
        <SelectTrigger className="h-8 w-32 rounded-lg border-0 bg-transparent" onClick={(e) => e.stopPropagation()}>
          <Badge className={`${statusColors[r.status] || 'bg-muted'} rounded-full text-xs`}>
            {(r.status || 'pending').replace('_', ' ')}
          </Badge>
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((s) => (
            <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    )},
    { key: 'payment_status', label: 'Payment', render: (r) => (
      <Select
        value={r.payment_status || 'unpaid'}
        onValueChange={(v) => updateMutation.mutate({ id: r.id, data: { payment_status: v } })}
      >
        <SelectTrigger className="h-8 w-24 rounded-lg border-0 bg-transparent" onClick={(e) => e.stopPropagation()}>
          <Badge className={`${paymentColors[r.payment_status] || 'bg-muted'} rounded-full text-xs`}>
            {r.payment_status || 'unpaid'}
          </Badge>
        </SelectTrigger>
        <SelectContent>
          {paymentOptions.map((s) => (
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
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">{orders.length} total orders</p>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        isLoading={isLoading}
        searchFields={['service_title', 'customer_email', 'customer_name']}
      />
    </div>
  );
}