'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const optima = "'Optima Nova LT Pro', Optima, 'Gill Sans MT', sans-serif";

const fixedReviews: { id: string; name: string; city: string; rating: number; text: string; initials: string; image: string | null }[] = [
  { id: 'f1', name: 'Sana Rehman',   city: 'Lahore',     rating: 5, text: 'Absolutely stunning bridal set! The quality is incomparable. Everyone at my wedding loved my jewelry. IJC exceeded my expectations for sure!', initials: 'SR', image: null },
  { id: 'f2', name: 'Ahmed Malik',   city: 'Karachi',    rating: 4.5, text: 'Custom ring for my fiancé purchased and the people were really very cooperative. The ring looked even better than what I had expected. Totally worth it!', initials: 'AM', image: null },
  { id: 'f3', name: 'Nadia Hussain', city: 'Islamabad',  rating: 5, text: "The workmanship that comes from IJC is impeccable. I've been purchasing from them for years now and have yet to find fault with any of their orders. A+ company!", initials: 'NH', image: null },
  { id: 'f4', name: 'Bilal Khan',    city: 'Faisalabad', rating: 4.5, text: 'There is certainty in the gold purity while the designs are forever classic. I purchased the necklace set for my mother on her anniversary, and she loves it.', initials: 'BK', image: null },
];

interface Review { id: string; name: string; city: string; rating: number; text: string; initials: string; image: string | null; }

import { Star, StarHalf } from 'lucide-react';

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => {
        if (rating >= star) {
          return <Star key={star} size={13} className="fill-[#c9a96e] text-[#c9a96e]" />;
        } else if (rating >= star - 0.5) {
          return <StarHalf key={star} size={13} className="fill-[#c9a96e] text-[#c9a96e]" />;
        } else {
          return <Star key={star} size={13} className="text-[#c9a96e]/30" />;
        }
      })}
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, starIndex: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeftHalf = e.clientX - rect.left < rect.width / 2;
    setHover(isLeftHalf ? starIndex - 0.5 : starIndex);
  };

  return (
    <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map(star => {
        const displayValue = hover || value;
        return (
          <div 
            key={star} 
            className="cursor-pointer"
            onMouseMove={(e) => handleMouseMove(e, star)}
            onClick={() => onChange(hover)}
          >
            {displayValue >= star ? (
              <Star size={22} className="fill-[#c9a96e] text-[#c9a96e]" />
            ) : displayValue >= star - 0.5 ? (
              <StarHalf size={22} className="fill-[#c9a96e] text-[#c9a96e]" />
            ) : (
              <Star size={22} className="text-[#c9a96e]/30" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function TestimonialsSection() {
  const [customReviews, setCustomReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load reviews from Supabase
  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setCustomReviews(data);
      })
      .catch(() => {});
  }, []);

  // Carousel drag
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftVal = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const rafId = useRef<number>(0);

  const scrollByCards = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = (scrollRef.current.querySelector('[data-card]') as HTMLElement)?.offsetWidth ?? 340;
    scrollRef.current.scrollBy({ left: dir === 'right' ? cardWidth + 20 : -(cardWidth + 20), behavior: 'smooth' });
  };

  const momentumScroll = () => {
    if (!scrollRef.current) return;
    velocity.current *= 0.92;
    scrollRef.current.scrollLeft += velocity.current;
    if (Math.abs(velocity.current) > 0.5) {
      rafId.current = requestAnimationFrame(momentumScroll);
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    cancelAnimationFrame(rafId.current);
    isDragging.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    scrollLeftVal.current = scrollRef.current?.scrollLeft ?? 0;
    lastX.current = e.pageX;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grabbing';
  };
  const onMouseLeave = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
    rafId.current = requestAnimationFrame(momentumScroll);
  };
  const onMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
    rafId.current = requestAnimationFrame(momentumScroll);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.8;
    velocity.current = e.pageX - lastX.current;
    lastX.current = e.pageX;
    scrollRef.current.scrollLeft = scrollLeftVal.current - walk;
  };

  const [form, setForm] = useState({ name: '', city: '', rating: 5, text: '', image: null as string | null });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((f) => ({ ...f, image: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) return;
    setSubmitting(true);
    const review = {
      name: form.name.trim(),
      city: form.city.trim() || 'Pakistan',
      rating: form.rating,
      text: form.text.trim(),
      initials: form.name.trim().slice(0, 2).toUpperCase(),
      image: form.image
    };
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      });
      const data = await res.json();
      if (data && !data.error) {
        setCustomReviews([data, ...customReviews]);
      }
    } catch {
      // ignore
    }
    setForm({ name: '', city: '', rating: 5, text: '', image: null });
    setShowForm(false);
    setSubmitting(false);
  };

  const allReviews: Review[] = [...customReviews, ...fixedReviews];

  return (
    <section className="py-20 bg-[#EFE9E1] overflow-hidden">
      <div className="max-w-7xl mx-auto px-14 lg:px-20">

        {/* Heading */}
        <div className="text-center mb-12">
          <p style={{ fontFamily: optima, fontSize: '9px', fontWeight: 300, letterSpacing: '0.45em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: '14px' }}>
            Real Stories
          </p>
          <h2 className="section-heading mb-4">What Our Customers Say</h2>
          <div className="gold-divider w-20 mx-auto mb-6" />
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowForm(!showForm)}
            style={{ fontFamily: optima, fontSize: '9px', fontWeight: 400, letterSpacing: '0.3em', textTransform: 'uppercase' }}
            className="mt-2 inline-flex items-center gap-2 border border-[#5c1a25]/30 text-[#5c1a25] px-6 py-2.5 hover:bg-[#5c1a25] hover:text-[#EFE9E1] transition-all duration-300"
          >
            <motion.svg
              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              animate={{ rotate: showForm ? 45 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path d="M12 5v14M5 12h14"/>
            </motion.svg>
            {showForm ? 'Close Review' : 'Add Your Review'}
          </motion.button>
        </div>

        {/* Review form — animated */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              key="review-form"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 48 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div className="max-w-xl mx-auto bg-white/60 border border-[#5c1a25]/10 p-8">
                <h3 style={{ fontFamily: optima, fontSize: '16px', fontWeight: 400, color: '#5c1a25', letterSpacing: '0.06em', marginBottom: '20px' }}>
                  Share Your Experience
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label style={{ fontFamily: optima, fontSize: '9px', fontWeight: 400, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#5c1a25', display: 'block', marginBottom: '8px' }}>Rating *</label>
                    <StarPicker value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label style={{ fontFamily: optima, fontSize: '9px', fontWeight: 400, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#5c1a25', display: 'block', marginBottom: '6px' }}>Name *</label>
                      <input type="text" required className="form-input" placeholder="Your name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ fontFamily: optima, fontSize: '9px', fontWeight: 400, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#5c1a25', display: 'block', marginBottom: '6px' }}>City</label>
                      <input type="text" className="form-input" placeholder="City" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label style={{ fontFamily: optima, fontSize: '9px', fontWeight: 400, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#5c1a25', display: 'block' }}>Your Review *</label>
                      <span className={`text-[10px] ${form.text.split(/\s+/).filter(Boolean).length > 150 ? 'text-red-500' : 'text-[#5c1a25]/50'}`}>
                        {form.text.split(/\s+/).filter(Boolean).length}/150 words
                      </span>
                    </div>
                    <textarea required className="form-input resize-none h-24" placeholder="Share your experience with IJC (Max 150 words)..." value={form.text} onChange={(e) => {
                      const words = e.target.value.split(/\s+/).filter(Boolean);
                      if (words.length <= 150 || e.target.value.length < form.text.length) {
                        setForm((f) => ({ ...f, text: e.target.value }));
                      }
                    }} />
                  </div>
                  <div>
                    <label style={{ fontFamily: optima, fontSize: '9px', fontWeight: 400, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#5c1a25', display: 'block', marginBottom: '6px' }}>Photo (optional)</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-[#5c1a25]/60 file:mr-3 file:py-1.5 file:px-4 file:border-0 file:bg-[#5c1a25] file:text-[#EFE9E1] file:text-xs file:cursor-pointer cursor-pointer" style={{ fontFamily: optima, fontSize: '12px', fontWeight: 300 }} />
                    {form.image && (<div className="relative w-20 h-20 mt-2"><Image src={form.image} alt="Preview" fill className="object-cover border border-[#5c1a25]/20" /></div>)}
                  </div>
                  <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Carousel */}
        <div className="relative">
          {/* Prev */}
          <button
            onClick={() => scrollByCards('left')}
            className="absolute -left-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-[#5c1a25] text-[#EFE9E1] flex items-center justify-center shadow-xl hover:bg-[#7a2535] transition-colors"
            aria-label="Previous"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>

          {/* Next */}
          <button
            onClick={() => scrollByCards('right')}
            className="absolute -right-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-[#5c1a25] text-[#EFE9E1] flex items-center justify-center shadow-xl hover:bg-[#7a2535] transition-colors"
            aria-label="Next"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>

          {/* Drag track */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-5 pb-4 hide-scrollbar select-none"
            style={{ cursor: 'grab', scrollBehavior: 'auto' }}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
          >
            {allReviews.map((r) => (
              <div
                key={r.id}
                data-card
                className="min-w-[300px] md:min-w-[340px] shrink-0 bg-white/50 border border-[#5c1a25]/8 p-6 relative group hover:border-[#c9a96e]/30 hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div style={{ color: '#c9a96e', opacity: 0.2, fontSize: '48px', lineHeight: 1, marginBottom: '8px', fontFamily: 'Georgia, serif' }}>&ldquo;</div>
                <StarDisplay rating={r.rating} />
                {r.image && (
                  <div className="relative w-full h-32 mt-3 mb-3 overflow-hidden">
                    <Image src={r.image} alt="Review photo" fill className="object-cover" />
                  </div>
                )}
                <p className="mt-3 mb-5 flex-1" style={{ fontFamily: optima, fontSize: '13px', fontWeight: 300, color: 'rgba(44,24,16,0.8)', lineHeight: 1.9, fontStyle: 'italic' }}>
                  &ldquo;
                  {r.text.split(/\s+/).filter(Boolean).length > 150 
                    ? r.text.split(/\s+/).filter(Boolean).slice(0, 150).join(' ') + '...' 
                    : r.text}
                  &rdquo;
                </p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[#5c1a25]/8">
                  <div className="w-9 h-9 bg-[#5c1a25] flex items-center justify-center flex-shrink-0">
                    <span style={{ fontFamily: optima, fontSize: '10px', color: '#c9a96e', fontWeight: 500 }}>{r.initials}</span>
                  </div>
                  <div>
                    <p style={{ fontFamily: optima, fontSize: '12px', fontWeight: 500, color: '#5c1a25' }}>{r.name}</p>
                    <p style={{ fontFamily: optima, fontSize: '10px', fontWeight: 300, color: 'rgba(92,26,37,0.45)', letterSpacing: '0.08em' }}>{r.city}</p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" style={{ background: 'linear-gradient(90deg, #c9a96e, transparent)' }} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
