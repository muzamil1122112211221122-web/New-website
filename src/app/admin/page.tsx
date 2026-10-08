'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';
import {
  Package, Phone, Clock, CheckCircle,
  Truck, XCircle, RefreshCw, ShoppingBag, TrendingUp,
  DollarSign, X, Plus, Edit, Trash2, Image as ImageIcon,
  Star, MessageSquare, BookOpen, BarChart2, ArrowUpRight,
  ArrowDownLeft, Eye, EyeOff, Wifi, WifiOff
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Supabase client (anon key — only reading real-time events)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://glvdbjkvkhuhssutkmpb.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsdmRiamt2a2h1aHNzdXRrbXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzNzk0MjcsImV4cCI6MjEwNjk1NTQyN30.FDAycFUf0eqTKhiMOQO5dXNchYj7Jp-QE-8F8O5TPwg'
);

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
type Tab = 'dashboard' | 'orders' | 'custom-orders' | 'products' | 'featured' | 'reviews' | 'ledger';

interface OrderItem { id: string; name: string; price: number; quantity: number; image: string; }
interface Order { id: string; orderNumber: string; customerName: string; customerPhone: string; customerEmail: string; address: string; city: string; items: OrderItem[]; total: number; status: OrderStatus; createdAt: string; notes?: string; }
interface FeaturedCol { name: string; image: string; count: number; href: string; desc: string; }
interface CustomOrder { id: string; name: string; phone: string; email?: string; message: string; read: boolean; created_at: string; }
interface LedgerEntry { id: string; type: 'income' | 'expense'; description: string; amount: number; date: string; category: string; }

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
      <Icon size={11} />{cfg.label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [authStep, setAuthStep] = useState<'login' | 'pin' | 'authenticated'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const [tab, setTab] = useState<Tab>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [featured, setFeatured] = useState<FeaturedCol[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAlert, setNewAlert] = useState<string | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedCustomOrder, setSelectedCustomOrder] = useState<CustomOrder | null>(null);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showLedgerModal, setShowLedgerModal] = useState(false);
  const [newLedger, setNewLedger] = useState<Partial<LedgerEntry>>({ type: 'income', date: new Date().toISOString().split('T')[0] });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [resO, resP, resF, resR, resCO, resL] = await Promise.all([
        fetch('/api/orders').catch(() => null),
        fetch('/api/products').catch(() => null),
        fetch('/api/featured').catch(() => null),
        fetch('/api/reviews').catch(() => null),
        fetch('/api/custom-orders').catch(() => null),
        fetch('/api/ledger').catch(() => null),
      ]);
      if (resO) setOrders((await resO.json()).orders || []);
      if (resP) setProducts(await resP.json());
      if (resF) setFeatured(await resF.json());
      if (resR) setReviews(await resR.json());
      if (resCO && resCO.ok) setCustomOrders(await resCO.json());
      if (resL && resL.ok) setLedger(await resL.json());
    } catch { }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Real-time Supabase Subscriptions ──
  useEffect(() => {
    if (authStep !== 'authenticated') return;

    const showAlert = (msg: string) => {
      setNewAlert(msg);
      setTimeout(() => setNewAlert(null), 5000);
    };

    const channel = supabase
      .channel('admin-realtime')
      // New / updated orders
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        const row = payload.new as any;
        setOrders(prev => {
          if (prev.find(o => o.id === row.id)) return prev;
          return [{ ...row, orderNumber: row.order_number, customerName: row.customer_name, customerPhone: row.customer_phone, customerEmail: row.customer_email, createdAt: row.created_at }, ...prev];
        });
        showAlert(`🛍️ New order from ${row.customer_name}!`);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
        const row = payload.new as any;
        setOrders(prev => prev.map(o => o.id === row.id ? { ...o, status: row.status } : o));
      })
      // New enquiries/custom orders
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'custom_orders' }, (payload) => {
        const row = payload.new as CustomOrder;
        setCustomOrders(prev => {
          if (prev.find(c => c.id === row.id)) return prev;
          return [row, ...prev];
        });
        showAlert(`💬 New enquiry from ${row.name}!`);
      })
      // Product changes
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'products' }, (payload) => {
        const row = payload.new as any;
        setProducts(prev => prev.find(p => p.id === row.id) ? prev : [row, ...prev]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'products' }, (payload) => {
        const row = payload.new as any;
        setProducts(prev => prev.map(p => p.id === row.id ? row : p));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'products' }, (payload) => {
        setProducts(prev => prev.filter(p => p.id !== (payload.old as any).id));
      })
      // Ledger changes
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ledger' }, (payload) => {
        const row = payload.new as LedgerEntry;
        setLedger(prev => prev.find(l => l.id === row.id) ? prev : [row, ...prev]);
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'ledger' }, (payload) => {
        setLedger(prev => prev.filter(l => l.id !== (payload.old as any).id));
      })
      .subscribe((status) => {
        setIsLive(status === 'SUBSCRIBED');
      });

    return () => { supabase.removeChannel(channel); };
  }, [authStep]);

  // Stats
  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0);
  const totalSales = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const unreadMsgs = customOrders.filter(c => !c.read).length;
  const ledgerIncome = ledger.filter(l => l.type === 'income').reduce((s, l) => s + l.amount, 0);
  const ledgerExpense = ledger.filter(l => l.type === 'expense').reduce((s, l) => s + l.amount, 0);
  const netProfit = ledgerIncome - ledgerExpense;

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayOrders = orders.filter(o => o.createdAt.startsWith(date) && o.status !== 'cancelled');
      const sales = dayOrders.reduce((sum, o) => sum + o.total, 0);
      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sales
      };
    });
  }, [orders]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    await fetch(`/api/orders/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    if (selectedOrder?.id === id) setSelectedOrder(prev => prev ? { ...prev, status } : null);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const isNew = !products.find(p => p.id === editingProduct.id);
    await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingProduct) });
    setProducts(isNew ? [editingProduct, ...products] : products.map(p => p.id === editingProduct.id ? editingProduct : p));
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

  const handleImageUpload = (file: File, callback: (b64: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => callback(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    await fetch('/api/reviews', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setReviews(reviews.filter(r => r.id !== id));
  };

  const markCustomOrderRead = async (co: CustomOrder) => {
    setSelectedCustomOrder(co);
    if (!co.read) {
      await fetch('/api/custom-orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: co.id, read: true }) });
      setCustomOrders(prev => prev.map(c => c.id === co.id ? { ...c, read: true } : c));
    }
  };

  const handleAddLedger = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/ledger', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newLedger) });
    const data = await res.json();
    setLedger([data, ...ledger]);
    setShowLedgerModal(false);
    setNewLedger({ type: 'income', date: new Date().toISOString().split('T')[0] });
  };

  const handleDeleteLedger = async (id: string) => {
    if (!confirm('Delete this entry?')) return;
    await fetch('/api/ledger', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setLedger(ledger.filter(l => l.id !== id));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'alisulmancasting295@gmail.com' && password === 'Sargodha 1111') {
      setAuthError(''); setAuthStep('pin');
    } else setAuthError('Invalid email or password');
  };

  const handlePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '4630') { setAuthError(''); setAuthStep('authenticated'); }
    else setAuthError('Invalid 4-digit PIN');
  };

  if (authStep === 'login') return (
    <div className="min-h-screen bg-[#EFE9E1] flex items-center justify-center p-6">
      <div className="bg-white max-w-md w-full p-8 rounded-xl shadow-2xl border border-[#5c1a25]/10">
        <div className="text-center mb-8">
          <h1 className="font-playfair text-3xl text-[#5c1a25] mb-2">IJC Admin Panel</h1>
          <p className="text-sm text-gray-500 tracking-widest uppercase">Secure Login</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          {authError && <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded">{authError}</p>}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
            <input type="email" required className="w-full border border-gray-300 rounded p-2.5 outline-none focus:border-[#5c1a25]" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} required className="w-full border border-gray-300 rounded p-2.5 outline-none focus:border-[#5c1a25] pr-10" value={password} onChange={e => setPassword(e.target.value)} />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="w-full bg-[#5c1a25] text-white py-3 rounded tracking-widest font-semibold hover:bg-[#7a2535] transition-colors mt-2">LOGIN</button>
        </form>
      </div>
    </div>
  );

  if (authStep === 'pin') return (
    <div className="min-h-screen bg-[#EFE9E1] flex items-center justify-center p-6">
      <div className="bg-white max-w-md w-full p-8 rounded-xl shadow-2xl border border-[#5c1a25]/10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle size={32} /></div>
          <h1 className="font-playfair text-2xl text-[#5c1a25] mb-2">2-Step Verification</h1>
          <p className="text-sm text-gray-500">Enter your 4-digit PIN to continue.</p>
        </div>
        <form onSubmit={handlePin} className="space-y-5">
          {authError && <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded">{authError}</p>}
          <input type="text" required maxLength={4} pattern="\d{4}" className="w-full border border-gray-300 rounded p-3 text-center text-2xl tracking-[1em] font-mono outline-none focus:border-[#5c1a25]" placeholder="----" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))} />
          <button type="submit" className="w-full bg-[#c9a96e] text-white py-3 rounded tracking-widest font-semibold hover:bg-[#b0925c] transition-colors">VERIFY & ENTER</button>
        </form>
      </div>
    </div>
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading Admin...</div>;

  const navItems: { key: Tab; icon: any; label: string; badge?: number }[] = [
    { key: 'dashboard', icon: BarChart2, label: 'DASHBOARD' },
    { key: 'orders', icon: ShoppingBag, label: 'ORDERS', badge: pendingOrders || undefined },
    { key: 'custom-orders', icon: MessageSquare, label: 'ENQUIRIES', badge: unreadMsgs || undefined },
    { key: 'products', icon: Package, label: 'PRODUCTS' },
    { key: 'featured', icon: ImageIcon, label: 'SHOWPIECE' },
    { key: 'reviews', icon: Star, label: 'REVIEWS' },
    { key: 'ledger', icon: BookOpen, label: 'LEDGER' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-[#5c1a25] text-[#EFE9E1] flex-shrink-0 flex flex-col shadow-xl">
        <div className="p-6 border-b border-white/10">
          <h1 className="font-playfair text-2xl tracking-widest text-[#c9a96e]">IJC ADMIN</h1>
          <p className="text-[10px] text-white/40 tracking-widest mt-1 uppercase">Ijaz Casting & Jewellery Centre</p>
        </div>
        <div className="flex-1 py-4 flex flex-col gap-0.5">
          {navItems.map(({ key, icon: Icon, label, badge }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-6 py-3 flex items-center gap-3 text-sm tracking-widest transition-colors relative ${tab === key ? 'bg-white/10 border-l-4 border-[#c9a96e] text-white' : 'hover:bg-white/5 border-l-4 border-transparent text-white/70'}`}>
              <Icon size={16} /> {label}
              {badge ? <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span> : null}
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-[10px] text-white/30 tracking-widest">Admin</p>
          <div className={`flex items-center gap-1.5 text-[10px] font-bold ${isLive ? 'text-green-400' : 'text-white/30'}`}>
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-white/20'}`} />
            {isLive ? 'LIVE' : 'OFFLINE'}
          </div>
        </div>
      </div>

      {/* Toast Alert */}
      {newAlert && (
        <div className="fixed top-6 right-6 z-[100] bg-[#5c1a25] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium animate-bounce-in max-w-xs">
          <span className="text-lg">{newAlert.split(' ')[0]}</span>
          <span>{newAlert.slice(newAlert.indexOf(' ')+1)}</span>
          <button onClick={() => setNewAlert(null)} className="ml-2 text-white/60 hover:text-white"><X size={14}/></button>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 h-screen">

        {/* ── DASHBOARD TAB ── */}
        {tab === 'dashboard' && (
          <div className="max-w-6xl mx-auto space-y-8">
            <div>
              <h2 className="text-2xl font-playfair text-[#5c1a25] mb-1">Business Dashboard</h2>
              <p className="text-sm text-gray-400">Real-time overview of your business</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={DollarSign} label="Total Revenue" value={`Rs. ${totalRevenue.toLocaleString()}`} sub="From delivered orders" color="bg-green-50 text-green-600" />
              <StatCard icon={ShoppingBag} label="Total Sales" value={`Rs. ${totalSales.toLocaleString()}`} sub="All non-cancelled" color="bg-blue-50 text-blue-600" />
              <StatCard icon={TrendingUp} label="Net Profit" value={`Rs. ${netProfit.toLocaleString()}`} sub="Income minus expenses" color={netProfit >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"} />
              <StatCard icon={Package} label="Total Orders" value={orders.length.toString()} sub={`${pendingOrders} pending`} color="bg-purple-50 text-purple-600" />
            </div>

            {/* More Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={CheckCircle} label="Delivered" value={orders.filter(o=>o.status==='delivered').length.toString()} color="bg-green-50 text-green-600" />
              <StatCard icon={Truck} label="Shipped" value={orders.filter(o=>o.status==='shipped').length.toString()} color="bg-purple-50 text-purple-600" />
              <StatCard icon={XCircle} label="Cancelled" value={orders.filter(o=>o.status==='cancelled').length.toString()} color="bg-red-50 text-red-600" />
              <StatCard icon={MessageSquare} label="Enquiries" value={customOrders.length.toString()} sub={`${unreadMsgs} unread`} color="bg-amber-50 text-amber-600" />
            </div>

            {/* Ledger Summary */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><BookOpen size={18} className="text-[#5c1a25]" /> Ledger Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-green-700 font-medium flex items-center gap-2"><ArrowUpRight size={16} /> Total Income</span>
                    <span className="font-bold text-green-700">Rs. {ledgerIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-red-700 font-medium flex items-center gap-2"><ArrowDownLeft size={16} /> Total Expenses</span>
                    <span className="font-bold text-red-700">Rs. {ledgerExpense.toLocaleString()}</span>
                  </div>
                  <div className={`flex justify-between items-center p-3 rounded-lg ${netProfit >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                    <span className={`font-bold flex items-center gap-2 ${netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}><TrendingUp size={16} /> Net Profit/Loss</span>
                    <span className={`font-bold text-xl ${netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>Rs. {netProfit.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><ShoppingBag size={18} className="text-[#5c1a25]" /> Recent Orders</h3>
                <div className="space-y-3">
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{o.customerName}</p>
                        <p className="text-xs text-gray-400">{o.orderNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">Rs. {o.total.toLocaleString()}</p>
                        <StatusBadge status={o.status} />
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No orders yet</p>}
                </div>
              </div>
            </div>

            {/* Growth Graph */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp size={18} className="text-[#5c1a25]" /> Sales Growth (Last 7 Days)
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(val) => `Rs. ${val.toLocaleString()}`} />
                    <Tooltip
                      formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, 'Sales']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line type="monotone" dataKey="sales" stroke="#5c1a25" strokeWidth={3} dot={{ r: 4, fill: '#c9a96e', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#c9a96e', strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><BarChart2 size={18} className="text-[#5c1a25]" /> Order Status Breakdown</h3>
              <div className="flex gap-4 flex-wrap">
                {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map(st => {
                  const count = orders.filter(o => o.status === st).length;
                  const pct = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0;
                  return (
                    <div key={st} className="flex-1 min-w-[100px]">
                      <div className="flex justify-between text-xs mb-1">
                        <span className={STATUS_CONFIG[st].color + ' font-semibold capitalize'}>{st}</span>
                        <span className="text-gray-400">{count}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${st === 'delivered' ? 'bg-green-500' : st === 'pending' ? 'bg-amber-500' : st === 'shipped' ? 'bg-purple-500' : st === 'processing' ? 'bg-blue-500' : 'bg-red-400'}`}
                          style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 text-right">{pct}%</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {tab === 'orders' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <h2 className="text-2xl font-playfair text-[#5c1a25]">Orders</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-mono text-sm">{o.orderNumber}</td>
                      <td className="p-4"><div className="font-semibold text-gray-900">{o.customerName}</div><div className="text-xs text-gray-500">{o.customerPhone}</div></td>
                      <td className="p-4 font-bold text-gray-900">Rs. {o.total.toLocaleString()}</td>
                      <td className="p-4 text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td className="p-4"><StatusBadge status={o.status} /></td>
                      <td className="p-4 text-right"><button onClick={() => setSelectedOrder(o)} className="text-[#5c1a25] hover:underline text-sm font-semibold">View</button></td>
                    </tr>
                  ))}
                  {orders.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400">No orders yet</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── CUSTOM ORDERS / ENQUIRIES TAB ── */}
        {tab === 'custom-orders' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-playfair text-[#5c1a25]">Customer Enquiries</h2>
                <p className="text-sm text-gray-400 mt-1">Custom order requests & messages from customers</p>
              </div>
              {unreadMsgs > 0 && <span className="bg-red-100 text-red-600 font-bold px-3 py-1 rounded-full text-sm">{unreadMsgs} Unread</span>}
            </div>

            {customOrders.length === 0 ? (
              <div className="bg-white rounded-xl p-16 text-center shadow-sm border border-gray-100">
                <MessageSquare size={40} className="text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400">No enquiries yet. Messages from the Contact / Custom Order form will appear here.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {customOrders.map(co => (
                  <div key={co.id} onClick={() => markCustomOrderRead(co)}
                    className={`bg-white rounded-xl shadow-sm border p-5 cursor-pointer hover:shadow-md transition-all ${!co.read ? 'border-[#c9a96e] bg-amber-50/30' : 'border-gray-100'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {!co.read && <span className="w-2 h-2 bg-[#c9a96e] rounded-full flex-shrink-0" />}
                          <span className="font-bold text-gray-900">{co.name}</span>
                          {co.email && <span className="text-xs text-gray-400">• {co.email}</span>}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <Phone size={12} /> {co.phone}
                          <span className="text-gray-300">•</span>
                          <Clock size={12} /> {new Date(co.created_at).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <p className="text-gray-700 leading-relaxed">{co.message}</p>
                      </div>
                      {!co.read && <span className="bg-[#c9a96e] text-white text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0">NEW</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PRODUCTS TAB ── */}
        {tab === 'products' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-playfair text-[#5c1a25]">Product Management</h2>
              <button onClick={() => { setEditingProduct({ id: 'p-'+Date.now(), name: '', category: 'rings', price: 0, originalPrice: null, image: '', images: [], description: '', material: '21k Gold', isBestSeller: false, is_best_seller: false, rating: 5, reviews: 0 }); setShowProductModal(true); }} className="bg-[#5c1a25] text-white px-4 py-2 rounded flex items-center gap-2 text-sm">
                <Plus size={16} /> Add Product
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 group">
                  <div className="relative aspect-square w-full mb-4 bg-gray-100 rounded-lg overflow-hidden">
                    {p.image && <Image src={p.image} alt={p.name} fill className="object-cover" sizes="200px" />}
                    {(p.is_best_seller || p.isBestSeller) && <span className="absolute top-2 left-2 bg-[#c9a96e] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">TOP SELLER</span>}
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate text-sm">{p.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">Rs. {p.price.toLocaleString()}</p>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingProduct(p); setShowProductModal(true); }} className="flex-1 bg-gray-100 text-gray-700 py-1.5 rounded text-sm hover:bg-gray-200 flex items-center justify-center gap-1"><Edit size={13} /> Edit</button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="flex-1 bg-red-50 text-red-600 py-1.5 rounded text-sm hover:bg-red-100 flex items-center justify-center gap-1"><Trash2 size={13} /> Del</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FEATURED TAB ── */}
        {tab === 'featured' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-playfair text-[#5c1a25]">Featured Collections</h2>
              <button onClick={handleSaveFeatured} className="bg-[#5c1a25] text-white px-6 py-2 rounded text-sm font-semibold">Save Changes</button>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              {featured.map((col, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex gap-6">
                  <div className="w-32 h-40 bg-gray-100 relative rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 group">
                    {col.image && <Image src={col.image} alt={col.name} fill className="object-cover" sizes="128px" />}
                    <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <ImageIcon size={20} className="mb-1" /><span className="text-xs">Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f, b64 => { const nF = [...featured]; nF[idx].image = b64; setFeatured(nF); }); }} />
                    </label>
                  </div>
                  <div className="flex-1 space-y-3">
                    {(['name', 'desc', 'count', 'href'] as const).map(field => (
                      <div key={field}>
                        <label className="text-xs font-semibold text-gray-500 uppercase">{field === 'desc' ? 'Description' : field === 'href' ? 'Link URL' : field === 'count' ? 'Item Count' : 'Title'}</label>
                        <input type={field === 'count' ? 'number' : 'text'} className="w-full border-b border-gray-200 py-1 outline-none focus:border-[#5c1a25] text-sm"
                          value={(col as any)[field]} onChange={e => { const nF = [...featured]; (nF[idx] as any)[field] = field === 'count' ? parseInt(e.target.value)||0 : e.target.value; setFeatured(nF); }} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── REVIEWS TAB ── */}
        {tab === 'reviews' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <h2 className="text-2xl font-playfair text-[#5c1a25]">Customer Reviews</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {reviews.length === 0 ? (
                <div className="p-8 text-center text-gray-400">No reviews yet.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead><tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    <th className="p-4">Customer</th><th className="p-4">Product ID</th><th className="p-4">Review</th><th className="p-4">Rating</th><th className="p-4 text-right">Action</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {reviews.map(r => (
                      <tr key={r.id} className="hover:bg-gray-50/50">
                        <td className="p-4"><div className="font-semibold text-gray-900">{r.name}</div><div className="text-xs text-gray-500">{r.city}</div></td>
                        <td className="p-4"><div className="text-xs text-gray-500 max-w-[100px] truncate" title={r.product_id}>{r.product_id || 'N/A'}</div></td>
                        <td className="p-4 max-w-md"><p className="text-sm text-gray-700 line-clamp-2">{r.text}</p></td>
                        <td className="p-4"><span className="font-bold text-[#c9a96e]">{'★'.repeat(r.rating)}</span></td>
                        <td className="p-4 text-right"><button onClick={() => handleDeleteReview(r.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ── LEDGER TAB ── */}
        {tab === 'ledger' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-playfair text-[#5c1a25]">Business Ledger</h2>
                <p className="text-sm text-gray-400 mt-1">Track all income and expenses</p>
              </div>
              <button onClick={() => setShowLedgerModal(true)} className="bg-[#5c1a25] text-white px-4 py-2 rounded flex items-center gap-2 text-sm">
                <Plus size={16} /> Add Entry
              </button>
            </div>

            {/* Ledger Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                <p className="text-xs font-bold text-green-600 uppercase mb-1">Total Income</p>
                <p className="text-xl font-bold text-green-700">Rs. {ledgerIncome.toLocaleString()}</p>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-xs font-bold text-red-600 uppercase mb-1">Total Expenses</p>
                <p className="text-xl font-bold text-red-700">Rs. {ledgerExpense.toLocaleString()}</p>
              </div>
              <div className={`border rounded-xl p-4 ${netProfit >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                <p className={`text-xs font-bold uppercase mb-1 ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>Net Profit</p>
                <p className={`text-xl font-bold ${netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>Rs. {netProfit.toLocaleString()}</p>
              </div>
            </div>

            {/* Ledger Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {ledger.length === 0 ? (
                <div className="p-12 text-center"><BookOpen size={40} className="text-gray-200 mx-auto mb-4" /><p className="text-gray-400">No entries yet. Add your first income or expense.</p></div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead><tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    <th className="p-4">Date</th><th className="p-4">Description</th><th className="p-4">Category</th><th className="p-4">Type</th><th className="p-4 text-right">Amount</th><th className="p-4"></th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {ledger.map(l => (
                      <tr key={l.id} className="hover:bg-gray-50/50">
                        <td className="p-4 text-sm text-gray-500">{new Date(l.date).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td className="p-4 font-medium text-gray-900">{l.description}</td>
                        <td className="p-4 text-sm text-gray-500">{l.category}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${l.type === 'income' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {l.type === 'income' ? <ArrowUpRight size={11} /> : <ArrowDownLeft size={11} />}
                            {l.type.charAt(0).toUpperCase() + l.type.slice(1)}
                          </span>
                        </td>
                        <td className={`p-4 text-right font-bold ${l.type === 'income' ? 'text-green-700' : 'text-red-700'}`}>
                          {l.type === 'income' ? '+' : '-'} Rs. {l.amount.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <button onClick={() => handleDeleteLedger(l.id)} className="text-red-400 hover:text-red-600 p-1 rounded"><Trash2 size={15} /></button>
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

      {/* ── PRODUCT MODAL ── */}
      {showProductModal && editingProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900">Edit Product</h2>
              <button onClick={() => setShowProductModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4">
              <div className="flex gap-6">
                <div className="w-44 flex flex-col gap-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase">Product Images</label>
                  <div className="grid grid-cols-2 gap-2">
                    {editingProduct.images?.map((imgUrl: string, idx: number) => (
                      <div key={idx} className="aspect-square bg-gray-100 rounded relative overflow-hidden border group">
                        <Image src={imgUrl} alt="preview" fill className="object-cover" sizes="80px" />
                        <button type="button" onClick={() => { const ni = [...(editingProduct.images||[])]; ni.splice(idx,1); setEditingProduct({...editingProduct, images: ni, image: ni[0]||''}); }} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X size={16}/></button>
                      </div>
                    ))}
                    <label className="aspect-square bg-gray-50 border border-dashed rounded flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-[#5c1a25] hover:bg-gray-100 transition-colors">
                      <Plus size={20}/><span className="text-[10px] uppercase font-bold mt-1">Add</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => { const f=e.target.files?.[0]; if(f) handleImageUpload(f, b64 => { const ni=[...(editingProduct.images||[]),b64]; setEditingProduct({...editingProduct, images: ni, image: ni[0]||''}); }); }} />
                    </label>
                  </div>
                  <p className="text-[10px] text-gray-400">First image = primary thumbnail</p>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase">Name</label>
                    <input required type="text" className="w-full border rounded p-2 mt-1 text-sm" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase">Price (Rs.)</label>
                      <input required type="number" className="w-full border rounded p-2 mt-1 text-sm" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseInt(e.target.value)||0})} />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase">Old Price (Optional)</label>
                      <input type="number" className="w-full border rounded p-2 mt-1 text-sm" value={editingProduct.originalPrice||''} placeholder="Optional" onChange={e => setEditingProduct({...editingProduct, originalPrice: e.target.value ? parseInt(e.target.value) : null})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase">Category</label>
                    <select className="w-full border rounded p-2 mt-1 text-sm" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                      {['rings','necklaces','earrings','bracelets','bangles','pendants','nose pins'].map(c => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="bs" checked={!!(editingProduct.isBestSeller || editingProduct.is_best_seller)} onChange={e => setEditingProduct({...editingProduct, isBestSeller: e.target.checked, is_best_seller: e.target.checked})} className="w-4 h-4 accent-[#5c1a25]" />
                    <label htmlFor="bs" className="text-sm font-semibold text-gray-700 cursor-pointer">Mark as Top Seller</label>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase">Description</label>
                    <textarea className="w-full border rounded p-2 mt-1 h-20 text-sm" value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} />
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

      {/* ── LEDGER MODAL ── */}
      {showLedgerModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900">Add Ledger Entry</h2>
              <button onClick={() => setShowLedgerModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddLedger} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Type</label>
                <div className="flex gap-3">
                  {(['income', 'expense'] as const).map(t => (
                    <button key={t} type="button" onClick={() => setNewLedger({...newLedger, type: t})}
                      className={`flex-1 py-2 rounded-lg font-semibold text-sm border transition-all flex items-center justify-center gap-2 ${newLedger.type === t ? (t === 'income' ? 'bg-green-500 text-white border-green-500' : 'bg-red-500 text-white border-red-500') : 'bg-white text-gray-500 border-gray-200'}`}>
                      {t === 'income' ? <ArrowUpRight size={16}/> : <ArrowDownLeft size={16}/>}
                      {t.charAt(0).toUpperCase()+t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <input required type="text" className="w-full border rounded p-2 text-sm" placeholder="e.g. Ring sale, Gold purchase" value={newLedger.description||''} onChange={e => setNewLedger({...newLedger, description: e.target.value})} />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount (Rs.)</label>
                  <input required type="number" className="w-full border rounded p-2 text-sm" placeholder="0" value={newLedger.amount||''} onChange={e => setNewLedger({...newLedger, amount: parseInt(e.target.value)||0})} />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                  <input required type="date" className="w-full border rounded p-2 text-sm" value={newLedger.date||''} onChange={e => setNewLedger({...newLedger, date: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                <input type="text" className="w-full border rounded p-2 text-sm" placeholder="e.g. Sales, Gold, Labour, Rent" value={newLedger.category||''} onChange={e => setNewLedger({...newLedger, category: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowLedgerModal(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#5c1a25] text-white rounded font-semibold">Add Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ORDER DETAIL MODAL ── */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 sm:p-6" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b flex justify-between items-center bg-gray-50 shrink-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedOrder.orderNumber}</h2>
                <p className="text-sm text-gray-500">{new Date(selectedOrder.createdAt).toLocaleDateString('en-PK', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-200 rounded-full"><X size={20} className="text-gray-500" /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {(['pending','processing','shipped','delivered','cancelled'] as OrderStatus[]).map(st => (
                    <button key={st} onClick={() => updateStatus(selectedOrder.id, st)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${selectedOrder.status === st ? STATUS_CONFIG[st].bg+' '+STATUS_CONFIG[st].color : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                      {STATUS_CONFIG[st].label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-xs text-gray-400 uppercase mb-1">Customer</p><p className="font-semibold">{selectedOrder.customerName}</p></div>
                <div><p className="text-xs text-gray-400 uppercase mb-1">Phone</p><p className="font-semibold">{selectedOrder.customerPhone}</p></div>
                <div><p className="text-xs text-gray-400 uppercase mb-1">City</p><p className="font-semibold">{selectedOrder.city}</p></div>
                <div><p className="text-xs text-gray-400 uppercase mb-1">Address</p><p className="font-semibold">{selectedOrder.address}</p></div>
                {selectedOrder.notes && <div className="col-span-2"><p className="text-xs text-gray-400 uppercase mb-1">Notes</p><p className="font-semibold text-amber-700">{selectedOrder.notes}</p></div>}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-3">Order Items</p>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex gap-3 items-center p-3 rounded-lg border border-gray-100 bg-gray-50">
                      <div className="relative w-14 h-14 rounded bg-white border overflow-hidden flex-shrink-0"><Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" /></div>
                      <div className="flex-1"><p className="font-semibold text-gray-900 text-sm">{item.name}</p><p className="text-xs text-gray-500">Qty: {item.quantity}</p></div>
                      <p className="font-bold text-sm">Rs. {(item.price*item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 border-t px-1">
                    <span className="font-bold text-gray-700">Total</span>
                    <span className="text-xl font-bold text-[#5c1a25]">Rs. {selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
