'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: '/hero1.jpg',
    label: 'New Collection 2026',
    title: 'Jewellery That\nTells Your Story',
    subtitle: 'Exquisite designs, ethically crafted to celebrate every moment that matters.',
    cta: 'Shop the Collection',
    href: '/collections',
  },
  {
    id: 2,
    image: '/hero2.jpg',
    label: 'Bridal Exclusive',
    title: 'Crafted for Your\nBiggest Day',
    subtitle: 'Bespoke bridal jewellery sets that become heirlooms passed through generations.',
    cta: 'View Bridal Sets',
    href: '/collections?cat=necklaces',
  },
  {
    id: 3,
    image: '/hero3.jpg',
    label: 'Fine Craftsmanship',
    title: 'The Art of Fine\nGold Crafting',
    subtitle: 'Decades of mastery poured into every piece — from casting to the final polish.',
    cta: 'Our Story',
    href: '/about',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => goTo((current + 1) % slides.length), 6000);
    return () => clearInterval(interval);
  }, [current]);

  const goTo = (idx: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(idx);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const slide = slides[current];

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Background Images */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={s.image}
            alt={s.title}
            fill
            className="object-cover"
            priority={i === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
          <div className="max-w-xl">
            {/* Label */}
            <div
              key={`label-${current}`}
              className="inline-flex items-center gap-2 mb-5 animate-fade-in-up"
            >
              <div className="h-px w-10 bg-[#c9a96e]" />
              <span className="font-cormorant text-[#c9a96e] text-sm tracking-[0.3em] uppercase">
                {slide.label}
              </span>
            </div>

            {/* Title */}
            <h1
              key={`title-${current}`}
              className="font-playfair text-white text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up whitespace-pre-line"
              style={{ animationDelay: '0.1s' }}
            >
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p
              key={`sub-${current}`}
              className="font-cormorant text-white/80 text-xl leading-relaxed mb-8 animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              {slide.subtitle}
            </p>

            {/* CTA */}
            <div
              key={`cta-${current}`}
              className="flex flex-wrap gap-4 animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              <Link
                href={slide.href}
                className="inline-flex items-center gap-2 bg-[#5c1a25] text-[#ffffff] px-8 py-4 font-cormorant font-semibold text-lg tracking-widest uppercase hover:bg-[#7a2535] transition-colors"
              >
                {slide.cta}
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 font-cormorant font-semibold text-lg tracking-widest uppercase hover:bg-white hover:text-[#5c1a25] transition-colors"
              >
                Custom Order
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => goTo((current - 1 + slides.length) % slides.length)}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 border border-white/40 text-white hover:bg-white/20 backdrop-blur-sm transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={() => goTo((current + 1) % slides.length)}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 border border-white/40 text-white hover:bg-white/20 backdrop-blur-sm transition-all"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 ${i === current ? 'w-8 h-2 bg-[#c9a96e]' : 'w-2 h-2 bg-white/50 hover:bg-white'} rounded-full`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-10 z-20 hidden md:flex flex-col items-center gap-2">
        <span className="font-cormorant text-white/60 text-xs tracking-widest uppercase" style={{ writingMode: 'vertical-rl' }}>
          Scroll Down
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
}
