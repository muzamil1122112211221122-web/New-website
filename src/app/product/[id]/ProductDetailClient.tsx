'use client';

import { useState, useEffect } from 'react';
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

  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [newReview, setNewReview] = useState({ name: '', city: '', rating: 5, text: '', image: null as string | null });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews?productId=${product.id}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [product.id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/jpeg', 0.7);
        setNewReview({ ...newReview, image: base64 });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const reviewPayload = {
        ...newReview,
        product_id: product.id,
        initials: newReview.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      };
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewPayload)
      });
      if (res.ok) {
        setReviewSubmitted(true);
        const data = await res.json();
        setReviews([data, ...reviews]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingReview(false);
    }
  };

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

          {(reviews.length > 0) && (
            <div className="flex items-center gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className={i < Math.floor(reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length) ? 'fill-[#c9a96e] text-[#c9a96e]' : 'text-[#c9a96e]/30'} />
              ))}
              <span className="text-[#5c1a25]/50 text-sm ml-2">({reviews.length} reviews)</span>
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

      {/* Reviews Section */}
      <div className="mt-20 border-t border-[#5c1a25]/10 pt-12">
        <h2 className="font-playfair text-2xl text-[#5c1a25] mb-8">Customer Reviews</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Add Review Form (Left) */}
          <div className="lg:col-span-1 bg-white/60 p-6 border border-[#5c1a25]/10 h-fit">
            <h3 className="font-playfair text-xl text-[#5c1a25] mb-6">Write a Review</h3>
            {reviewSubmitted ? (
              <p className="text-green-600 font-medium">Thank you for your review!</p>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#5c1a25]/70 mb-1">Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: num })}
                        className="p-1 focus:outline-none"
                      >
                        <Star size={20} className={num <= newReview.rating ? 'fill-[#c9a96e] text-[#c9a96e]' : 'text-[#c9a96e]/30'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#5c1a25]/70 mb-1">Name</label>
                  <input required type="text" value={newReview.name} onChange={e => setNewReview({ ...newReview, name: e.target.value })} className="w-full border border-[#5c1a25]/20 p-2 text-sm bg-transparent outline-none focus:border-[#c9a96e]" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#5c1a25]/70 mb-1">City</label>
                  <input required type="text" value={newReview.city} onChange={e => setNewReview({ ...newReview, city: e.target.value })} className="w-full border border-[#5c1a25]/20 p-2 text-sm bg-transparent outline-none focus:border-[#c9a96e]" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#5c1a25]/70 mb-1">Review</label>
                  <textarea required rows={4} value={newReview.text} onChange={e => setNewReview({ ...newReview, text: e.target.value })} className="w-full border border-[#5c1a25]/20 p-2 text-sm bg-transparent outline-none focus:border-[#c9a96e] resize-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#5c1a25]/70 mb-1">Attach Image (Optional)</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-[#5c1a25]/70 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:uppercase file:tracking-wider file:bg-[#5c1a25]/10 file:text-[#5c1a25] hover:file:bg-[#5c1a25]/20" />
                  {newReview.image && (
                    <div className="mt-2">
                      <Image src={newReview.image} alt="Preview" width={100} height={100} className="object-cover border border-[#5c1a25]/20" />
                    </div>
                  )}
                </div>
                <button type="submit" disabled={submittingReview} className="w-full bg-[#5c1a25] text-[#EFE9E1] py-3 text-xs tracking-[0.2em] uppercase hover:bg-[#7a2535] transition-colors disabled:opacity-50">
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>

          {/* Reviews List (Right) */}
          <div className="lg:col-span-2 space-y-6">
            {reviewsLoading ? (
              <p className="text-[#5c1a25]/50">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-[#5c1a25]/50">No reviews yet. Be the first to review this product!</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="bg-white/40 border border-[#5c1a25]/10 p-6 flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className={i < review.rating ? 'fill-[#c9a96e] text-[#c9a96e]' : 'text-[#c9a96e]/30'} />
                      ))}
                    </div>
                    <h4 className="font-playfair text-lg text-[#5c1a25] font-medium">{review.name}</h4>
                    <p className="text-xs text-[#5c1a25]/50 mb-3">{review.city}</p>
                    <p className="font-cormorant text-[#5c1a25]/80">{review.text}</p>
                  </div>
                  {review.image && (
                    <div className="flex-shrink-0">
                      <div className="relative w-24 h-24 border border-[#5c1a25]/10 bg-white">
                        <Image src={review.image} alt="Review attachment" fill className="object-cover" />
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
