import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Check, ShoppingCart, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function ServiceDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const serviceId = window.location.pathname.split('/services/')[1];
  const [showOrder, setShowOrder] = useState(false);
  const [orderForm, setOrderForm] = useState({ customer_name: '', customer_email: '', customer_phone: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: async () => {
      const all = await base44.entities.Service.filter({ status: 'active' });
      return all.find((s) => s.id === serviceId);
    },
    enabled: !!serviceId,
  });

  const { data: category } = useQuery({
    queryKey: ['category', service?.category_id],
    queryFn: async () => {
      const cats = await base44.entities.Category.list();
      return cats.find((c) => c.id === service.category_id);
    },
    enabled: !!service?.category_id,
  });

  const handleOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.Order.create({
      service_id: serviceId,
      service_title: service.title,
      amount: service.price || 0,
      ...orderForm,
    });
    // Also create a lead
    await base44.entities.Lead.create({
      name: orderForm.customer_name,
      email: orderForm.customer_email,
      phone: orderForm.customer_phone,
      interest: service.title,
      source: 'service_page',
    });
    setSubmitting(false);
    setShowOrder(false);
    toast.success('Order submitted successfully! We\'ll contact you soon.');
  };

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 px-6 max-w-6xl mx-auto">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-[4/3] rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="pt-24 pb-16 px-6 text-center">
        <p className="text-muted-foreground text-lg">Service not found.</p>
        <Link to="/services" className="text-primary hover:underline mt-4 inline-block">Back to Services</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <Link to="/services" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Images */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl overflow-hidden bg-card border border-border/50"
            >
              <img
                src={service.images?.[0] || 'https://media.base44.com/images/public/69c3230dbba2c44e1467df14/f61825780_generated_e3e34c64.png'}
                alt={service.title}
                className="w-full aspect-[4/3] object-cover"
              />
            </motion.div>
            {service.images?.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto">
                {service.images.slice(1).map((img, i) => (
                  <img key={i} src={img} alt="" className="w-24 h-24 rounded-xl object-cover shrink-0" />
                ))}
              </div>
            )}
          </div>

          {/* Details - Sticky */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-28">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="rounded-full text-xs">
                    {service.type === 'dev' ? 'Development' : 'Non-Development'}
                  </Badge>
                  {category && <Badge variant="outline" className="rounded-full text-xs">{category.name}</Badge>}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{service.title}</h1>
                <p className="text-muted-foreground leading-relaxed mb-6">{service.description}</p>

                {service.price > 0 && (
                  <div className="mb-6">
                    <span className="text-sm text-muted-foreground">Starting at</span>
                    <div className="text-3xl font-bold text-primary">${service.price}</div>
                    {service.price_label && <span className="text-sm text-muted-foreground">{service.price_label}</span>}
                  </div>
                )}

                {service.features?.length > 0 && (
                  <div className="mb-8">
                    <h3 className="font-semibold mb-3">What's included</h3>
                    <div className="space-y-2">
                      {service.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                          <span className="text-sm text-muted-foreground">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    onClick={() => setShowOrder(true)}
                    className="w-full h-14 rounded-2xl text-base font-medium active:scale-[0.98] transition-transform"
                  >
                    {service.cta_type === 'buy' ? (
                      <><ShoppingCart className="w-4 h-4 mr-2" /> Buy Now</>
                    ) : service.cta_type === 'request' ? (
                      <><Send className="w-4 h-4 mr-2" /> Request Quote</>
                    ) : (
                      <><MessageCircle className="w-4 h-4 mr-2" /> Get in Touch</>
                    )}
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {service.long_description && (
          <div className="mt-16 max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">Details</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: service.long_description }} />
          </div>
        )}
      </div>

      {/* Order Modal */}
      <AnimatePresence>
        {showOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4"
          >
            <div className="absolute inset-0 bg-foreground/20 backdrop-blur-md" onClick={() => setShowOrder(false)} />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full max-w-lg bg-background rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">
                  {service.cta_type === 'buy' ? 'Complete Your Order' : 'Request a Quote'}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {service.title} {service.price > 0 && `— $${service.price}`}
                </p>
                <form onSubmit={handleOrder} className="space-y-4">
                  <Input
                    placeholder="Your name"
                    value={orderForm.customer_name}
                    onChange={(e) => setOrderForm({ ...orderForm, customer_name: e.target.value })}
                    required
                    className="h-12 rounded-xl bg-muted border-0"
                  />
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={orderForm.customer_email}
                    onChange={(e) => setOrderForm({ ...orderForm, customer_email: e.target.value })}
                    required
                    className="h-12 rounded-xl bg-muted border-0"
                  />
                  <Input
                    placeholder="Phone number"
                    value={orderForm.customer_phone}
                    onChange={(e) => setOrderForm({ ...orderForm, customer_phone: e.target.value })}
                    className="h-12 rounded-xl bg-muted border-0"
                  />
                  <Textarea
                    placeholder="Tell us about your project or requirements..."
                    value={orderForm.notes}
                    onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                    className="rounded-xl bg-muted border-0 min-h-[100px]"
                  />
                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => setShowOrder(false)} className="flex-1 h-12 rounded-xl">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting} className="flex-1 h-12 rounded-xl">
                      {submitting ? 'Submitting...' : 'Submit'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}