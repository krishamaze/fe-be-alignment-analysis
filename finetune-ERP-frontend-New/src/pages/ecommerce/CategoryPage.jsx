import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getProductsByCategory, categories } from '../../utils/mockData';
import { addToCart } from '../../redux/slice/cartSlice';
import {
  HiOutlineArrowLeft,
  HiOutlineHeart,
  HiOutlineShoppingCart,
  HiOutlineStar,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

function CategoryPage() {
  const dispatch = useDispatch();
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const categoryProducts = getProductsByCategory(categoryId);
    setProducts(categoryProducts);

    const categoryInfo = categories.find((cat) => cat.id === categoryId);
    setCategory(categoryInfo);
  }, [categoryId]);

  useEffect(() => {
    let sortedProducts = [...products];

    switch (sortBy) {
      case 'price-low':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        sortedProducts.sort((a, b) => b.discount - a.discount);
        break;
      default:
        // Keep original order for 'featured'
        break;
    }

    setProducts(sortedProducts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`${product.name} added to cart!`);
  };

  const handleAddToWishlist = (product) => {
    // TODO: Implement wishlist functionality
    console.log('Added to wishlist:', product.name);
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">❌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Category not found
          </h3>
          <Link to="/shop" className="text-gray-700 hover:text-keyline">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-keyline mb-4"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>

          <div className="flex items-center gap-4">
            <div className="text-4xl">{category.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {category.name}
              </h1>
              <p className="text-gray-600">{category.description}</p>
            </div>
          </div>
        </div>

        {/* Sort and Results */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-gray-600">
              {products.length} products in {category.name}
            </div>

            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-keyline focus:border-transparent"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="discount">Best Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {product.discount > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    -{product.discount}%
                  </div>
                )}
                <button
                  onClick={() => handleAddToWishlist(product)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                >
                  <HiOutlineHeart className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-semibold text-gray-900 mb-2 hover:text-keyline transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <HiOutlineStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-1">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                >
                  <HiOutlineShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Products */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">This category is currently empty</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
