import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/public/SectionHeading';
import ServiceCard from '@/components/public/ServiceCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/lib/LanguageContext';

export default function Services() {
  const { t } = useLanguage();
  const s = t.services;

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => base44.entities.Service.filter({ status: 'active' }, '-sort_order'),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.filter({ status: 'active' }, '-sort_order'),
  });

  const urlParams = new URLSearchParams(window.location.search);
  const urlType = urlParams.get('type');

  const filtered = services.filter((svc) => {
    const matchSearch = !search || svc.title?.toLowerCase().includes(search.toLowerCase()) || svc.description?.toLowerCase().includes(search.toLowerCase());
    const activeType = typeFilter !== 'all' ? typeFilter : urlType || 'all';
    const matchType = activeType === 'all' || svc.type === activeType;
    const matchCat = catFilter === 'all' || svc.category_id === catFilter;
    return matchSearch && matchType && matchCat;
  });

  return (
    <div className="pt-24 pb-16">
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeading label={s.label} title={s.title} description={s.desc} />

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder={s.search} value={search} onChange={(e) => setSearch(e.target.value)} className="h-12 pl-11 rounded-xl bg-card border-border/50" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {[['all', s.all], ['dev', s.dev], ['non-dev', s.nondev]].map(([val, label]) => (
                <button key={val} onClick={() => setTypeFilter(val)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${typeFilter === val ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted border border-border/50'}`}>
                  {label}
                </button>
              ))}
              {categories.length > 0 && (
                <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-full text-sm font-medium bg-card border border-border/50 text-muted-foreground">
                  <option value="all">{s.allCats}</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="rounded-3xl overflow-hidden">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-6 space-y-3"><Skeleton className="h-4 w-20" /><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full" /></div>
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((svc, i) => <ServiceCard key={svc.id} service={svc} index={i} />)}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <Filter className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">{s.empty}</p>
              <button onClick={() => { setSearch(''); setTypeFilter('all'); setCatFilter('all'); }} className="text-primary text-sm mt-2 hover:underline">{s.clear}</button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}