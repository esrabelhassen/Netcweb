import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { FolderOpen, Package, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const { data: categories = [] } = useQuery({ queryKey: ['admin-categories'], queryFn: () => base44.entities.Category.list() });
  const { data: services = [] } = useQuery({ queryKey: ['admin-services'], queryFn: () => base44.entities.Service.list() });
  const { data: leads = [] } = useQuery({ queryKey: ['admin-leads'], queryFn: () => base44.entities.Lead.list('-created_date', 50) });
  const { data: orders = [] } = useQuery({ queryKey: ['admin-orders'], queryFn: () => base44.entities.Order.list('-created_date', 50) });

  const recentLeads = leads.slice(0, 5);
  const recentOrders = orders.slice(0, 5);

  const statusColors = {
    new: 'bg-primary/10 text-primary',
    pending: 'bg-accent/10 text-accent',
    confirmed: 'bg-success/10 text-success',
    paid: 'bg-success/10 text-success',
    completed: 'bg-success/10 text-success',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back to NETC admin.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Categories" value={categories.length} icon={FolderOpen} delay={0} />
        <StatCard title="Services" value={services.length} icon={Package} delay={0.05} />
        <StatCard title="Leads" value={leads.length} icon={Users} delay={0.1} />
        <StatCard title="Orders" value={orders.length} icon={ShoppingCart} delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-card rounded-2xl border border-border/50 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Recent Leads
          </h3>
          <div className="space-y-3">
            {recentLeads.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No leads yet.</p>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <div>
                    <div className="font-medium text-sm">{lead.name || lead.email}</div>
                    <div className="text-xs text-muted-foreground">{lead.interest || 'General'}</div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${statusColors[lead.status] || 'bg-muted text-muted-foreground'} text-xs rounded-full`}>
                      {lead.status}
                    </Badge>
                    {lead.created_date && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {format(new Date(lead.created_date), 'MMM d')}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-card rounded-2xl border border-border/50 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-primary" />
            Recent Orders
          </h3>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No orders yet.</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <div>
                    <div className="font-medium text-sm">{order.service_title || 'Service'}</div>
                    <div className="text-xs text-muted-foreground">{order.customer_email}</div>
                  </div>
                  <div className="text-right">
                    {order.amount > 0 && <div className="font-semibold text-sm">${order.amount}</div>}
                    <Badge className={`${statusColors[order.status] || 'bg-muted text-muted-foreground'} text-xs rounded-full`}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}