const fs = require('fs');

const categories = [
  { name: 'rings', image: '/images/ai-products/ring_21k_1791399656411.jpg' },
  { name: 'necklaces', image: '/images/ai-products/necklace_21k_1791399665745.jpg' },
  { name: 'earrings', image: '/images/ai-products/earrings_21k_1791399676054.jpg' },
  { name: 'bracelets', image: '/images/ai-products/bracelet_21k_1791399685653.jpg' },
  { name: 'bangles', image: '/images/ai-products/bangle_21k_1791399695687.jpg' },
  { name: 'pendants', image: '/images/ai-products/pendant_21k_1791399706109.jpg' },
  { name: 'nose pins', image: '/images/ai-products/earrings_21k_1791399676054.jpg' } // fallback to earrings image
];

const adjectives = ['Luxurious', 'Elegant', 'Royal', 'Majestic', 'Exquisite', 'Classic', 'Modern', 'Vintage', 'Timeless', 'Premium'];
const materials = ['21k Gold & Diamond', '21k Gold', '21k Rose Gold & Diamond', '21k White Gold Mix'];

async function seed() {
  try {
    // Delete all existing products first
    await fetch('http://localhost:7000/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: '*' }) // Wait, the API DELETE expects a specific ID. Let's just use supabase-js to truncate if we want, or fetch the products and delete them one by one.
    });
  } catch(e) {}

  for (const cat of categories) {
    const basePrice = Math.floor(Math.random() * 200000) + 50000;
    const catNameSingular = cat.name.replace(/s$/, '').replace('Nose pin', 'Nose Pin');
    
    let desc = '';
    switch(cat.name) {
      case 'rings': desc = 'A timeless symbol of elegance. This meticulously crafted ring features a stunning central brilliant-cut diamond set in pure 21k gold. The perfect statement piece for any occasion.'; break;
      case 'necklaces': desc = 'Drape yourself in luxury. This exquisite 21k gold necklace seamlessly blends traditional craftsmanship with modern design, highlighting a breathtaking diamond pendant that captures the light from every angle.'; break;
      case 'earrings': desc = 'Illuminate your presence. These delicate 21k gold earrings feature cascading diamond drops that gracefully frame the face, offering unparalleled brilliance and sophistication.'; break;
      case 'bracelets': desc = 'A masterpiece for your wrist. Crafted from solid 21k gold, this bracelet boasts intricate diamond-encrusted links that provide a seamless, comfortable fit and an unforgettable sparkle.'; break;
      case 'bangles': desc = 'Heritage reimagined. This traditional 21k gold bangle is adorned with exquisite filigree work and embedded diamonds, celebrating centuries of masterful jewelry artistry.'; break;
      case 'pendants': desc = 'Elegance in its purest form. A magnificent central diamond rests within an ornate 21k gold setting, designed to sit perfectly against the heart.'; break;
      case 'nose pins': desc = 'A subtle touch of brilliance. This delicate 21k gold nose pin features a flawless, ethically sourced diamond that adds a refined sparkle to your everyday look.'; break;
      default: desc = `A classic and elegant ${catNameSingular} crafted in premium 21k Gold.`;
    }

    const product = {
      id: `prod-${cat.name.replace(' ', '-')}-1`,
      name: `Classic ${catNameSingular.charAt(0).toUpperCase() + catNameSingular.slice(1)}`,
      price: basePrice,
      original_price: basePrice + 20000,
      category: cat.name,
      description: desc,
      image: cat.image,
      images: [cat.image],
      rating: 5.0,
      reviews: Math.floor(Math.random() * 50) + 5,
      is_best_seller: true
    };

    try {
      const res = await fetch('http://localhost:7000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (res.ok) console.log(`Added ${product.name}`);
    } catch (err) {}
  }
}

seed();
