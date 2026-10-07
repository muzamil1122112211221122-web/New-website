import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { products } from '@/data/products';
import ProductCard from './ProductCard';

export default function BestSellers() {
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
