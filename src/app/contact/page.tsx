'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch('/api/custom-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          message: form.subject ? `[${form.subject}] ${form.message}` : form.message,
        }),
      });
    } catch (_) {}
    setSending(false);
    setSent(true);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#ffffff]">
        {/* Hero */}
        <div className="bg-[#5c1a25] pt-32 pb-16 text-center">
          <p className="font-optima text-[#c9a96e] tracking-[0.4em] uppercase text-xs mb-3 font-light">Get In Touch</p>
          <h1 className="text-[#ffffff] font-light tracking-widest" style={{ fontSize: '2.4rem' }}>Contact Us</h1>
        </div>

        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Info */}
            <div>
              <p className="font-optima text-[#c9a96e] tracking-[0.35em] uppercase text-xs mb-3 font-light">Our Details</p>
              <h2 className="section-heading mb-6">We&apos;d Love to Hear<br />From You</h2>
              <div className="gold-divider mb-10" />

              <div className="space-y-7">
                {/* Address */}
                <div className="flex gap-4">
                  <div className="w-11 h-11 bg-[#5c1a25] flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} className="text-[#c9a96e]" />
                  </div>
                  <div>
                    <h3 className="font-optima font-normal text-[#5c1a25] text-xs uppercase tracking-[0.25em] mb-1.5">Visit Us</h3>
                    <p className="text-[#5c1a25]/65 leading-relaxed" style={{ fontSize: '14px', fontWeight: 300 }}>
                      Amin Bazar, 4 Block<br />
                      Watch Market<br />
                      Pakistan
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="w-11 h-11 bg-[#5c1a25] flex items-center justify-center flex-shrink-0">
                    <Phone size={16} className="text-[#c9a96e]" />
                  </div>
                  <div>
                    <h3 className="font-optima font-normal text-[#5c1a25] text-xs uppercase tracking-[0.25em] mb-1.5">Call / WhatsApp</h3>
                    <div className="space-y-1">
                      <a href="https://wa.me/923216004630" className="block text-[#5c1a25]/65 hover:text-[#5c1a25] transition-colors" style={{ fontSize: '14px', fontWeight: 300 }}>
                        03216004630
                      </a>
                      <a href="tel:03216004632" className="block text-[#5c1a25]/65 hover:text-[#5c1a25] transition-colors" style={{ fontSize: '14px', fontWeight: 300 }}>
                        03216004632
                      </a>
                    </div>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-4">
                  <div className="w-11 h-11 bg-[#5c1a25] flex items-center justify-center flex-shrink-0">
                    <Clock size={16} className="text-[#c9a96e]" />
                  </div>
                  <div>
                    <h3 className="font-optima font-normal text-[#5c1a25] text-xs uppercase tracking-[0.25em] mb-1.5">Working Hours</h3>
                    <p className="text-[#5c1a25]/65 leading-relaxed" style={{ fontSize: '14px', fontWeight: 300 }}>
                      Monday – Saturday: 10 AM – 8 PM<br />
                      Sunday: 12 PM – 6 PM
                    </p>
                  </div>
                </div>

                {/* WhatsApp CTA */}
                <a
                  href="https://wa.me/923216004630"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-[#25D366] text-white px-6 py-3 hover:bg-[#1ebe5d] transition-colors mt-2"
                  style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.25em', textTransform: 'uppercase' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Form — no email field */}
            <div className="bg-white/60 border border-[#5c1a25]/10 p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <CheckCircle size={56} className="text-green-500 mb-4" />
                  <h3 className="text-[#5c1a25] mb-2 font-light" style={{ fontSize: '1.5rem' }}>Message Sent!</h3>
                  <p className="text-[#5c1a25]/50" style={{ fontSize: '13px', fontWeight: 300 }}>
                    We&apos;ll get back to you within 24 hours via WhatsApp.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-[#5c1a25] mb-6 font-light" style={{ fontSize: '1.5rem' }}>Send a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-optima text-[#5c1a25] text-xs tracking-[0.22em] uppercase mb-1.5 block font-normal">Name *</label>
                        <input type="text" required className="form-input" placeholder="Your name"
                          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                      </div>
                      <div>
                        <label className="font-optima text-[#5c1a25] text-xs tracking-[0.22em] uppercase mb-1.5 block font-normal">Phone *</label>
                        <input type="tel" required className="form-input" placeholder="03XX-XXXXXXX"
                          value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className="font-optima text-[#5c1a25] text-xs tracking-[0.22em] uppercase mb-1.5 block font-normal">Subject</label>
                      <input type="text" className="form-input" placeholder="e.g. Custom Ring Inquiry"
                        value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                    </div>
                    <div>
                      <label className="font-optima text-[#5c1a25] text-xs tracking-[0.22em] uppercase mb-1.5 block font-normal">Message *</label>
                      <textarea required className="form-input resize-none h-32" placeholder="Your message..."
                        value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                    </div>
                    <button type="submit" disabled={sending} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-70">
                      <Send size={14} /> {sending ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
