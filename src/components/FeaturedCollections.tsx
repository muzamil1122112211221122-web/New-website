'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function FeaturedCollections() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/featured').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setCollections(data.filter((c: any) => c.image));
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  // Skeleton card — shown while loading
  const SkeletonCard = () => (
    <div className="relative aspect-[4/5] rounded-md overflow-hidden bg-gray-200 animate-pulse" />
  );

  return (
    <section className="py-20 px-6 lg:px-10 bg-[#ffffff]">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14">
          <p className="font-heading text-[#c9a96e] tracking-[0.4em] uppercase text-xs mb-3 font-light">
            Explore Our World
          </p>
          <h2 className="section-heading mb-4">Featured Collections</h2>
          <div className="gold-divider w-20 mx-auto" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {!loaded ? (
            // Skeleton placeholders while fetching
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : collections.length === 0 ? (
            // Empty state — 4 dimmed placeholder cards
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="relative aspect-[4/5] rounded-md overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200 flex items-center justify-center">
                <p className="text-gray-300 text-xs text-center px-4">Add in<br/>Admin Panel</p>
              </div>
            ))
          ) : (
            collections.map((col) => (
            <Link
              key={col.name}
              href={col.href}
              className="group relative aspect-[4/5] rounded-md overflow-hidden block"
            >
              {/* Image — use plain img for base64 data URIs, next/image for URLs */}
              {col.image.startsWith('data:') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={col.image}
                  alt={col.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <Image
                  src={col.image}
                  alt={col.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              )}

              {/* Base overlay — subtle, always */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              {/* Hover overlay — deeper maroon tint */}
              <div className="absolute inset-0 bg-[#5c1a25]/0 group-hover:bg-[#5c1a25]/40 transition-all duration-500" />

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col items-center text-center">

                {/* Count — always visible */}
                <p className="font-heading text-[#c9a96e] text-[10px] tracking-[0.4em] uppercase mb-1.5 font-light">
                  {col.count}+ pieces
                </p>

                {/* Name — always visible, Playfair, weight 400 */}
                <h3 className="font-heading text-white font-normal text-2xl mb-2 leading-tight">
                  {col.name}
                </h3>

                {/* Description — on hover only */}
                <p className="font-body text-white/70 text-sm leading-relaxed mb-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out" style={{ fontWeight: 300 }}>
                  {col.desc}
                </p>

                {/* CTA — on hover only */}
                <div className="flex items-center justify-center gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out delay-[50ms]">
                  <span className="font-heading text-[#c9a96e] text-[9px] tracking-[0.3em] uppercase font-normal">
                    Shop Now
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>

              {/* Corner accents on hover */}
              <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-[#c9a96e]/0 group-hover:border-[#c9a96e]/60 transition-all duration-500" />
              <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-[#c9a96e]/0 group-hover:border-[#c9a96e]/60 transition-all duration-500" />
            </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
