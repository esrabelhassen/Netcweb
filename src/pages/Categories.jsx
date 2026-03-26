import React from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import SectionHeading from '@/components/public/SectionHeading';
import { useLanguage } from '@/lib/LanguageContext';

export default function Categories() {
  const { t } = useLanguage();
  const c = t.categories;

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.filter({ status: 'active' }, '-sort_order'),
  });

  const { data: services = [] } = useQuery({
    queryKey: ['services-count'],
    queryFn: () => base44.entities.Service.filter({ status: 'active' }),
  });

  const getServiceCount = (catId) => services.filter((s) => s.category_id === catId).length;

  return (
    <div className="pt-24 pb-16">
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeading label={c.label} title={c.title} description={c.desc} />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-48 rounded-3xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat, i) => (
                <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <Link to={`/categories/${cat.id}`} className="group block bg-card rounded-3xl p-8 border border-border/50 hover:border-primary/20 hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                    {cat.image_url && (
                      <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                        <img src={cat.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                        <span className="text-2xl font-bold text-primary">{cat.name?.[0]}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{cat.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{cat.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{getServiceCount(cat.id)} {c.services_count}</span>
                        <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all rtl-flip" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}