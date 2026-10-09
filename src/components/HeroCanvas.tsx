'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const heroFont = "'Optima Nova LT Pro', 'Optima', var(--font-josefin), 'Gill Sans MT', Calibri, sans-serif";

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef     = useRef<HTMLHeadingElement>(null);
  const subtitleRef  = useRef<HTMLParagraphElement>(null);
  const ctaRef       = useRef<HTMLDivElement>(null);
  const labelRef     = useRef<HTMLDivElement>(null);

  

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#1a0a0d] overflow-hidden">
      
      {/* Background Video */}
      <video 
        src="/upscaled-video.mp4" 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 pointer-events-none z-0" />

      {/* Hero text */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="max-w-xl">

            {/* Label */}
            <div ref={labelRef} className="flex items-center gap-3 mb-7">
              <div className="h-px w-10 bg-[#ffffff]" />
              <span style={{ fontFamily: heroFont, fontSize: '9px', fontWeight: 300, letterSpacing: '0.5em', color: '#ffffff', textTransform: 'uppercase' }}>
                New Collection 2026
              </span>
            </div>

            {/* Title */}
            <h1
              ref={titleRef}
              style={{
                fontFamily: heroFont,
                fontSize: 'clamp(2.6rem, 5vw, 5rem)',
                fontWeight: 300,
                letterSpacing: '0.05em',
                color: 'white',
                lineHeight: 1.12,
                marginBottom: '1.5rem',
              }}
            >
              Jewellery That<br />
              Tells Your Story
            </h1>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              style={{
                fontFamily: heroFont,
                fontSize: 'clamp(0.85rem, 1.6vw, 1.05rem)',
                fontWeight: 300,
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.62)',
                lineHeight: 1.9,
                marginBottom: '2.5rem',
              }}
            >
              Exquisite designs, ethically crafted<br />to celebrate every moment that matters.
            </p>

            {/* CTAs */}
            <div ref={ctaRef} className="flex flex-wrap gap-4">
              <Link
                href="/collections"
                className="inline-flex items-center gap-3 bg-[#5c1a25] text-[#ffffff] hover:bg-[#7a2535] transition-colors rounded-md"
                style={{ fontFamily: heroFont, fontSize: '9px', fontWeight: 400, letterSpacing: '0.35em', textTransform: 'uppercase', padding: '14px 32px', whiteSpace: 'nowrap' }}
              >
                Shop Collection <ArrowRight size={13} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center border border-white/45 text-white hover:bg-white/10 transition-colors rounded-md"
                style={{ fontFamily: heroFont, fontSize: '9px', fontWeight: 400, letterSpacing: '0.35em', textTransform: 'uppercase', padding: '14px 32px', whiteSpace: 'nowrap' }}
              >
                Custom Order
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
