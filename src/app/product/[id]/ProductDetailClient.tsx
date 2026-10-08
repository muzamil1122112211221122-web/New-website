'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Star, CheckCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function ProductDetailClient({ product }: { product: any }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const images = Array.from(new Set([product.image, ...(product.images || [])]));
  const [activeImage, setActiveImage] = useState(images[0]);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);

  const handleAdd = () => {
    setAdding(true);
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image });
    setTimeout(() => {
      setAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }, 500);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Left: Images */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible no-scrollbar pb-2 md:pb-0">
            {images.map((img: any, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 border transition-all ${activeImage === img ? 'border-[#5c1a25]' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <Image src={img} alt={`${product.name} view ${i}`} fill className="object-cover" />
              </button>
            ))}
          </div>
          <div 
            className="relative aspect-square flex-1 bg-white/40 border border-[#5c1a25]/10 overflow-hidden cursor-crosshair group"
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleMouseMove}
          >
            <Image 
              src={activeImage} 
              alt={product.name} 
              fill 
              className={`object-cover transition-transform duration-200 ease-out ${isZooming ? 'scale-150' : 'scale-100'}`} 
              style={{ transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }}
              priority 
            />
            {product.is_best_seller && (
              <span className="absolute top-4 left-4 bg-[#c9a96e] text-white px-3 py-1 text-xs tracking-wider uppercase font-medium">Best Seller</span>
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col justify-center">
          <p className="font-optima text-[#c9a96e] tracking-[0.3em] uppercase text-xs mb-2">
            {product.category || 'Jewellery'}
          </p>
          <h1 className="font-playfair text-3xl md:text-4xl text-[#5c1a25] font-medium mb-4">
            {product.name}
          </h1>

          {(product.reviews > 0) && (
            <div className="flex items-center gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className={i < Math.floor(product.rating || 5) ? 'fill-[#c9a96e] text-[#c9a96e]' : 'text-[#c9a96e]/30'} />
              ))}
              <span className="text-[#5c1a25]/50 text-sm ml-2">({product.reviews} reviews)</span>
            </div>
          )}

          <div className="flex items-end gap-3 mb-8">
            <span className="font-playfair text-2xl text-[#5c1a25] font-semibold">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.original_price && (
              <span className="text-lg text-[#5c1a25]/40 line-through mb-0.5">
                Rs. {product.original_price.toLocaleString()}
              </span>
            )}
          </div>

          <p className="font-cormorant text-[#5c1a25]/80 text-lg mb-8 leading-relaxed">
            {product.description || "Exquisitely crafted to perfection. A timeless piece that speaks volumes of elegance and luxury."}
          </p>

          {/* Add to Cart only — no wishlist button */}
          <button
            onClick={handleAdd}
            disabled={adding || added}
            className="w-full bg-[#5c1a25] text-[#EFE9E1] py-4 flex items-center justify-center gap-2 hover:bg-[#7a2535] transition-all disabled:opacity-80 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Optima Nova LT Pro', Optima, sans-serif", fontSize: '11px', letterSpacing: '0.2em' }}
          >
            {added ? <CheckCircle size={18} /> : <ShoppingBag size={18} />}
            {added ? 'ADDED TO CART' : adding ? 'ADDING...' : 'ADD TO CART'}
          </button>

          <div className="mt-10 pt-6 border-t border-[#5c1a25]/10 space-y-3">
            <div className="flex items-center gap-4 text-sm text-[#5c1a25]/70">
              <span className="w-24 font-medium uppercase text-xs tracking-wider">Material</span>
              <span>{product.material || '21k Gold'}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-[#5c1a25]/70">
              <span className="w-24 font-medium uppercase text-xs tracking-wider">Shipping</span>
              <span>Free nationwide delivery in 3-5 days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
