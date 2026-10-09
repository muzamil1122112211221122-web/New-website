import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#ffffff]">
        <div className="bg-[#5c1a25] pt-32 pb-14 text-center">
          <h1 className="font-optima text-[#ffffff] font-normal tracking-widest" style={{ fontSize: '2.4rem' }}>
            Privacy Policy
          </h1>
          <p className="font-optima text-[#ffffff]/45 mt-2 tracking-[0.35em] text-xs uppercase">
            IC — Ijaz Casting &amp; Jewellery Centre
          </p>
        </div>
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">
          {[
            {
              title: 'Information We Collect',
              body: 'We collect information you provide when placing an order, including your name, phone number, email address, and delivery address. We may also collect browsing data to improve your experience on our website.',
            },
            {
              title: 'How We Use Your Information',
              body: 'Your information is used exclusively to process and deliver your orders, contact you about your purchase, and improve our services. We do not sell, trade, or rent your personal information to third parties.',
            },
            {
              title: 'Data Security',
              body: 'We implement appropriate security measures to protect your personal information. Your data is stored securely and accessed only by authorized personnel involved in order fulfillment.',
            },
            {
              title: 'WhatsApp & Phone Communication',
              body: 'By providing your phone number, you consent to receiving order confirmations and updates via WhatsApp or phone call. You may opt out at any time by contacting us.',
            },
            {
              title: 'Cookies',
              body: 'Our website may use cookies to enhance your browsing experience and remember your preferences. You can disable cookies through your browser settings, though this may affect website functionality.',
            },
            {
              title: 'Third-Party Links',
              body: 'Our website may contain links to external websites. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies.',
            },
            {
              title: 'Changes to This Policy',
              body: 'We reserve the right to update this privacy policy at any time. Changes will be posted on this page. Continued use of our website after changes constitutes acceptance of the updated policy.',
            },
            {
              title: 'Contact Us',
              body: 'For any privacy-related concerns, contact us at 03216004630 (WhatsApp) or email info@ICjewellery.pk. We will respond within 2 business days.',
            },
          ].map(({ title, body }) => (
            <div key={title} className="pb-6 border-b border-[#5c1a25]/10 last:border-0">
              <h2 className="font-optima font-normal text-[#5c1a25] tracking-wide mb-3" style={{ fontSize: '1rem' }}>
                {title}
              </h2>
              <p className="font-cormorant text-[#2c1810]/65 leading-relaxed" style={{ fontSize: '1rem', fontWeight: 300 }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
