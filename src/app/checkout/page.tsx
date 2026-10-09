'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { ShoppingBag, MapPin, Phone, User, Mail, FileText, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    address: '',
    city: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customerName.trim()) e.customerName = 'Name is required';
    if (!form.customerPhone.trim()) e.customerPhone = 'Phone is required';
    if (!/^[\d\s\-\+]{10,15}$/.test(form.customerPhone.trim())) e.customerPhone = 'Enter valid phone number';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items, total }),
      });
      const data = await res.json();
      if (data.success) {
        setOrderNumber(data.orderNumber);
        setSuccess(true);
        clearCart();
      }
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Header />
        <main className="pt-28 min-h-screen flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center py-16">
            <CheckCircle size={72} className="text-green-500 mx-auto mb-6" />
            <h1 className="font-playfair text-3xl font-bold text-[#5c1a25] mb-3">Order Placed!</h1>
            <p className="font-optima text-[#5c1a25]/70 mb-2">Thank you for your order.</p>
            <div className="bg-[#5c1a25] text-[#ffffff] px-6 py-3 inline-block my-4">
              <p className="font-optima text-sm tracking-widest">Order Number</p>
              <p className="font-playfair text-2xl font-bold">{orderNumber}</p>
            </div>
            <p className="font-optima text-[#5c1a25]/60 text-sm mb-8">
              Our team will contact you shortly on your provided number to confirm your order.
            </p>
            <button onClick={() => router.push('/')} className="btn-primary">
              Continue Shopping
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="pt-28 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <ShoppingBag size={60} className="text-[#5c1a25]/20 mx-auto mb-4" />
            <p className="font-optima text-[#5c1a25]/60 text-xl mb-4">Your cart is empty</p>
            <button onClick={() => router.push('/collections')} className="btn-primary">Browse Collections</button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-28 min-h-screen bg-[#ffffff]">
        {/* Banner */}
        <div className="bg-[#5c1a25] py-10 px-6 text-center">
          <h1 className="font-playfair text-[#ffffff] text-4xl font-bold">Checkout</h1>
          <p className="font-optima text-[#ffffff]/60 mt-2 text-sm tracking-widest">Complete your order</p>
        </div>

        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Form — 3/5 */}
            <div className="lg:col-span-3">
              <h2 className="font-playfair text-2xl font-bold text-[#5c1a25] mb-6">Delivery Information</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 font-optima text-[#5c1a25] text-sm tracking-wide mb-1.5">
                    <User size={14} /> Full Name *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Ahmed Ali"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  />
                  {errors.customerName && <p className="text-red-500 text-xs mt-1 font-optima">{errors.customerName}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 font-optima text-[#5c1a25] text-sm tracking-wide mb-1.5">
                    <Phone size={14} /> Phone Number *
                  </label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="e.g. 0300-1234567"
                    value={form.customerPhone}
                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                  />
                  {errors.customerPhone && <p className="text-red-500 text-xs mt-1 font-optima">{errors.customerPhone}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 font-optima text-[#5c1a25] text-sm tracking-wide mb-1.5">
                    <Mail size={14} /> Email (Optional)
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="your@email.com"
                    value={form.customerEmail}
                    onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="flex items-center gap-2 font-optima text-[#5c1a25] text-sm tracking-wide mb-1.5">
                    <MapPin size={14} /> Delivery Address *
                  </label>
                  <textarea
                    className="form-input resize-none h-24"
                    placeholder="House #, Street, Area, e.g. House 12, Street 4, Gulberg III"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1 font-optima">{errors.address}</p>}
                </div>

                {/* City */}
                <div>
                  <label className="flex items-center gap-2 font-optima text-[#5c1a25] text-sm tracking-wide mb-1.5">
                    <MapPin size={14} /> City *
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Lahore"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1 font-optima">{errors.city}</p>}
                </div>

                {/* Notes */}
                <div>
                  <label className="flex items-center gap-2 font-optima text-[#5c1a25] text-sm tracking-wide mb-1.5">
                    <FileText size={14} /> Order Notes (Optional)
                  </label>
                  <textarea
                    className="form-input resize-none h-20"
                    placeholder="Gift wrapping, special instructions, etc."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 text-base disabled:opacity-60"
                >
                  {loading ? 'Placing Order...' : `Place Order — Rs. ${total.toLocaleString()}`}
                </button>
              </form>
            </div>

            {/* Order Summary — 2/5 */}
            <div className="lg:col-span-2">
              <div className="bg-white/50 border border-[#5c1a25]/10 p-6 sticky top-28">
                <h2 className="font-playfair text-xl font-bold text-[#5c1a25] mb-5 pb-3 border-b border-[#5c1a25]/15">
                  Order Summary
                </h2>
                <div className="space-y-4 mb-5">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0 bg-[#ffffff]">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                        <span className="absolute -top-2 -right-2 bg-[#5c1a25] text-[#ffffff] text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-optima text-[#5c1a25] text-sm font-semibold leading-tight">{item.name}</p>
                        <p className="font-optima text-[#5c1a25]/60 text-sm mt-0.5">
                          {item.price === 0 ? "Get info on WhatsApp" : `Rs. ${(item.price * item.quantity).toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#5c1a25]/15 pt-4 space-y-2">
                  <div className="flex justify-between font-optima text-sm text-[#5c1a25]/70">
                    <span>Subtotal</span>
                    <span>Rs. {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-optima text-sm text-[#5c1a25]/70">
                    <span>Delivery</span>
                    <span className="text-green-600">{total >= 50000 ? 'FREE' : 'Rs. 250'}</span>
                  </div>
                  <div className="gold-divider my-2" />
                  <div className="flex justify-between font-playfair font-bold text-[#5c1a25] text-lg">
                    <span>Total</span>
                    <span>Rs. {(total + (total >= 50000 ? 0 : 250)).toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-5 p-3 bg-[#5c1a25]/5 border border-[#5c1a25]/10">
                  <p className="font-optima text-[#5c1a25]/70 text-xs leading-relaxed">
                    💬 Our team will call you to confirm your order before dispatch. Cash on Delivery available.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
