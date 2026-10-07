import Header from '@/components/Header';
import Footer from '@/components/Footer';

const optima = "'Optima Nova LT Pro', Optima, 'Gill Sans MT', sans-serif";

export default function ShippingPolicyPage() {
  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen bg-[#EFE9E1]">
        <div className="bg-[#5c1a25] py-14 text-center">
          <h1 style={{ fontFamily: optima, fontSize: '2.5rem', fontWeight: 300, color: '#EFE9E1', letterSpacing: '0.1em' }}>Shipping Policy</h1>
          <p style={{ fontFamily: optima, fontSize: '10px', fontWeight: 300, letterSpacing: '0.35em', color: 'rgba(239,233,225,0.5)', marginTop: '8px', textTransform: 'uppercase' }}>IJC — Ijaz Casting &amp; Jewellery Centre</p>
        </div>
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">
          {[
            { title: 'Delivery Timeframe', body: 'Orders are processed within 2–3 business days. Standard delivery takes 5–7 working days across Pakistan. Express delivery (2–3 days) is available for select cities at an additional charge.' },
            { title: 'Delivery Charges', body: 'Free delivery on all orders above Rs. 50,000. For orders below Rs. 50,000, a flat delivery fee of Rs. 250 applies. Remote areas may incur additional charges.' },
            { title: 'Order Confirmation', body: 'Our team will call you within 24 hours of placing your order to confirm delivery details. Please ensure your phone number is correct at checkout.' },
            { title: 'Packaging', body: 'All jewellery is carefully packed in premium IJC branded boxes with protective cushioning to ensure safe delivery. Gift wrapping is available on request.' },
            { title: 'Tracking', body: 'Once your order is dispatched, you will receive a tracking number via SMS/WhatsApp. You can use this to track your shipment through our courier partner\'s website.' },
            { title: 'International Shipping', body: 'Currently, IJC ships within Pakistan only. International shipping is being planned and will be announced soon on our social media channels.' },
          ].map(({ title, body }) => (
            <div key={title} className="pb-6 border-b border-[#5c1a25]/10 last:border-0">
              <h2 style={{ fontFamily: optima, fontSize: '15px', fontWeight: 500, color: '#5c1a25', letterSpacing: '0.06em', marginBottom: '8px' }}>{title}</h2>
              <p style={{ fontFamily: optima, fontSize: '13px', fontWeight: 300, color: 'rgba(44,24,16,0.7)', lineHeight: 1.9, letterSpacing: '0.03em' }}>{body}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
