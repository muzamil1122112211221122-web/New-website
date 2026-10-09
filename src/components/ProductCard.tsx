// @ts-nocheck
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <div className="product-card group bg-white/40 backdrop-blur-sm border border-[#5c1a25]/10 overflow-hidden rounded-lg">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-[#ffffff]">
        <Link href={`/product/${product.id}`} className="absolute inset-0 z-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {(product.isNew || product.is_new) && (
            <span className="badge bg-[#5c1a25] text-[#ffffff]">New</span>
          )}
          {(product.isBestSeller || product.is_best_seller) && (
            <span className="badge bg-[#c9a96e] text-white">Best Seller</span>
          )}
          
        </div>

        {/* Quick Add */}
        <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <button
            onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image })}
            className="w-full bg-[#5c1a25] text-[#ffffff] py-3.5 flex items-center justify-center gap-2 hover:bg-[#7a2535] transition-colors rounded-b-sm"
            style={{
              fontFamily: "'Optima Nova LT Pro', Optima, 'Gill Sans MT', sans-serif",
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.25em',
              whiteSpace: 'nowrap',
            }}
          >
            <ShoppingBag size={14} />
            ADD TO CART
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p
          className="text-[#5c1a25]/45 uppercase mb-1.5"
          style={{
            fontFamily: "'Optima Nova LT Pro', Optima, 'Gill Sans MT', sans-serif",
            fontSize: '9px',
            fontWeight: 300,
            letterSpacing: '0.3em',
          }}
        >
          {product.material}
        </p>
        <Link href={`/product/${product.id}`}>
          <h3
            className="text-[#5c1a25] mb-2.5 hover:text-[#5c1a25]/65 transition-colors leading-snug"
            style={{
              fontFamily: "'Optima Nova LT Pro', Optima, var(--font-optima), serif",
              fontSize: '14px',
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            {product.name}
          </h3>
        </Link>



        {/* Price */}
        <div className="flex items-center gap-2">
          <span
            className="text-[#5c1a25]"
            style={{
              fontFamily: "'Optima Nova LT Pro', Optima, var(--font-optima), serif",
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            {product.price === 0 ? "Get info on WhatsApp" : `Rs. ${product.price.toLocaleString()}`}
          </span>
          
        </div>
      </div>
    </div>
  );
}
