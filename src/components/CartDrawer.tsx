'use client';

import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, total, count } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#EFE9E1] z-[100] shadow-2xl flex flex-col"
          >
            {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#5c1a25]/15">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-[#5c1a25]" size={22} />
            <h2 className="font-playfair text-xl font-bold text-[#5c1a25]">
              Your Cart ({count})
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[#5c1a25] hover:text-[#5c1a25]/60 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={60} className="text-[#5c1a25]/20" />
              <p className="font-cormorant text-xl text-[#5c1a25]/60">Your cart is empty</p>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-primary text-sm"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-white/60 border border-[#5c1a25]/10">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-cormorant font-semibold text-[#5c1a25] text-base leading-tight mb-1">{item.name}</h3>
                    <p className="font-playfair text-[#5c1a25] text-sm font-bold">
                      {item.price === 0 ? "Get info on WhatsApp" : `Rs. ${(item.price * item.quantity).toLocaleString()}`}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-[#5c1a25]/30">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-[#5c1a25]/10 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 py-1 font-cormorant text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-[#5c1a25]/10 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#5c1a25]/15 px-6 py-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-cormorant text-lg text-[#5c1a25]">Subtotal</span>
              <span className="font-playfair font-bold text-[#5c1a25] text-xl">
                Rs. {total.toLocaleString()}
              </span>
            </div>
            <div className="gold-divider" />
            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="btn-primary w-full text-center block"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="btn-outline w-full"
            >
              Continue Shopping
            </button>
          </div>
        )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
