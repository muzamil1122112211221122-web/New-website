'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Menu, X, Search, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';
import { useRouter } from 'next/navigation';

const navLinks = [
  {
    label: 'Collections',
    href: '/collections',
    sub: [
      { label: 'Rings', href: '/collections?cat=rings' },
      { label: 'Necklaces', href: '/collections?cat=necklaces' },
      { label: 'Earrings', href: '/collections?cat=earrings' },
      { label: 'Bracelets', href: '/collections?cat=bracelets' },
      { label: 'Bangles', href: '/collections?cat=bangles' },
      { label: 'Pendants', href: '/collections?cat=pendants' },
      { label: 'Nose Pins', href: '/collections?cat=nose%20pins' },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { count, setIsOpen } = useCart();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);

  const searchResults = searchQuery.trim() === '' ? [] : products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setProducts(data);
    }).catch(() => {});
    
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <CartDrawer />

      {/* Search Overlay */}
      <div className={`fixed inset-0 bg-[#EFE9E1]/95 z-[60] backdrop-blur-sm transition-all duration-500 ${showSearch ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="max-w-4xl mx-auto px-6 pt-24 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8 border-b border-[#5c1a25]/20 pb-4">
            <div className="flex items-center gap-4 flex-1">
              <Search size={24} className="text-[#5c1a25]/50" />
              <input
                type="text"
                autoFocus={showSearch}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collections, rings, necklaces..."
                className="w-full bg-transparent text-2xl font-optima text-[#5c1a25] placeholder-[#5c1a25]/30 outline-none"
              />
            </div>
            <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="text-[#5c1a25] hover:text-[#5c1a25]/60 transition-colors">
              <X size={32} strokeWidth={1} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto hide-scrollbar pb-10">
            {searchQuery && searchResults.length === 0 ? (
              <p className="text-center font-optima text-[#5c1a25]/50 mt-10 text-lg">No results found for &quot;{searchQuery}&quot;</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {searchResults.map(p => (
                  <Link href={`/collections`} key={p.id} onClick={() => setShowSearch(false)} className="group">
                    <div className="aspect-square relative mb-3 overflow-hidden bg-white/50 border border-[#5c1a25]/10">
                      <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <h4 className="font-optima text-[#5c1a25] text-sm uppercase tracking-wider">{p.name}</h4>
                    <p className="font-playfair text-[#c9a96e] font-semibold mt-1">Rs. {p.price.toLocaleString()}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Fixed wrapper: announcement bar + main header ── */}
      <div className="fixed top-0 left-0 right-0 z-50">

        {/* Announcement Bar — collapses on scroll */}
        <div
          className={`bg-[#5c1a25] text-[#EFE9E1] overflow-hidden transition-all duration-500 flex items-center ${
            scrolled ? 'max-h-0 py-0 opacity-0' : 'max-h-10 py-2 opacity-100'
          }`}
        >
          <div className="flex items-center justify-center gap-2 text-center w-full px-2">
            <a
              href="https://wa.me/923216004630"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#c9a96e] transition-colors shrink-0"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span
                className="tracking-wider sm:tracking-[0.18em] font-light truncate"
                style={{
                  fontFamily: "'Optima Nova LT Pro', Optima, 'Gill Sans MT', Calibri, sans-serif",
                  fontSize: '10px',
                }}
              >
                03216004630
              </span>
            </a>
            <span className="text-[#c9a96e]/50 mx-1 sm:mx-2 shrink-0" style={{ fontSize: '10px' }}>|</span>
            <span
              className="tracking-wider sm:tracking-[0.15em] text-[#EFE9E1]/80 font-light truncate"
              style={{
                fontFamily: "'Optima Nova LT Pro', Optima, 'Gill Sans MT', Calibri, sans-serif",
                fontSize: '9px',
              }}
            >
              Free delivery on orders above Rs. 50,000
            </span>
          </div>
        </div>

        {/* Main Header */}
        <header
          className={`transition-all duration-500 ${
            scrolled
              ? 'bg-[#EFE9E1]/96 backdrop-blur-md shadow-[0_2px_24px_rgba(92,26,37,0.10)]'
              : 'bg-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}>

              {/* Mobile menu */}
              <button
                className="lg:hidden text-[#5c1a25] p-1"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className={`relative transition-all duration-500 ${scrolled ? 'w-10 h-10' : 'w-14 h-14'}`}>
                  <Image src="/logo.png" alt="IJC Logo" fill className="object-contain" priority />
                </div>
                <div className="hidden sm:block">
                  <div
                    className="text-[#5c1a25] leading-tight tracking-[0.18em] uppercase"
                    style={{
                      fontFamily: "'Optima Nova LT Pro', Optima, var(--font-playfair), serif",
                      fontSize: scrolled ? '13px' : '15px',
                      fontWeight: 600,
                      transition: 'font-size 0.4s ease',
                    }}
                  >
                    Ijaz Casting
                  </div>
                  <div
                    className="text-[#5c1a25]/55 tracking-[0.35em] uppercase"
                    style={{
                      fontFamily: "'Optima Nova LT Pro', Optima, var(--font-cormorant), serif",
                      fontSize: '9px',
                      fontWeight: 300,
                      letterSpacing: '0.4em',
                    }}
                  >
                    &amp; Jewellery Centre
                  </div>
                </div>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-10">
                {navLinks.map((link) => (
                  <div
                    key={link.label}
                    className="relative group"
                    onMouseEnter={() => link.sub && setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center gap-1 text-[#5c1a25] hover:text-[#5c1a25]/60 transition-colors uppercase"
                      style={{
                        fontFamily: "'Optima Nova LT Pro', Optima, 'Gill Sans MT', Calibri, sans-serif",
                        fontSize: '11px',
                        fontWeight: 400,
                        letterSpacing: '0.22em',
                      }}
                    >
                      {link.label}
                      {link.sub && (
                        <ChevronDown size={12} className="transition-transform duration-300 group-hover:rotate-180" />
                      )}
                    </Link>

                    {/* Dropdown */}
                    {link.sub && activeDropdown === link.label && (
                      <div className="absolute top-full left-0 pt-4 z-50">
                        <div className="w-44 bg-[#EFE9E1] shadow-[0_8px_40px_rgba(92,26,37,0.12)] border-t border-[#5c1a25]/20 py-2">
                          {link.sub.map((s) => (
                            <Link
                              key={s.label}
                              href={s.href}
                              className="block px-5 py-2.5 text-[#5c1a25] hover:bg-[#5c1a25] hover:text-[#EFE9E1] transition-colors uppercase"
                              style={{
                                fontFamily: "'Optima Nova LT Pro', Optima, 'Gill Sans MT', Calibri, sans-serif",
                                fontSize: '10px',
                                fontWeight: 400,
                                letterSpacing: '0.2em',
                              }}
                            >
                              {s.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Icons */}
              <div className="flex items-center gap-5">
                <button onClick={() => setShowSearch(true)} className="text-[#5c1a25] hover:text-[#5c1a25]/60 transition-colors" aria-label="Search">
                  <Search size={18} />
                </button>
                <button
                  className="relative text-[#5c1a25] hover:text-[#5c1a25]/60 transition-colors"
                  onClick={() => setIsOpen(true)}
                  aria-label="Cart"
                >
                  <ShoppingBag size={20} />
                  {count > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#5c1a25] text-[#EFE9E1] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {count}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Thin gold underline on scroll */}
          <div
            className={`h-px transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`}
            style={{ background: 'linear-gradient(90deg, transparent, #c9a96e 30%, #c9a96e 70%, transparent)' }}
          />

          {/* Mobile Nav Drawer */}
          <div className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileOpen(false)} />
          <div className={`fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-[#EFE9E1] z-50 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden flex flex-col ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between p-6 border-b border-[#5c1a25]/10">
              <span className="font-playfair text-xl text-[#5c1a25] tracking-widest">IJC</span>
              <button onClick={() => setMobileOpen(false)} className="text-[#5c1a25] hover:text-[#5c1a25]/60">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <Link
                    href={link.href}
                    className="block text-[#5c1a25] pb-2 border-b border-[#5c1a25]/10 uppercase"
                    style={{
                      fontFamily: "'Optima Nova LT Pro', Optima, var(--font-playfair), serif",
                      fontSize: '14px',
                      fontWeight: 500,
                      letterSpacing: '0.25em',
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                  {link.sub && (
                    <div className="pl-4 mt-3 flex flex-col gap-3">
                      {link.sub.map((s) => (
                        <Link
                          key={s.label}
                          href={s.href}
                          className="text-[#5c1a25]/60 hover:text-[#5c1a25] uppercase transition-colors"
                          style={{
                            fontFamily: "'Optima Nova LT Pro', Optima, 'Gill Sans MT', sans-serif",
                            fontSize: '11px',
                            letterSpacing: '0.2em',
                          }}
                          onClick={() => setMobileOpen(false)}
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
