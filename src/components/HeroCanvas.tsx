'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 240;
// Font stack: Optima Nova (if installed) → Josefin Sans (Google, loaded via layout) → fallbacks
const heroFont = "'Optima Nova LT Pro', 'Optima', var(--font-josefin), 'Gill Sans MT', Calibri, sans-serif";

function frameUrl(i: number): string {
  const n = String(i + 1).padStart(3, '0');
  return `/frames2/ezgif-frame-${n}.jpg`;
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number
) {
  if (!img.complete || !img.naturalWidth) return;
  const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
  const x = (cw - img.naturalWidth * scale) / 2;
  const y = (ch - img.naturalHeight * scale) / 2;
  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
}

export default function HeroCanvas() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef     = useRef<HTMLHeadingElement>(null);
  const subtitleRef  = useRef<HTMLParagraphElement>(null);
  const ctaRef       = useRef<HTMLDivElement>(null);
  const labelRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d')!;
    const images: HTMLImageElement[] = [];
    const obj = { frame: 0 };

    // Preload all 240 frames
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new window.Image();
      img.src = frameUrl(i);
      img.onload = () => {
        if (i === 0) drawCover(ctx, img, canvas.width, canvas.height);
      };
      images.push(img);
    }

    // Resize
    const setSize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      const img = images[Math.round(obj.frame)];
      if (img) drawCover(ctx, img, canvas.width, canvas.height);
    };
    setSize();

    // ── GSAP MatchMedia for Desktop vs Mobile ──────────────────────────────────
    let mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      // Desktop: Scroll-based pinning and scrub
      const st = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: `+=${window.innerHeight * 1.5}`,
        pin: true,
        anticipatePin: 1,
        scrub: 0.4,
        onUpdate: (self) => {
          const idx = Math.round(self.progress * (FRAME_COUNT - 1));
          obj.frame = idx;
          const img = images[idx];
          if (img) drawCover(ctx, img, canvas.width, canvas.height);
        },
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: `+=${window.innerHeight * 0.8}`,
          scrub: 0.8,
        },
      });

      [labelRef, titleRef, subtitleRef, ctaRef].forEach((r, i) => {
        if (r.current) tl.to(r.current, { opacity: 0, y: -35, ease: 'power2.in' }, i * 0.05);
      });

      return () => {
        st.kill();
        tl.kill();
      };
    });

    mm.add("(max-width: 768px)", () => {
      // Mobile: Autoplay like a video (no pinning, normal scroll)
      const anim = gsap.to(obj, {
        frame: FRAME_COUNT - 1,
        duration: 8,
        repeat: -1, // Infinite loop
        yoyo: true, // Smooth back and forth
        ease: "none",
        onUpdate: () => {
          const idx = Math.round(obj.frame);
          const img = images[idx];
          if (img) drawCover(ctx, img, canvas.width, canvas.height);
        }
      });

      return () => {
        anim.kill();
      };
    });

    window.addEventListener('resize', setSize);
    return () => {
      window.removeEventListener('resize', setSize);
      mm.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 pointer-events-none" />

      {/* Hero text */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 w-full">
          <div className="max-w-xl">

            {/* Label */}
            <div ref={labelRef} className="flex items-center gap-3 mb-7">
              <div className="h-px w-10 bg-[#EFE9E1]" />
              <span style={{ fontFamily: heroFont, fontSize: '9px', fontWeight: 300, letterSpacing: '0.5em', color: '#EFE9E1', textTransform: 'uppercase' }}>
                New Collection 2026
              </span>
            </div>

            {/* Title — uniform weight 300, same font, both lines identical */}
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
                className="inline-flex items-center gap-3 bg-[#5c1a25] text-[#EFE9E1] hover:bg-[#7a2535] transition-colors"
                style={{ fontFamily: heroFont, fontSize: '9px', fontWeight: 400, letterSpacing: '0.35em', textTransform: 'uppercase', padding: '14px 32px', whiteSpace: 'nowrap' }}
              >
                Shop Collection <ArrowRight size={13} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center border border-white/45 text-white hover:bg-white/10 transition-colors"
                style={{ fontFamily: heroFont, fontSize: '9px', fontWeight: 400, letterSpacing: '0.35em', textTransform: 'uppercase', padding: '14px 32px', whiteSpace: 'nowrap' }}
              >
                Custom Order
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator (desktop only) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2">
        <div className="w-5 h-8 border border-white/30 rounded-full flex items-start justify-center pt-1.5">
          <div className="w-0.5 h-2 bg-white/50 rounded-full animate-bounce" />
        </div>
        <span style={{ fontFamily: heroFont, fontSize: '7px', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
          Scroll
        </span>
      </div>
    </div>
  );
}
