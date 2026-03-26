import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, useInView } from 'framer-motion';
import SectionHeading from '@/components/public/SectionHeading';
import ServiceCard from '@/components/public/ServiceCard';
import HeroSection from '@/components/public/HeroSection';
import FeaturesSection from '@/components/public/FeaturesSection';
import { useLanguage } from '@/lib/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const h = t.home;
  const isRTL = t.dir === 'rtl';

  const { data: services = [] } = useQuery({
    queryKey: ['services-home'],
    queryFn: () => base44.entities.Service.filter({ status: 'active' }, '-sort_order', 6),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories-home'],
    queryFn: () => base44.entities.Category.filter({ status: 'active' }, '-sort_order', 8),
  });

  return (
    <div>
      <HeroSection />
      <FeaturesSection />

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-28 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-primary/20" />
          <div className="max-w-7xl mx-auto relative">
            <SectionHeading label={h.cat_label} title={h.cat_title} description={h.cat_desc} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {categories.map((cat, i) => (
                <CategoryCard key={cat.id} cat={cat} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Services */}
      {services.length > 0 && (
        <section className="py-28 px-6 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-primary/20" />
          <div className="max-w-7xl mx-auto">
            <SectionHeading label={h.services_label} title={h.services_title} description={h.services_desc} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {services.map((s, i) => (
                <ServiceCard key={s.id} service={s} index={i} />
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-14"
            >
              <Link to="/services">
                <Button variant="outline" size="lg" className="rounded-full px-10 h-14 border-2 border-primary/30 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 group">
                  {h.view_all}
                  <ArrowRight className={`w-4 h-4 rtl-flip ${isRTL ? 'mr-2' : 'ml-2'} group-hover:translate-x-1 transition-transform`} />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA */}
      <CTASection h={h} isRTL={isRTL} />
    </div>
  );
}

function CategoryCard({ cat, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >
      <Link
        to={`/categories/${cat.id}`}
        className="group block bg-card rounded-3xl p-7 border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'radial-gradient(circle at center, hsl(var(--primary)/0.05), transparent 70%)' }} />
        <div className="relative z-10">
          {cat.image_url ? (
            <motion.img
              whileHover={{ scale: 1.1, rotate: 3 }}
              transition={{ duration: 0.3 }}
              src={cat.image_url} alt={cat.name}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl object-cover shadow-lg"
            />
          ) : (
            <motion.div
              whileHover={{ scale: 1.1, rotate: 3 }}
              transition={{ duration: 0.3 }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-inner"
            >
              <span className="text-2xl font-black text-primary">{cat.name?.[0]}</span>
            </motion.div>
          )}
          <h3 className="font-bold text-sm group-hover:text-primary transition-colors duration-300">{cat.name}</h3>
        </div>
        <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-accent w-0 group-hover:w-full transition-all duration-500" />
      </Link>
    </motion.div>
  );
}

function CTASection({ h, isRTL }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[2.5rem] p-14 md:p-20 text-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0D1B4C 0%, #1a2d6b 50%, #0D1B4C 100%)' }}
        >
          {/* Animated accent orb */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, #FF4A1C, transparent)' }}
          />
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, #FF4A1C, transparent)' }}
          />

          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-5 text-white">
                {h.cta_title}
              </h2>
              <p className="text-white/60 text-lg mb-10 max-w-lg mx-auto">{h.cta_desc}</p>
              <Link to="/contact">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" className="rounded-full px-12 h-16 text-base font-bold bg-accent hover:bg-accent/90 text-white shadow-2xl shadow-accent/40 hover:shadow-accent/60">
                    {h.cta_btn}
                    <ArrowRight className={`w-5 h-5 rtl-flip ${isRTL ? 'mr-2' : 'ml-2'}`} />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}