'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const headingFont = "'Argent CF', 'Optima Nova LT Pro', 'Optima', Georgia, serif";
const bodyFont = "'Poppins', 'Gill Sans MT', sans-serif";

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef     = useRef<HTMLHeadingElement>(null);
  const subtitleRef  = useRef<HTMLParagraphElement>(null);
  const ctaRef       = useRef<HTMLDivElement>(null);
  const labelRef     = useRef<HTMLDivElement>(null);

  

  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#1a0a0d]">
      
      {/* Skeleton Shimmer Background (only active before video loads) */}
      {!videoLoaded && (
        <div className="absolute inset-0 bg-[#2a1116] animate-pulse z-0" />
      )}

      {/* Background Video */}
      <video 
        src="/upscaled-video.mp4" 
        autoPlay 
        loop 
        muted 
        playsInline 
        onCanPlay={() => setVideoLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 pointer-events-none z-0" />

      {/* Hero text */}
      <div className="relative z-10 h-full flex items-center" style={{ paddingTop: '0', marginTop: '-8vh' }}>
        <div className="w-full px-6 lg:px-12">
          <div className="max-w-2xl relative">

            {/* Proper Skeleton Overlay */}
            {!videoLoaded && (
              <div className="absolute inset-0 z-20 flex flex-col justify-start">
                {/* Label Skeleton */}
                <div className="flex items-center gap-3 mb-7">
                  <div className="h-px w-10 bg-white/20 animate-pulse" />
                  <div className="h-3 w-32 bg-white/10 animate-pulse rounded" />
                </div>
                {/* Title Skeleton */}
                <div className="h-10 sm:h-12 w-3/4 bg-white/10 animate-pulse rounded mb-3" />
                <div className="h-10 sm:h-12 w-2/3 bg-white/10 animate-pulse rounded mb-8" />
                {/* Subtitle Skeleton */}
                <div className="h-4 w-4/5 bg-white/10 animate-pulse rounded mb-2" />
                <div className="h-4 w-3/5 bg-white/10 animate-pulse rounded mb-10" />
                {/* Buttons Skeleton */}
                <div className="flex flex-wrap gap-4">
                  <div className="h-[42px] w-40 bg-white/10 animate-pulse rounded-md" />
                  <div className="h-[42px] w-36 bg-white/10 animate-pulse rounded-md border border-white/5" />
                </div>
              </div>
            )}

            {/* Actual Content */}
            <div className={`transition-opacity duration-700 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}>
              {/* Label */}
              <div ref={labelRef} className="flex items-center gap-3 mb-7">
                <div className="h-px w-10 bg-[#ffffff]" />
                <span style={{ fontFamily: bodyFont, fontSize: '9px', fontWeight: 300, letterSpacing: '0.5em', color: '#ffffff', textTransform: 'uppercase' }}>
                  New Collection 2026
                </span>
              </div>

              {/* Title */}
              <h1
                ref={titleRef}
                style={{
                  fontFamily: headingFont,
                  fontSize: 'clamp(32px, 4vw, 49px)',
                  fontWeight: 300,
                  letterSpacing: '0.05em',
                  color: 'white',
                  lineHeight: 1.12,
                  marginBottom: '1.5rem',
                }}
              >
                Jewellery That<br />Tells Your Story
              </h1>

              {/* Subtitle */}
              <p
                ref={subtitleRef}
                style={{
                  fontFamily: bodyFont,
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
                  style={{ fontFamily: bodyFont, fontSize: '9px', fontWeight: 400, letterSpacing: '0.35em', textTransform: 'uppercase', padding: '14px 32px', whiteSpace: 'nowrap' }}
                >
                  Shop Collection <ArrowRight size={13} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center border border-white/45 text-white hover:bg-white/10 transition-colors rounded-md"
                  style={{ fontFamily: bodyFont, fontSize: '9px', fontWeight: 400, letterSpacing: '0.35em', textTransform: 'uppercase', padding: '14px 32px', whiteSpace: 'nowrap' }}
                >
                  Custom Order
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
