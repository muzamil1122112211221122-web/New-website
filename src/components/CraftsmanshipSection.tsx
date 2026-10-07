import Image from 'next/image';
import Link from 'next/link';
import { Award, Gem, Hammer } from 'lucide-react';

const optima = "'Optima Nova LT Pro', Optima, 'Gill Sans MT', sans-serif";

// 5K+ customers removed as requested
const stats = [
  { icon: Award,  label: 'Years of Excellence', value: '25+' },
  { icon: Gem,    label: 'Pieces Crafted',       value: '10K+' },
  { icon: Hammer, label: 'Expert Craftsmen',     value: '15+' },
];

export default function CraftsmanshipSection() {
  return (
    <section className="py-20 bg-[#1a0a0d]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Image collage */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative aspect-[3/4]">
                <Image src="/p5.jpg" alt="Craftsmanship" fill sizes="25vw" className="object-cover" />
              </div>
              <div className="flex flex-col gap-3 pt-8">
                <div className="relative aspect-square">
                  <Image src="/p6.jpg" alt="Gold work" fill sizes="12vw" className="object-cover" />
                </div>
                <div className="relative aspect-square">
                  <Image src="/p7.jpg" alt="Detail" fill sizes="12vw" className="object-cover" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 border-l border-b border-[#c9a96e]/50" />
            <div className="absolute -top-4  -right-4 w-20 h-20 border-r border-t border-[#c9a96e]/50" />
          </div>

          {/* Right: Content */}
          <div>
            <p style={{ fontFamily: optima, fontSize: '9px', fontWeight: 300, letterSpacing: '0.45em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: '16px' }}>
              Our Heritage
            </p>

            <h2
              style={{ fontFamily: optima, fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', fontWeight: 200, letterSpacing: '0.04em', color: '#EFE9E1', lineHeight: 1.15, marginBottom: '20px' }}
            >
              The Art of Fine<br />
              <span className="shimmer-text" style={{ fontWeight: 500 }}>Craftsmanship</span>
            </h2>

            <div className="h-px w-12 bg-[#c9a96e] mb-6" />

            <p style={{ fontFamily: optima, fontSize: '13px', fontWeight: 300, letterSpacing: '0.04em', color: 'rgba(239,233,225,0.65)', lineHeight: 1.9, marginBottom: '14px' }}>
              Every piece at Ijaz Casting &amp; Jewellery Centre is thoughtfully designed and meticulously crafted by skilled artisans with a quarter-century of goldsmithing mastery.
            </p>
            <p style={{ fontFamily: optima, fontSize: '13px', fontWeight: 300, letterSpacing: '0.04em', color: 'rgba(239,233,225,0.65)', lineHeight: 1.9, marginBottom: '32px' }}>
              Uncompromising attention to detail ensures every piece becomes an heirloom worthy of generations.
            </p>

            {/* Stats — 3 only (5K+ removed) */}
            <div className="grid grid-cols-3 gap-6 mb-10">
              {stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-[#5c1a25] flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className="text-[#c9a96e]" />
                  </div>
                  <div>
                    <div style={{ fontFamily: optima, fontSize: '22px', fontWeight: 300, color: '#c9a96e' }}>{value}</div>
                    <div style={{ fontFamily: optima, fontSize: '10px', fontWeight: 300, color: 'rgba(239,233,225,0.45)', letterSpacing: '0.06em' }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="inline-flex items-center border border-[#c9a96e]/50 text-[#c9a96e] hover:bg-[#c9a96e]/10 transition-colors"
              style={{ fontFamily: optima, fontSize: '9px', fontWeight: 400, letterSpacing: '0.3em', textTransform: 'uppercase', padding: '13px 28px' }}
            >
              Learn Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
