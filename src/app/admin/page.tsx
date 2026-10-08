'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Package, Phone, MapPin, User, Clock, CheckCircle,
  Truck, XCircle, RefreshCw, Search, ChevronDown,
  ShoppingBag, TrendingUp, Users, DollarSign, Eye, X,
  Plus, Edit, Trash2, Image as ImageIcon, Star, Calendar
} from 'lucide-react';
import { Product } from '@/data/products';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem { id: string; name: string; price: number; quantity: number; image: string; }
interface Order { id: string; orderNumber: string; customerName: string; customerPhone: string; customerEmail: string; address: string; city: string; items: OrderItem[]; total: number; status: OrderStatus; createdAt: string; notes?: string; }
interface FeaturedCol { name: string; image: string; count: number; href: string; desc: string; }

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending:    { label: 'Pending',    color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200',  icon: Clock },
  processing: { label: 'Processing', color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',    icon: RefreshCw },
  shipped:    { label: 'Shipped',    color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', icon: Truck },
  delivered:  { label: 'Delivered',  color: 'text-green-700',  bg: 'bg-green-50 border-green-200',   icon: CheckCircle },
  cancelled:  { label: 'Cancelled',  color: 'text-red-700',    bg: 'bg-red-50 border-red-200',       icon: XCircle },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color}`}>
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

export default function AdminDashboard() {
  // Authentication states
  const [authStep, setAuthStep] = useState<'login' | 'pin' | 'authenticated'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [authError, setAuthError] = useState('');

  const [tab, setTab] = useState<'orders' | 'products' | 'featured' | 'reviews'>('orders');
  
  // Data
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [featured, setFeatured] = useState<FeaturedCol[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals & States
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Product Edit
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [resO, resP, resF, resR] = await Promise.all([
        fetch('/api/orders').catch(() => null),
        fetch('/api/products').catch(() => null),
        fetch('/api/featured').catch(() => null),
        fetch('/api/reviews').catch(() => null)
      ]);
      if (resO) setOrders((await resO.json()).orders || []);
      if (resP) setProducts(await resP.json());
      if (resF) setFeatured(await resF.json());
      if (resR) setReviews(await resR.json());
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    if (selectedOrder?.id === id) setSelectedOrder((prev) => prev ? { ...prev, status } : null);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const isNew = !products.find(p => p.id === editingProduct.id);
    const updatedProducts = isNew ? [editingProduct, ...products] : products.map(p => p.id === editingProduct.id ? editingProduct : p);
    await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingProduct) });
    setProducts(updatedProducts);
    setShowProductModal(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await fetch('/api/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setProducts(products.filter(p => p.id !== id));
  };

  const handleSaveFeatured = async () => {
    await fetch('/api/featured', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(featured) });
    alert('Featured Collections Saved!');
  };

  const handleImageUpload = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => callback(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    await fetch('/api/reviews', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setReviews(reviews.filter(r => r.id !== id));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'alisulmancasting295@gmail.com' && password === 'Sargodha 1111') {
      setAuthError('');
      setAuthStep('pin');
    } else {
      setAuthError('Invalid email or password');
    }
  };

  const handlePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '4630') {
      setAuthError('');
      setAuthStep('authenticated');
    } else {
      setAuthError('Invalid 4-digit PIN');
    }
  };

  if (authStep === 'login') {
    return (
      <div className="min-h-screen bg-[#EFE9E1] flex items-center justify-center p-6">
        <div className="bg-white max-w-md w-full p-8 rounded-xl shadow-2xl border border-[#5c1a25]/10">
          <div className="text-center mb-8">
            <h1 className="font-playfair text-3xl text-[#5c1a25] mb-2">IJC Admin Panel</h1>
            <p className="text-sm text-gray-500 font-optima tracking-widest uppercase">Secure Login</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            {authError && <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded">{authError}</p>}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
              <input type="email" required className="w-full border border-gray-300 rounded p-2.5 outline-none focus:border-[#5c1a25]" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Password</label>
              <input type="password" required className="w-full border border-gray-300 rounded p-2.5 outline-none focus:border-[#5c1a25]" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="w-full bg-[#5c1a25] text-white py-3 rounded tracking-widest font-semibold hover:bg-[#7a2535] transition-colors mt-2">LOGIN</button>
          </form>
        </div>
      </div>
    );
  }

  if (authStep === 'pin') {
    return (
      <div className="min-h-screen bg-[#EFE9E1] flex items-center justify-center p-6">
        <div className="bg-white max-w-md w-full p-8 rounded-xl shadow-2xl border border-[#5c1a25]/10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h1 className="font-playfair text-2xl text-[#5c1a25] mb-2">2-Step Verification</h1>
            <p className="text-sm text-gray-500 font-optima leading-relaxed">
              We have sent a 4-digit verification PIN to <b>{email}</b>. Please enter it below to securely access the panel.
            </p>
          </div>
          <form onSubmit={handlePin} className="space-y-5">
            {authError && <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded">{authError}</p>}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 text-center">Enter 4-Digit PIN</label>
              <input type="text" required maxLength={4} pattern="\d{4}" className="w-full border border-gray-300 rounded p-3 text-center text-2xl tracking-[1em] font-mono outline-none focus:border-[#5c1a25]" placeholder="----" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} />
            </div>
            <button type="submit" className="w-full bg-[#c9a96e] text-white py-3 rounded tracking-widest font-semibold hover:bg-[#b0925c] transition-colors mt-2">VERIFY & ENTER</button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) return <div className="p-20 text-center">Loading Admin...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-[#5c1a25] text-[#EFE9E1] flex-shrink-0 flex flex-col shadow-xl">
        <div className="p-6 border-b border-white/10">
          <h1 className="font-playfair text-2xl tracking-widest text-[#c9a96e]">IJC ADMIN</h1>
        </div>
        <div className="flex-1 py-4 flex flex-col gap-1">
          <button onClick={() => setTab('orders')} className={`px-6 py-3 flex items-center gap-3 text-sm tracking-widest transition-colors ${tab === 'orders' ? 'bg-white/10 border-l-4 border-[#c9a96e]' : 'hover:bg-white/5 border-l-4 border-transparent'}`}>
            <ShoppingBag size={18} /> ORDERS
          </button>
          <button onClick={() => setTab('products')} className={`px-6 py-3 flex items-center gap-3 text-sm tracking-widest transition-colors ${tab === 'products' ? 'bg-white/10 border-l-4 border-[#c9a96e]' : 'hover:bg-white/5 border-l-4 border-transparent'}`}>
            <Package size={18} /> PRODUCTS
          </button>
          <button onClick={() => setTab('featured')} className={`px-6 py-3 flex items-center gap-3 text-sm tracking-widest transition-colors ${tab === 'featured' ? 'bg-white/10 border-l-4 border-[#c9a96e]' : 'hover:bg-white/5 border-l-4 border-transparent'}`}>
            <ImageIcon size={18} /> SHOWPIECE
          </button>
          <button onClick={() => setTab('reviews')} className={`px-6 py-3 flex items-center gap-3 text-sm tracking-widest transition-colors ${tab === 'reviews' ? 'bg-white/10 border-l-4 border-[#c9a96e]' : 'hover:bg-white/5 border-l-4 border-transparent'}`}>
            <Star size={18} /> REVIEWS
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-y-auto p-8 h-screen">
        
        {/* ORDERS TAB */}
        {tab === 'orders' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <h2 className="text-2xl font-playfair text-[#5c1a25]">Recent Orders</h2>
            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-mono text-sm">{o.orderNumber}</td>
                      <td className="p-4"><div className="font-semibold text-gray-900">{o.customerName}</div><div className="text-xs text-gray-500">{o.customerPhone}</div></td>
                      <td className="p-4">
                        <div className="text-sm font-semibold text-gray-700">{new Date(o.createdAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                        <div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                      </td>
                      <td className="p-4"><StatusBadge status={o.status} /></td>
                      <td className="p-4 text-right"><button onClick={() => setSelectedOrder(o)} className="text-[#5c1a25] hover:underline text-sm font-semibold">View Details</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {tab === 'products' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-playfair text-[#5c1a25]">Product Management</h2>
              <button onClick={() => {
                setEditingProduct({ id: 'p-'+Date.now(), name: '', category: 'rings', price: 0, originalPrice: null, image: '', images: [], description: '', material: '21k Gold', weight: '', isBestSeller: false, isNew: true, rating: 5, reviews: 0 });
                setShowProductModal(true);
              }} className="bg-[#5c1a25] text-white px-4 py-2 rounded flex items-center gap-2 text-sm">
                <Plus size={16} /> Add Product
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 group">
                  <div className="relative aspect-square w-full mb-4 bg-gray-100 rounded-lg overflow-hidden">
                    {p.image && <Image src={p.image} alt={p.name} fill className="object-cover" />}
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate">{p.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">Rs. {p.price.toLocaleString()}</p>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingProduct(p); setShowProductModal(true); }} className="flex-1 bg-gray-100 text-gray-700 py-1.5 rounded text-sm hover:bg-gray-200">Edit</button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="flex-1 bg-red-50 text-red-600 py-1.5 rounded text-sm hover:bg-red-100">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FEATURED TAB */}
        {tab === 'featured' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-playfair text-[#5c1a25]">Showpiece / Featured Collections</h2>
              <button onClick={handleSaveFeatured} className="bg-[#5c1a25] text-white px-6 py-2 rounded text-sm font-semibold">
                Save All Changes
              </button>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              {featured.map((col, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex gap-6">
                  <div className="w-32 h-40 bg-gray-100 relative rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 group">
                    {col.image && <Image src={col.image} alt={col.name} fill className="object-cover" />}
                    <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <ImageIcon size={20} className="mb-1" />
                      <span className="text-xs">Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, (b64) => {
                          const newF = [...featured]; newF[idx].image = b64; setFeatured(newF);
                        });
                      }} />
                    </label>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Title</label>
                      <input type="text" className="w-full border-b border-gray-200 py-1 outline-none focus:border-[#5c1a25]" value={col.name} onChange={(e) => { const newF = [...featured]; newF[idx].name = e.target.value; setFeatured(newF); }} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
                      <input type="text" className="w-full border-b border-gray-200 py-1 outline-none focus:border-[#5c1a25]" value={col.desc} onChange={(e) => { const newF = [...featured]; newF[idx].desc = e.target.value; setFeatured(newF); }} />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Item Count</label>
                        <input type="number" className="w-full border-b border-gray-200 py-1 outline-none focus:border-[#5c1a25]" value={col.count} onChange={(e) => { const newF = [...featured]; newF[idx].count = parseInt(e.target.value) || 0; setFeatured(newF); }} />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Link URL</label>
                        <input type="text" className="w-full border-b border-gray-200 py-1 outline-none focus:border-[#5c1a25]" value={col.href} onChange={(e) => { const newF = [...featured]; newF[idx].href = e.target.value; setFeatured(newF); }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {tab === 'reviews' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <h2 className="text-2xl font-playfair text-[#5c1a25]">User Reviews</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {reviews.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No custom reviews found.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      <th className="p-4">Customer</th>
                      <th className="p-4">Review</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reviews.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50/50">
                        <td className="p-4">
                          <div className="font-semibold text-gray-900">{r.name}</div>
                          <div className="text-xs text-gray-500">{r.city}</div>
                        </td>
                        <td className="p-4 max-w-md">
                          <p className="text-sm text-gray-700 truncate">{r.text}</p>
                        </td>
                        <td className="p-4 text-sm font-bold text-[#c9a96e]">{r.rating} / 5</td>
                        <td className="p-4 text-right">
                          <button onClick={() => handleDeleteReview(r.id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showProductModal && editingProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900">Edit Product</h2>
              <button onClick={() => setShowProductModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4">
              <div className="flex gap-6">
                <div className="w-40 flex flex-col gap-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase">Product Images</label>
                  <div className="grid grid-cols-2 gap-2">
                    {editingProduct.images?.map((imgUrl: string, idx: number) => (
                      <div key={idx} className="aspect-square bg-gray-100 rounded relative overflow-hidden border group">
                        <Image src={imgUrl} alt="preview" fill className="object-cover" />
                        <button type="button" onClick={() => {
                          const newImgs = [...(editingProduct.images || [])];
                          newImgs.splice(idx, 1);
                          setEditingProduct({...editingProduct, images: newImgs, image: newImgs[0] || ''});
                        }} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <label className="aspect-square bg-gray-50 border border-dashed rounded flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-[#5c1a25] hover:bg-gray-100 transition-colors">
                      <Plus size={20} />
                      <span className="text-[10px] uppercase font-bold mt-1">Add</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if(file) handleImageUpload(file, (b64) => {
                          const newImgs = [...(editingProduct.images || []), b64];
                          setEditingProduct({...editingProduct, images: newImgs, image: newImgs[0] || ''});
                        });
                      }} />
                    </label>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-tight">First image will be the primary thumbnail.</p>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase">Name</label>
                    <input required type="text" className="w-full border rounded p-2 mt-1" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase">Price (Rs.)</label>
                      <input required type="number" className="w-full border rounded p-2 mt-1" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseInt(e.target.value) || 0})} />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase">Discount Price (Old)</label>
                      <input type="number" className="w-full border rounded p-2 mt-1" value={editingProduct.originalPrice || ''} placeholder="Optional" onChange={e => setEditingProduct({...editingProduct, originalPrice: e.target.value ? parseInt(e.target.value) : null})} />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase">Category</label>
                      <select className="w-full border rounded p-2 mt-1" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                        <option value="rings">Rings</option>
                        <option value="necklaces">Necklaces</option>
                        <option value="earrings">Earrings</option>
                        <option value="bracelets">Bracelets</option>
                        <option value="bangles">Bangles</option>
                        <option value="pendants">Pendants</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <input type="checkbox" id="bestSeller" checked={editingProduct.isBestSeller || editingProduct.is_best_seller} onChange={e => setEditingProduct({...editingProduct, isBestSeller: e.target.checked, is_best_seller: e.target.checked})} className="w-4 h-4 accent-[#5c1a25]" />
                    <label htmlFor="bestSeller" className="text-sm font-semibold text-gray-700 cursor-pointer">Mark as Top Seller</label>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase">Description</label>
                    <textarea className="w-full border rounded p-2 mt-1 h-20" value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="border-t pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowProductModal(false)} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-[#5c1a25] text-white rounded font-semibold">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedOrder.orderNumber}</h2>
                <p className="text-sm text-gray-500 font-medium">
                  {new Date(selectedOrder.createdAt).toLocaleDateString('en-PK', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })} • {new Date(selectedOrder.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} className="text-gray-500" /></button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="flex items-center gap-4 mb-8">
                <span className="font-semibold text-gray-700">Update Status:</span>
                <div className="flex flex-wrap gap-2">
                  {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((st) => (
                    <button key={st} onClick={() => updateStatus(selectedOrder.id, st)} className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${selectedOrder.status === st ? STATUS_CONFIG[st].bg + ' ' + STATUS_CONFIG[st].color + ' ring-2 ring-offset-1 ring-' + STATUS_CONFIG[st].color.split('-')[1] + '-500' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      {STATUS_CONFIG[st].label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><ShoppingBag size={18} /> Order Items</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                      <div className="relative w-16 h-16 rounded bg-white border border-gray-200 overflow-hidden"><Image src={item.image} alt={item.name} fill className="object-cover" /></div>
                      <div className="flex-1"><div className="font-semibold text-gray-900">{item.name}</div><div className="text-sm text-gray-500">Qty: {item.quantity}</div></div>
                      <div className="font-bold text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 px-3"><span className="font-bold text-gray-700">Total Amount</span><span className="text-xl font-bold text-[#5c1a25]">Rs. {selectedOrder.total.toLocaleString()}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
