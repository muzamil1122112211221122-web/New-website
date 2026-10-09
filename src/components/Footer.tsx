import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin } from 'lucide-react';

const INSTA_URL = 'https://www.instagram.com/ijazhussainjewl/?utm_source=ig_web_button_share_sheet';
const FB_URL = 'https://www.facebook.com/share/1BeeNsuBYN/';
const WA_URL = 'https://wa.me/923216004630';

const optima: React.CSSProperties = {
  fontFamily: "'Optima Nova LT Pro', Optima, 'Gill Sans MT', Calibri, sans-serif",
};

export default function Footer() {
  return (
    <footer className="bg-[#1a0a0d] text-[#ffffff]">
      {/* Gold top line */}
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, #c9a96e 30%, #c9a96e 70%, transparent)' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-14 h-14">
                <Image src="/logo.png" alt="IC Logo" fill className="object-contain brightness-200" />
              </div>
            </div>
            <h3
              className="text-[#c9a96e] mb-1 tracking-[0.2em] uppercase"
              style={{ ...optima, fontSize: '13px', fontWeight: 600 }}
            >
              Ijaz Casting
            </h3>
            <p
              className="text-[#ffffff]/45 tracking-[0.35em] mb-5 uppercase"
              style={{ ...optima, fontSize: '9px', fontWeight: 300, letterSpacing: '0.4em' }}
            >
              &amp; Jewellery Centre
            </p>
            <p
              className="text-[#ffffff]/60 leading-relaxed"
              style={{ ...optima, fontSize: '13px', fontWeight: 300 }}
            >
              Crafting timeless jewellery pieces with generations of expertise and passion for excellence.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-7">
              {/* Instagram */}
              <a
                href={INSTA_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-[#ffffff]/45 hover:text-[#c9a96e] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href={FB_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-[#ffffff]/45 hover:text-[#c9a96e] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="text-[#ffffff]/45 hover:text-[#c9a96e] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4
              className="text-[#c9a96e] mb-5 pb-2 border-b border-[#c9a96e]/25 uppercase tracking-[0.25em]"
              style={{ ...optima, fontSize: '10px', fontWeight: 500 }}
            >
              Collections
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Rings', href: '/collections?cat=rings' },
                { label: 'Necklaces', href: '/collections?cat=necklaces' },
                { label: 'Earrings', href: '/collections?cat=earrings' },
                { label: 'Bangles', href: '/collections?cat=bangles' },
              ].map((c) => (
                <li key={c.label}>
                  <Link
                    href={c.href}
                    className="text-[#ffffff]/55 hover:text-[#c9a96e] transition-colors tracking-wide"
                    style={{ ...optima, fontSize: '13px', fontWeight: 300 }}
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-[#c9a96e] mb-5 pb-2 border-b border-[#c9a96e]/25 uppercase tracking-[0.25em]"
              style={{ ...optima, fontSize: '10px', fontWeight: 500 }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Shipping Policy', href: '/shipping-policy' },
                { label: 'Return Policy', href: '/return-policy' },
                { label: 'Privacy Policy', href: '/privacy-policy' },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[#ffffff]/55 hover:text-[#c9a96e] transition-colors"
                    style={{ ...optima, fontSize: '13px', fontWeight: 300 }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-[#c9a96e] mb-5 pb-2 border-b border-[#c9a96e]/25 uppercase tracking-[0.25em]"
              style={{ ...optima, fontSize: '10px', fontWeight: 500 }}
            >
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <MapPin size={14} className="text-[#c9a96e] mt-0.5 flex-shrink-0" />
                <span
                  className="text-[#ffffff]/60 leading-relaxed"
                  style={{ ...optima, fontSize: '13px', fontWeight: 300 }}
                >
                  Amin Bazar 4 Block,<br />Corner Watch Market,<br />Sargodha
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone size={14} className="text-[#c9a96e] flex-shrink-0" />
                <div className="flex flex-col">
                  <a
                    href={WA_URL}
                    className="text-[#ffffff]/60 hover:text-[#c9a96e] transition-colors"
                    style={{ ...optima, fontSize: '13px', fontWeight: 300 }}
                  >
                    03216004630
                  </a>
                  <a
                    href="tel:03216004632"
                    className="text-[#ffffff]/60 hover:text-[#c9a96e] transition-colors"
                    style={{ ...optima, fontSize: '13px', fontWeight: 300 }}
                  >
                    03216004632
                  </a>
                </div>
              </li>
            </ul>

            {/* WhatsApp CTA */}
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 border border-[#c9a96e]/40 text-[#c9a96e] px-4 py-2.5 hover:bg-[#c9a96e]/10 transition-colors"
              style={{ ...optima, fontSize: '10px', fontWeight: 400, letterSpacing: '0.2em' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              CHAT ON WHATSAPP
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#ffffff]/8 py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p
            className="text-[#ffffff]/30"
            style={{ ...optima, fontSize: '11px', fontWeight: 300, letterSpacing: '0.08em' }}
          >
            © {new Date().getFullYear()} Ijaz Casting &amp; Jewellery Centre (IC). All rights reserved.
          </p>
          <p
            className="text-[#c9a96e]/50 uppercase tracking-widest"
            style={{ ...optima, fontSize: '9px', fontWeight: 300, letterSpacing: '0.4em' }}
          >
            Crafted with ♥ in Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
}
