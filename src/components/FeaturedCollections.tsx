import Image from 'next/image';
import Link from 'next/link';
import collectionsData from '@/data/featured.json';

const collections = collectionsData;

export default function FeaturedCollections() {
  return (
    <section className="py-20 px-6 lg:px-10 bg-[#EFE9E1]">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14">
          <p className="font-optima text-[#c9a96e] tracking-[0.4em] uppercase text-xs mb-3 font-light">
            Explore Our World
          </p>
          <h2 className="section-heading mb-4">Featured Collections</h2>
          <div className="gold-divider w-20 mx-auto" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {collections.map((col) => (
            <Link
              key={col.name}
              href={col.href}
              className="group relative aspect-[3/4] overflow-hidden block"
            >
              {/* Image */}
              <Image
                src={col.image}
                alt={col.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Base overlay — subtle, always */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
              {/* Hover overlay — deeper maroon tint */}
              <div className="absolute inset-0 bg-[#5c1a25]/0 group-hover:bg-[#5c1a25]/25 transition-all duration-500" />

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">

                {/* Count — always visible */}
                <p className="font-optima text-[#c9a96e] text-[8px] tracking-[0.4em] uppercase mb-1.5 font-light">
                  {col.count}+ pieces
                </p>

                {/* Name — always visible, Playfair, weight 400 */}
                <h3 className="font-playfair text-white font-normal text-xl mb-2 leading-tight">
                  {col.name}
                </h3>

                {/* Description — on hover only */}
                <p className="font-cormorant text-white/70 text-sm leading-relaxed mb-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out" style={{ fontWeight: 300 }}>
                  {col.desc}
                </p>

                {/* CTA — on hover only */}
                <div className="flex items-center gap-2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out delay-[50ms]">
                  <span className="font-optima text-[#c9a96e] text-[9px] tracking-[0.3em] uppercase font-normal">
                    Shop Now
                  </span>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>

              {/* Corner accents on hover */}
              <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-[#c9a96e]/0 group-hover:border-[#c9a96e]/60 transition-all duration-500" />
              <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-[#c9a96e]/0 group-hover:border-[#c9a96e]/60 transition-all duration-500" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
