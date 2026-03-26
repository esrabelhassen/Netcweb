import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  const c = t.contact;
  const isRTL = t.dir === 'rtl';

  const [form, setForm] = useState({ name: '', email: '', phone: '', interest: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await base44.entities.Lead.create({ ...form, source: 'contact_form', status: 'new' });
    setLoading(false);
    setForm({ name: '', email: '', phone: '', interest: '', message: '' });
    toast.success(c.success);
  };

  const contactInfo = [
    { icon: Mail, label: c.email_label, value: 'contact@netc.com' },
    { icon: Phone, label: c.phone_label, value: '+1 (555) 000-0000' },
    { icon: MapPin, label: c.location_label, value: 'Global' },
  ];

  return (
    <div className="pt-24 pb-16">
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Info */}
            <motion.div initial={{ opacity: 0, x: isRTL ? 20 : -20 }} animate={{ opacity: 1, x: 0 }}>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">{c.label}</span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{c.title}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10">{c.sub}</p>
              <div className="space-y-6">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{info.label}</div>
                      <div className="font-medium">{info.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: isRTL ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <form onSubmit={handleSubmit} className="bg-card rounded-3xl p-8 border border-border/50 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input placeholder={c.name_ph} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="h-12 rounded-xl bg-background border-border/50" />
                  <Input type="email" placeholder={c.email_ph} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="h-12 rounded-xl bg-background border-border/50" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input placeholder={c.phone_ph} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-12 rounded-xl bg-background border-border/50" />
                  <Input placeholder={c.interest_ph} value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })} className="h-12 rounded-xl bg-background border-border/50" />
                </div>
                <Textarea placeholder={c.message_ph} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="rounded-xl bg-background border-border/50 min-h-[140px]" />
                <Button type="submit" disabled={loading} className="w-full h-14 rounded-xl text-base font-medium active:scale-[0.98] transition-transform">
                  {loading ? c.sending : c.send}
                  <Send className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}