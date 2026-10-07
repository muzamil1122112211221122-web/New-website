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
  for (const cat of categories) {
    for (let i = 1; i <= 10; i++) {
      const adj = adjectives[i % adjectives.length];
      const mat = materials[i % materials.length];
      const basePrice = Math.floor(Math.random() * 200000) + 50000;
      
      const product = {
        id: `prod-${cat.name.replace(' ', '-')}-${i}`,
        name: `${adj} ${cat.name.replace(/s$/, '')}`,
        price: basePrice,
        original_price: Math.random() > 0.5 ? basePrice + 20000 : null,
        category: cat.name,
        description: `Experience the pinnacle of luxury with this ${adj.toLowerCase()} ${cat.name.replace(/s$/, '')}. Crafted meticulously in ${mat}, featuring hyper-realistic details and perfect centering. A true masterpiece of fine jewelry.`,
        image: cat.image,
        images: [cat.image],
        rating: (Math.random() * 1 + 4).toFixed(1), // 4.0 to 5.0
        reviews: Math.floor(Math.random() * 50) + 5,
        is_best_seller: i <= 2,
        material: mat
      };

      try {
        const res = await fetch('http://localhost:7000/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product)
        });
        if (!res.ok) console.log(`Failed to add ${product.name}: ${res.statusText}`);
        else console.log(`Added ${product.name}`);
      } catch (err) {
        console.error(err);
      }
    }
  }
}

seed();
