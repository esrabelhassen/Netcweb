import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Users, Award, Clock, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';

const ABOUT_IMG = 'https://media.base44.com/images/public/69c3230dbba2c44e1467df14/a69535698_generated_67c5a346.png';
const statsValues = ['50+', '30+', '5+', '24/7'];
const valueIcons = [Target, Users, Award, Clock];

function AnimatedCounter({ value, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.span ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay, duration: 0.6, ease: 'easeOut' }}>
      {value}
    </motion.span>
  );
}

function ValueCard({ icon: Icon, title, desc, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ delay: index * 0.12, duration: 0.6, ease: 'easeOut' }} whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="relative bg-card rounded-3xl p-8 border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-shadow duration-500 overflow-hidden group cursor-default">
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/5 group-hover:bg-primary/10 group-hover:scale-150 transition-all duration-700" />
      <div className="relative z-10 flex gap-5 items-start">
        <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.4 }}
          className="w-14 h-14 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
          <Icon className="w-6 h-6 text-primary" />
        </motion.div>
        <div>
          <h3 className="text-lg font-bold mb-2 tracking-tight">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function About() {
  const { t } = useLanguage();
  const ab = t.about;
  const isRTL = t.dir === 'rtl';

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const [hoveredStat, setHoveredStat] = useState(null);

  return (
    <div className="pt-20 overflow-hidden">

      {/* HERO */}
      <section ref={heroRef} className="min-h-screen flex items-center py-24 px-6 relative">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-accent/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
            <motion.div style={{ y: textY }}>
              <motion.span initial={{ opacity: 0, x: isRTL ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-6 bg-primary/8 border border-primary/20 rounded-full px-4 py-2">
                <Sparkles className="w-3 h-3" />
                {ab.badge}
              </motion.span>

              <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.02] mb-6">
                {ab.headline1}{' '}<br />
                <span className="gradient-text">{ab.headline2}</span><br />
                {ab.headline3}
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
                className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg">
                {ab.sub}
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }}>
                <Link to="/services">
                  <Button size="lg" className="rounded-full px-8 h-14 text-base font-semibold bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200">
                    {ab.cta}
                    <ArrowRight className={`w-4 h-4 rtl-flip ${isRTL ? 'mr-2' : 'ml-2'}`} />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9, x: isRTL ? -40 : 40 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} style={{ y: imgY }} className="relative">
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/10">
                <img src={ABOUT_IMG} alt="NETC" className="w-full h-auto object-cover" />
              </div>
              <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                className={`absolute ${isRTL ? '-bottom-5 -right-5' : '-bottom-5 -left-5'} bg-background rounded-2xl px-6 py-4 shadow-xl border border-border/50`}>
                <div className="text-3xl font-black gradient-text">5+</div>
                <div className="text-xs text-muted-foreground font-medium mt-0.5">{ab.years}</div>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.75, type: 'spring', stiffness: 200 }}
                className={`absolute top-6 ${isRTL ? '-left-5' : '-right-5'} bg-background rounded-2xl px-4 py-3 shadow-xl border border-border/50`}>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm font-semibold">50+ {ab.statsLabel[0]}</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/4 via-transparent to-accent/4" />
        <div className="max-w-5xl mx-auto relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statsValues.map((val, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                onHoverStart={() => setHoveredStat(i)} onHoverEnd={() => setHoveredStat(null)}
                className="relative bg-card border border-border/50 rounded-3xl p-8 text-center cursor-default overflow-hidden group">
                <motion.div animate={{ scale: hoveredStat === i ? 1.5 : 1, opacity: hoveredStat === i ? 1 : 0 }} transition={{ duration: 0.4 }} className="absolute inset-0 bg-primary/5 rounded-3xl" />
                <div className="relative z-10">
                  <div className="text-4xl md:text-5xl font-black gradient-text mb-2">
                    <AnimatedCounter value={val} delay={i * 0.1} />
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">{ab.statsLabel[i]}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/8 border border-primary/20 rounded-full px-4 py-2 inline-block mb-6">
              {ab.valuesLabel}
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{ab.valuesTitle}</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">{ab.valuesDesc}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ab.values.map((v, i) => (
              <ValueCard key={i} icon={valueIcons[i]} title={v.title} desc={v.desc} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative bg-foreground text-background rounded-[2.5rem] p-12 md:p-16 text-center overflow-hidden noise">
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-accent/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">{ab.cta_ready}</h2>
              <p className="text-background/60 text-lg mb-8 max-w-lg mx-auto">{ab.cta_ready_desc}</p>
              <Link to="/contact">
                <Button size="lg" className="rounded-full px-8 h-14 text-base font-semibold bg-accent hover:bg-accent/90 text-accent-foreground active:scale-[0.98] transition-transform shadow-lg shadow-accent/30">
                  {ab.cta_btn}
                  <ArrowRight className={`w-4 h-4 rtl-flip ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}