import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroCanvas from '@/components/HeroCanvas';
import FeaturedCollections from '@/components/FeaturedCollections';
import BestSellers from '@/components/BestSellers';
import CraftsmanshipSection from '@/components/CraftsmanshipSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import MarqueeBar from '@/components/MarqueeBar';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Canvas pinned hero — occupies 500vh scroll distance */}
        <HeroCanvas />
        <MarqueeBar />
        <FeaturedCollections />
        <BestSellers />
        <CraftsmanshipSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  );
}
