export const products = [
  // Mobiles
  {
    id: 1,
    name: "iPhone 15 Pro",
    category: "Mobiles",
    price: 129999,
    originalPrice: 149999,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop",
    rating: 4.8,
    reviews: 1247,
    description: "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system",
    specs: {
      storage: "256GB",
      color: "Natural Titanium",
      screen: "6.1 inch",
      battery: "Up to 23 hours"
    },
    inStock: true,
    stockCount:10,
    discount: 13
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    category: "Mobiles",
    price: 119999,
    originalPrice: 139999,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&h=300&fit=crop",
    rating: 4.7,
    reviews: 892,
    description: "Premium Android flagship with S Pen, AI features, and exceptional camera",
    specs: {
      storage: "512GB",
      color: "Titanium Gray",
      screen: "6.8 inch",
      battery: "Up to 24 hours"
    },
    inStock: true,
    discount: 14,
    stockCount:10,
  },
  {
    id: 3,
    name: "OnePlus 12",
    category: "Mobiles",
    price: 69999,
    originalPrice: 79999,
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&h=300&fit=crop",
    rating: 4.6,
    reviews: 567,
    description: "Fast performance with Hasselblad camera and 100W charging",
    specs: {
      storage: "256GB",
      color: "Silk Black",
      screen: "6.82 inch",
      battery: "Up to 20 hours"
    },
    inStock: true,
    discount: 12,
    stockCount:10,
  },
  {
    id: 4,
    name: "Google Pixel 8 Pro",
    category: "Mobiles",
    price: 89999,
    originalPrice: 99999,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop",
    rating: 4.5,
    reviews: 423,
    description: "Best camera phone with Google AI and clean Android experience",
    specs: {
      storage: "128GB",
      color: "Obsidian",
      screen: "6.7 inch",
      battery: "Up to 21 hours"
    },
    inStock: true,
    discount: 10,
    stockCount:10,
  },

  // Laptops
  {
    id: 5,
    name: "MacBook Pro 16-inch",
    category: "laptops",
    price: 249999,
    originalPrice: 279999,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop",
    rating: 4.9,
    reviews: 2341,
    description: "Professional laptop with M3 Pro chip, Liquid Retina XDR display",
    specs: {
      storage: "1TB SSD",
      memory: "18GB RAM",
      processor: "M3 Pro",
      screen: "16.2 inch"
    },
    inStock: true,
    discount: 11,
    stockCount:10,
  },
  {
    id: 6,
    name: "Dell XPS 15",
    category: "Laptops",
    price: 189999,
    originalPrice: 219999,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&h=300&fit=crop",
    rating: 4.7,
    reviews: 1567,
    description: "Premium Windows laptop with OLED display and RTX graphics",
    specs: {
      storage: "1TB SSD",
      memory: "32GB RAM",
      processor: "Intel i9-13900H",
      screen: "15.6 inch OLED"
    },
    inStock: true,
    discount: 14,
    stockCount:10,
  },
  {
    id: 7,
    name: "ASUS ROG Strix G16",
    category: "Laptops",
    price: 159999,
    originalPrice: 179999,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&h=300&fit=crop",
    rating: 4.6,
    reviews: 892,
    description: "Gaming laptop with RTX 4070, high refresh rate display",
    specs: {
      storage: "1TB SSD",
      memory: "16GB RAM",
      processor: "Intel i7-13650H",
      screen: "16 inch 165Hz"
    },
    inStock: true,
    discount: 11,
    stockCount:10,
  },
  {
    id: 8,
    name: "Lenovo ThinkPad X1 Carbon",
    category: "Laptops",
    price: 169999,
    originalPrice: 189999,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop",
    rating: 4.8,
    reviews: 1234,
    description: "Business laptop with premium build quality and long battery life",
    specs: {
      storage: "512GB SSD",
      memory: "16GB RAM",
      processor: "Intel i7-1355U",
      screen: "14 inch 2.8K"
    },
    inStock: true,
    discount: 11,
    stockCount:10,
  },

  // Accessories
  {
    id: 9,
    name: "Apple AirPods Pro",
    category: "accessories",
    price: 24999,
    originalPrice: 29999,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=300&fit=crop",
    rating: 4.7,
    reviews: 3456,
    description: "Active noise cancellation, spatial audio, sweat and water resistant",
    specs: {
      type: "Wireless Earbuds",
      battery: "Up to 6 hours",
      case: "MagSafe Charging Case"
    },
    inStock: true,
    discount: 17,
    stockCount:10,
  },
  {
    id: 10,
    name: "Samsung Galaxy Watch 6",
    category: "Accessories",
    price: 29999,
    originalPrice: 34999,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300&h=300&fit=crop",
    rating: 4.6,
    reviews: 1234,
    description: "Advanced health monitoring, rotating bezel, long battery life",
    specs: {
      type: "Smartwatch",
      battery: "Up to 40 hours",
      screen: "1.5 inch AMOLED"
    },
    inStock: true,
    discount: 14,
    stockCount:10,
  },
  {
    id: 11,
    name: "Logitech MX Master 3S",
    category: "Accessories",
    price: 8999,
    originalPrice: 10999,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop",
    rating: 4.8,
    reviews: 2341,
    description: "Premium wireless mouse with MagSpeed scrolling and precision tracking",
    specs: {
      type: "Wireless Mouse",
      battery: "Up to 70 days",
      dpi: "8000 DPI"
    },
    inStock: true,
    discount: 18,
    stockCount:10,
  },
  {
    id: 12,
    name: "Apple Magic Keyboard",
    category: "Accessories",
    price: 12999,
    originalPrice: 14999,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop",
    rating: 4.5,
    reviews: 987,
    description: "Slim design with scissor mechanism, perfect for Mac users",
    specs: {
      type: "Wireless Keyboard",
      battery: "Up to 1 month",
      layout: "US English"
    },
    inStock: true,
    discount: 13,
    stockCount:10,
  },

  // Headphones
  {
    id: 13,
    name: "Sony WH-1000XM5",
    category: "headphones",
    price: 29999,
    originalPrice: 34999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    rating: 4.9,
    reviews: 4567,
    description: "Industry-leading noise cancellation with exceptional sound quality",
    specs: {
      type: "Over-ear Wireless",
      battery: "Up to 30 hours",
      noise: "Active Noise Cancellation"
    },
    inStock: true,
    discount: 14,
    stockCount:10,
  },
  {
    id: 14,
    name: "Bose QuietComfort 45",
    category: "Headphones",
    price: 27999,
    originalPrice: 31999,
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop",
    rating: 4.7,
    reviews: 2341,
    description: "Comfortable design with excellent noise cancellation",
    specs: {
      type: "Over-ear Wireless",
      battery: "Up to 24 hours",
      noise: "Active Noise Cancellation"
    },
    inStock: true,
    discount: 12,
    stockCount:10,
  },
  {
    id: 15,
    name: "Sennheiser HD 660S",
    category: "Headphones",
    price: 39999,
    originalPrice: 44999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    rating: 4.8,
    reviews: 1234,
    description: "Open-back headphones for audiophiles with detailed sound",
    specs: {
      type: "Over-ear Wired",
      impedance: "150 ohms",
      sensitivity: "104 dB"
    },
    inStock: true,
    discount: 11,
    stockCount:10,
  },
  {
    id: 16,
    name: "Audio-Technica ATH-M50x",
    category: "Headphones",
    price: 15999,
    originalPrice: 18999,
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop",
    rating: 4.6,
    reviews: 3456,
    description: "Studio-quality headphones with exceptional clarity",
    specs: {
      type: "Over-ear Wired",
      impedance: "38 ohms",
      sensitivity: "99 dB"
    },
    inStock: true,
    discount: 16,
    stockCount:10,
  }
];

export const categories = [
  {
    id: "mobiles",
    name: "Mobiles",
    icon: "📱",
    description: "Latest smartphones from top brands",
    productCount: 4,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop"
  },
  {
    id: "laptops",
    name: "Laptops",
    icon: "💻",
    description: "High-performance laptops for work and gaming",
    productCount: 4,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop"
  },
  {
    id: "accessories",
    name: "Accessories",
    icon: "🔧",
    description: "Essential tech accessories and peripherals",
    productCount: 4,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=200&fit=crop"
  },
  {
    id: "headphones",
    name: "Headphones",
    icon: "🎧",
    description: "Premium audio experience with noise cancellation",
    productCount: 4,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop"
  }
];

export const getProductsByCategory = (category) => {
  // Handle both lowercase and title case category names
  const normalizedCategory = category.toLowerCase();
  return products.filter(product => 
    product.category.toLowerCase() === normalizedCategory
  );
};

export const getProductById = (id) => {
  return products.find(product => product.id === parseInt(id));
};

export const searchProducts = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery)
  );
}; 