import React from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import SectionHeading from '@/components/public/SectionHeading';
import ServiceCard from '@/components/public/ServiceCard';

export default function CategoryDetail() {
  const categoryId = window.location.pathname.split('/categories/')[1];

  const { data: category, isLoading: catLoading } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      const cats = await base44.entities.Category.list();
      return cats.find((c) => c.id === categoryId);
    },
    enabled: !!categoryId,
  });

  const { data: services = [], isLoading: svcLoading } = useQuery({
    queryKey: ['services-cat', categoryId],
    queryFn: () => base44.entities.Service.filter({ category_id: categoryId, status: 'active' }, '-sort_order'),
    enabled: !!categoryId,
  });

  if (catLoading) {
    return (
      <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-12 w-64 mb-4" />
        <Skeleton className="h-6 w-96" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="pt-24 pb-16 px-6 text-center">
        <p className="text-muted-foreground">Category not found.</p>
        <Link to="/categories" className="text-primary hover:underline mt-4 inline-block">Back to Categories</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/categories" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            All Categories
          </Link>

          <SectionHeading
            align="left"
            label={`${services.length} services`}
            title={category.name}
            description={category.description}
          />

          {svcLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-3xl" />
              ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s, i) => (
                <ServiceCard key={s.id} service={s} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No services in this category yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}