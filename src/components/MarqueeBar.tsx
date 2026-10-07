export default function MarqueeBar() {
  const items = [
    '✦ Free Delivery on Orders Above Rs. 50,000',
    '✦ Custom Jewellery Orders Welcome',
    '✦ 100% Genuine Gold & Gemstones',
    '✦ Decades of Master Craftsmanship',
    '✦ Certified & Hallmarked Pieces',
    '✦ Bridal Sets Available',
  ];
  const doubled = [...items, ...items];

  return (
    <div className="bg-[#5c1a25] text-[#EFE9E1] py-3 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {doubled.map((item, i) => (
          <span key={i} className="font-cormorant text-sm tracking-widest mx-8 flex-shrink-0">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
