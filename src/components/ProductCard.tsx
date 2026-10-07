'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/data/products';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="product-card group bg-white/40 backdrop-blur-sm border border-[#5c1a25]/10 overflow-hidden">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-[#f5f0ea]">
        <Link href={`/product/${product.id}`} className="absolute inset-0 z-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {(product.isNew || product.is_new) && (
            <span className="badge bg-[#5c1a25] text-[#EFE9E1]">New</span>
          )}
          {(product.isBestSeller || product.is_best_seller) && (
            <span className="badge bg-[#c9a96e] text-white">Best Seller</span>
          )}
          {(product.originalPrice || product.original_price) && (
            <span className="badge bg-red-500 text-white">
              {Math.round((((product.originalPrice || product.original_price) - product.price) / (product.originalPrice || product.original_price)) * 100)}% Off
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#5c1a25] hover:text-white text-[#5c1a25]">
          <Heart size={15} />
        </button>

        {/* Quick Add — slides up from bottom, stays INSIDE overflow-hidden */}
        <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <button
            onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image })}
            className="w-full bg-[#5c1a25] text-[#EFE9E1] py-3.5 flex items-center justify-center gap-2 hover:bg-[#7a2535] transition-colors"
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
              fontFamily: "'Optima Nova LT Pro', Optima, var(--font-playfair), serif",
              fontSize: '14px',
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={11}
              className={i < Math.floor(product.rating || 5) ? 'fill-[#c9a96e] text-[#c9a96e]' : 'text-[#c9a96e]/30'}
            />
          ))}
          <span
            className="text-[#5c1a25]/40 ml-1.5"
            style={{ fontFamily: 'Optima, sans-serif', fontSize: '10px' }}
          >
            ({product.reviews || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span
            className="text-[#5c1a25]"
            style={{
              fontFamily: "'Optima Nova LT Pro', Optima, var(--font-playfair), serif",
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            Rs. {product.price.toLocaleString()}
          </span>
          {(product.originalPrice || product.original_price) && (
            <span
              className="text-[#5c1a25]/35 line-through"
              style={{ fontFamily: 'Optima, sans-serif', fontSize: '12px' }}
            >
              Rs. {(product.originalPrice || product.original_price).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
