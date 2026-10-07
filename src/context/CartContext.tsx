'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
  count: number;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  loading: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sid = localStorage.getItem('ijc_session_id');
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem('ijc_session_id', sid);
  }
  return sid;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const sessionId = useRef<string>('');

  // Load cart from Supabase on mount
  useEffect(() => {
    sessionId.current = getSessionId();
    fetchCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCart = async () => {
    const sid = sessionId.current || getSessionId();
    if (!sid) return;
    const { data } = await supabase
      .from('carts')
      .select('*')
      .eq('session_id', sid)
      .order('created_at', { ascending: true });
    if (data) {
      setItems(data.map(r => ({
        id: r.product_id,
        name: r.name,
        price: r.price,
        image: r.image,
        quantity: r.quantity,
      })));
    }
    setLoading(false);
  };

  const addItem = useCallback(async (item: Omit<CartItem, 'quantity'>) => {
    const sid = sessionId.current || getSessionId();

    // Optimistic update
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsOpen(true);

    // Upsert in Supabase
    const existing = items.find(i => i.id === item.id);
    if (existing) {
      await supabase.from('carts').update({ quantity: existing.quantity + 1 })
        .eq('session_id', sid).eq('product_id', item.id);
    } else {
      await supabase.from('carts').insert({
        session_id: sid,
        product_id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
      });
    }
  }, [items]);

  const removeItem = useCallback(async (id: string) => {
    const sid = sessionId.current || getSessionId();
    setItems(prev => prev.filter(i => i.id !== id));
    await supabase.from('carts').delete().eq('session_id', sid).eq('product_id', id);
  }, []);

  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    const sid = sessionId.current || getSessionId();
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.id !== id));
      await supabase.from('carts').delete().eq('session_id', sid).eq('product_id', id);
    } else {
      setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
      await supabase.from('carts').update({ quantity }).eq('session_id', sid).eq('product_id', id);
    }
  }, []);

  const clearCart = useCallback(async () => {
    const sid = sessionId.current || getSessionId();
    setItems([]);
    await supabase.from('carts').delete().eq('session_id', sid);
  }, []);

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count, isOpen, setIsOpen, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
