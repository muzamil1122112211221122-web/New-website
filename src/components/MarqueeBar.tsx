export default function MarqueeBar() {
  const items = [
    'Free delivery on orders above 50k',
    'Best quality',
    '100% original gold',
    'Handcrafted'
  ];
  
  // Duplicate enough times to ensure screen is filled for continuous scroll
  const multiplied = [...items, ...items, ...items, ...items];

  return (
    <div className="bg-[#5c1a25] text-[#ffffff] py-3 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {multiplied.map((item, i) => (
          <span key={i} className="font-cormorant text-sm tracking-widest uppercase mx-12 flex-shrink-0">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
