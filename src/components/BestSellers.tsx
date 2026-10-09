'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchWithCache } from '@/lib/fetchCache';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function BestSellers() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithCache('/api/products').then(data => {
      if (Array.isArray(data)) setProducts(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const bestSellers = products.filter((p) => p.isBestSeller || p.is_best_seller).slice(0, 4);

  return (
    <section className="py-20 px-6 lg:px-10" style={{ background: 'linear-gradient(135deg, #f5f0ea 0%, #EFE9E1 100%)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="font-cormorant text-[#c9a96e] tracking-[0.3em] uppercase text-sm mb-3">Customer Favourites</p>
            <h2 className="section-heading">Best Sellers</h2>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 font-cormorant text-[#5c1a25] font-semibold tracking-widest uppercase text-sm border-b border-[#5c1a25] pb-1 hover:text-[#c9a96e] hover:border-[#c9a96e] transition-colors"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-[#5c1a25]/10 aspect-square w-full mb-3" />
                <div className="bg-[#5c1a25]/10 h-4 w-3/4 mb-2" />
                <div className="bg-[#5c1a25]/10 h-4 w-1/2" />
              </div>
            ))
          ) : (
            bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
