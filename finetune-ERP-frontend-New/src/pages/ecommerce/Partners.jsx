import { HiOutlineGlobe, HiOutlinePhone, HiOutlineMail } from 'react-icons/hi';

function Partners() {
  const partners = [
    {
      id: 1,
      name: "Apple Inc.",
      logo: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&h=200&fit=crop",
      description: "Official Apple Authorized Reseller. Premium Apple products with genuine warranty and support.",
      category: "Premium Partner",
      website: "https://www.apple.com",
      phone: "+1-800-275-2273",
      email: "partnership@apple.com"
    },
    {
      id: 2,
      name: "Samsung Electronics",
      logo: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&h=200&fit=crop",
      description: "Authorized Samsung Partner. Latest smartphones, tablets, and smart devices with exclusive offers.",
      category: "Premium Partner",
      website: "https://www.samsung.com",
      phone: "+91-1800-40-7267864",
      email: "partners@samsung.com"
    },
    {
      id: 3,
      name: "Dell Technologies",
      logo: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&h=200&fit=crop",
      description: "Dell Authorized Partner. Business laptops, desktops, and enterprise solutions with corporate discounts.",
      category: "Business Partner",
      website: "https://www.dell.com",
      phone: "+91-1800-425-4026",
      email: "partnership@dell.com"
    },
    {
      id: 4,
      name: "Sony Corporation",
      logo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
      description: "Sony Authorized Dealer. Premium audio equipment, cameras, and entertainment systems.",
      category: "Premium Partner",
      website: "https://www.sony.com",
      phone: "+91-1800-103-7799",
      email: "partners@sony.com"
    },
    {
      id: 5,
      name: "Logitech",
      logo: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop",
      description: "Official Logitech Partner. Gaming peripherals, office accessories, and smart home solutions.",
      category: "Accessories Partner",
      website: "https://www.logitech.com",
      phone: "+91-1800-425-4026",
      email: "partnership@logitech.com"
    },
    {
      id: 6,
      name: "ASUS",
      logo: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=200&h=200&fit=crop",
      description: "ASUS Authorized Partner. Gaming laptops, motherboards, and computer components.",
      category: "Gaming Partner",
      website: "https://www.asus.com",
      phone: "+91-1800-209-0365",
      email: "partners@asus.com"
    }
  ];

  const partnerCategories = [
    {
      name: "Premium Partners",
      description: "Top-tier brands with exclusive products and premium support",
      count: 3
    },
    {
      name: "Business Partners",
      description: "Enterprise solutions and corporate technology partners",
      count: 1
    },
    {
      name: "Accessories Partners",
      description: "Specialized accessories and peripheral manufacturers",
      count: 1
    },
    {
      name: "Gaming Partners",
      description: "Gaming hardware and esports equipment providers",
      count: 1
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Partners</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We collaborate with world-leading technology brands to bring you the best products 
            with genuine warranties and exceptional customer support.
          </p>
        </div>

        {/* Partner Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {partnerCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-3xl mb-3">
                {category.name === "Premium Partners" && "⭐"}
                {category.name === "Business Partners" && "🏢"}
                {category.name === "Accessories Partners" && "🔧"}
                {category.name === "Gaming Partners" && "🎮"}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{category.description}</p>
              <div className="text-2xl font-bold text-gray-900">{category.count}</div>
            </div>
          ))}
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner) => (
            <div key={partner.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Partner Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{partner.name}</h3>
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full border border-keyline">
                      {partner.category}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {partner.description}
                </p>
              </div>

              {/* Partner Contact Info */}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <HiOutlineGlobe className="w-4 h-4 text-gray-400" />
                  <a 
                    href={partner.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-keyline"
                  >
                    Visit Website
                  </a>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <HiOutlinePhone className="w-4 h-4 text-gray-400" />
                  <a 
                    href={`tel:${partner.phone}`}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {partner.phone}
                  </a>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <HiOutlineMail className="w-4 h-4 text-gray-400" />
                  <a 
                    href={`mailto:${partner.email}`}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {partner.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Partnership Benefits */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Partnership Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Genuine Warranty</h3>
              <p className="text-gray-600">
                All products come with official manufacturer warranty and support
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Priority shipping and express delivery options available
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Exclusive Offers</h3>
              <p className="text-gray-600">
                Special discounts and bundle deals from our partners
              </p>
            </div>
          </div>
        </div>

        {/* Become a Partner */}
        <div className="mt-12 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Interested in Partnership?</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            We're always looking for new technology partners to expand our product portfolio 
            and provide better value to our customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+919791151863"
              className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-keyline transition-colors"
            >
              Call Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Partners; 