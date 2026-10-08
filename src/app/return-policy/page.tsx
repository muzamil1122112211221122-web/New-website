import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ReturnPolicyPage() {
  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen bg-[#EFE9E1]">
        <div className="bg-[#5c1a25] py-14 text-center">
          <h1 className="text-[#EFE9E1] font-light tracking-widest" style={{ fontSize: '2.4rem' }}>Return &amp; Exchange Policy</h1>
          <p className="text-[#EFE9E1]/45 mt-2 tracking-[0.35em] text-xs uppercase font-optima font-light">IC — Ijaz Casting &amp; Jewellery Centre</p>
        </div>
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">
          {[
            {
              title: 'Return Window',
              body: 'We accept returns within 7 days of delivery for items that are unused, in their original condition, and in original packaging. Custom-made pieces are non-returnable.',
            },
            {
              title: 'Proof Required — Must',
              body: 'A valid proof of purchase (order confirmation, receipt, or order number) is mandatory for all returns and exchanges. Without proof of purchase, returns cannot be processed. Additionally, photo or video proof of the item\'s condition at the time of return request must be submitted.',
            },
            {
              title: 'Eligibility',
              body: 'Items must be unworn, undamaged, and in their original packaging with all certificates and tags intact. Items that have been resized, engraved, or altered in any way cannot be returned or exchanged.',
            },
            {
              title: 'Exchange Policy',
              body: 'We offer size exchanges within 14 days of purchase with valid proof. One exchange per order is permitted. The item must be in original condition with proof of purchase.',
            },
            {
              title: 'Refund Process',
              body: 'Once we receive, inspect, and verify the returned item and proof, we will process your refund within 5–7 business days. Refunds are issued via bank transfer or store credit.',
            },
            {
              title: 'Damaged Items',
              body: 'If you receive a damaged or incorrect item, contact us within 48 hours with clear photo/video evidence on WhatsApp: 03216004630. We will arrange a free replacement or full refund.',
            },
            {
              title: 'How to Initiate a Return',
              body: 'WhatsApp us at 03216004630 or call 03216004632 with your order number and proof of purchase. Our team will guide you through the return process within 24 hours.',
            },
          ].map(({ title, body }) => (
            <div key={title} className="pb-6 border-b border-[#5c1a25]/10 last:border-0">
              <h2 className="font-optima font-normal text-[#5c1a25] tracking-wide mb-3" style={{ fontSize: '14px', letterSpacing: '0.12em' }}>
                {title}
              </h2>
              <p className="text-[#2c1810]/65 leading-relaxed" style={{ fontSize: '14px', fontWeight: 300, lineHeight: 1.9 }}>
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
