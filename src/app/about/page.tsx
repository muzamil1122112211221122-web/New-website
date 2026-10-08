import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Award, Gem, Hammer, Shield, Heart, Star } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        {/* Hero */}
        <div className="relative h-72 md:h-96 overflow-hidden">
          <Image src="/p6.jpg" alt="About IC" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#1a0a0d]/70" />
          <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
            <div>
              <p className="font-optima text-[#c9a96e] tracking-[0.4em] uppercase text-sm mb-3">Our Story</p>
              <h1 className="font-playfair text-[#EFE9E1] text-4xl md:text-6xl font-bold mb-4">About IC</h1>
              <div className="h-px w-20 bg-[#c9a96e] mx-auto" />
            </div>
          </div>
        </div>

        {/* Story */}
        <section className="py-20 px-6 lg:px-10 bg-[#EFE9E1]">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-optima text-[#c9a96e] tracking-[0.3em] uppercase text-sm mb-4">Who We Are</p>
            <h2 className="section-heading mb-6">Ijaz Casting & Jewellery Centre</h2>
            <div className="gold-divider w-24 mx-auto mb-8" />
            <p className="font-optima text-[#5c1a25]/80 text-lg leading-relaxed mb-5">
              For over two and a half decades, Ijaz Casting & Jewellery Centre (IC) has been synonymous with 
              uncompromising quality, timeless designs, and masterful craftsmanship in Pakistan&apos;s jewellery industry.
            </p>
            <p className="font-optima text-[#5c1a25]/70 text-base leading-relaxed">
              Founded by Ijaz Hussain, our establishment has grown from a small casting workshop into one of the 
              region&apos;s most trusted names in fine jewellery — creating pieces that celebrate life&apos;s most 
              cherished moments, from engagements and weddings to anniversaries and milestones.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 px-6 lg:px-10 bg-[#5c1a25]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-playfair text-[#EFE9E1] text-3xl font-bold">Our Values</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                { icon: Award, label: 'Excellence' },
                { icon: Gem, label: 'Authenticity' },
                { icon: Hammer, label: 'Craftsmanship' },
                { icon: Shield, label: 'Trust' },
                { icon: Heart, label: 'Passion' },
                { icon: Star, label: 'Integrity' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="text-center">
                  <div className="w-14 h-14 border-2 border-[#c9a96e] flex items-center justify-center mx-auto mb-3">
                    <Icon size={22} className="text-[#c9a96e]" />
                  </div>
                  <p className="font-optima text-[#EFE9E1]/80 text-sm tracking-widest uppercase">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
