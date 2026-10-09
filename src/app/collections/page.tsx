'use client';

import { useState, useEffect, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { fetchWithCache } from '@/lib/fetchCache';
import { SlidersHorizontal, X, ArrowLeft } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

const categories = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bangles', 'Nose Pins'];

function CollectionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const catParam = searchParams.get('cat');
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (catParam) {
      const match = categories.find(c => c.toLowerCase() === catParam.toLowerCase());
      if (match) setActiveCategory(match);
    }
    setLoading(true);
    fetchWithCache('/api/products').then(data => {
      if (Array.isArray(data)) setProducts(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [catParam]);

  const filtered = products
    .filter((p) => activeCategory === 'All' || p.category === activeCategory.toLowerCase())
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Banner */}
        <div className="bg-[#5c1a25] pt-32 pb-16 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, #c9a96e 0, #c9a96e 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
          <p className="font-optima text-[#c9a96e] tracking-[0.4em] uppercase text-sm mb-3 relative">IC</p>
          <h1 className="font-playfair text-[#ffffff] text-4xl md:text-5xl font-bold relative">Our Collections</h1>
          <p className="font-optima text-[#ffffff]/60 mt-3 text-base relative">Handcrafted excellence in every piece</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-[#5c1a25]/60 hover:text-[#5c1a25] transition-colors font-optima text-xs uppercase tracking-widest mb-8">
            <ArrowLeft size={16} /> Back
          </button>
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#5c1a25]/15">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 font-optima text-sm tracking-widest uppercase transition-all border rounded-md ${
                    activeCategory === cat
                      ? 'bg-[#5c1a25] text-[#ffffff] border-[#5c1a25]'
                      : 'bg-transparent text-[#5c1a25] border-[#5c1a25]/30 hover:border-[#5c1a25]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort + Count */}
            <div className="flex items-center gap-4">
              <span className="font-optima text-[#5c1a25]/50 text-sm">{filtered.length} pieces</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-input w-auto py-2 text-sm cursor-pointer rounded-md"
              >
                <option value="default">Sort By: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-[#5c1a25]/10 aspect-square w-full mb-3" />
                  <div className="bg-[#5c1a25]/10 h-4 w-3/4 mb-2" />
                  <div className="bg-[#5c1a25]/10 h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-optima text-[#5c1a25]/50 text-xl">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#ffffff] font-optima text-[#5c1a25] tracking-widest uppercase">Loading Collections...</div>}>
      <CollectionsContent />
    </Suspense>
  );
}
