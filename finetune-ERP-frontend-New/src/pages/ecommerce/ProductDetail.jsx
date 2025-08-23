import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../../utils/mockData';
import { addToCart } from '../../redux/slice/cartSlice';
import Payment from '../../components/ecommerce/Payment';
import {
  Star,
  ShoppingCart,
  Heart,
  Truck,
  ShieldCheck,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';

function ProductDetail() {
  const dispatch = useDispatch();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const foundProduct = getProductById(productId);
    setProduct(foundProduct);
  }, [productId]);

  useEffect(() => {
    // Generate order ID when payment is shown
    if (showPayment) {
      setOrderId(
        'ORD' +
          Date.now() +
          Math.random().toString(36).substr(2, 5).toUpperCase()
      );
    }
  }, [showPayment]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    toast.success(`${product.name} (${quantity}) added to cart!`);
  };

  const handleBuyNow = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = (transactionId) => {
    console.log('Payment successful:', transactionId);
    // TODO: Handle successful payment
    alert('Payment successful! Your order has been placed.');
    setShowPayment(false);
  };

  const handlePaymentFailure = (error) => {
    console.log('Payment failed:', error);
    alert('Payment failed: ' + error);
    setShowPayment(false);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-surface dark:bg-primary pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-primary/40 dark:text-surface/40 text-display-xl mb-4">
            ❌
          </div>
          <h3 className="text-heading-md font-medium text-primary dark:text-surface mb-2">
            Product not found
          </h3>
          <Link
            to="/shop"
            className="text-body-md text-primary/70 dark:text-surface/70 hover:text-secondary"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  if (showPayment) {
    return (
      <div className="min-h-screen bg-surface dark:bg-primary pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => setShowPayment(false)}
            className="flex items-center gap-2 text-body-md text-primary/70 dark:text-surface/70 hover:text-secondary mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Product
          </button>
          <Payment
            amount={product.price * quantity}
            orderId={orderId}
            onSuccess={handlePaymentSuccess}
            onFailure={handlePaymentFailure}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-primary pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-body-sm text-primary/60 dark:text-surface/60 mb-8">
          <Link to="/shop" className="hover:text-secondary">
            Shop
          </Link>
          <span>•</span>
          <Link
            to={`/categories/${product.category}`}
            className="hover:text-secondary capitalize"
          >
            {product.category}
          </Link>
          <span>•</span>
          <span className="text-primary dark:text-surface">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-surface dark:bg-primary rounded-lg overflow-hidden shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-heading-xl font-bold text-primary dark:text-surface mb-2">
                {product.name}
              </h1>
              <p className="text-primary/60 dark:text-surface/60 text-body-md">
                {product.description}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-secondary fill-current'
                        : 'text-primary/20 dark:text-surface/20'
                    }`}
                  />
                ))}
              </div>
              <span className="text-body-sm text-primary/60 dark:text-surface/60">
                {product.rating} out of 5
              </span>
              <span className="text-body-sm text-primary/50 dark:text-surface/50">
                ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-heading-xl font-bold text-primary dark:text-surface">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-heading-lg text-primary/50 dark:text-surface/50 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="bg-error/10 dark:bg-error/20 text-error text-body-sm font-medium px-2 py-1 rounded">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
              {product.originalPrice > product.price && (
                <p className="text-success text-body-md font-medium">
                  You save {formatPrice(product.originalPrice - product.price)}
                </p>
              )}
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-heading-lg font-semibold text-primary dark:text-surface mb-3">
                Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between py-2 border-b border-primary/10 dark:border-surface/10"
                  >
                    <span className="text-primary/60 dark:text-surface/60 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}:
                    </span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-body-sm font-medium text-primary/70 dark:text-surface/70 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 border border-primary/30 dark:border-surface/30 rounded-lg flex items-center justify-center hover:bg-surface/80 dark:hover:bg-primary/80"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 border border-primary/30 dark:border-surface/30 rounded-lg flex items-center justify-center hover:bg-surface/80 dark:hover:bg-primary/80"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-surface py-3 px-6 rounded-lg font-semibold hover:bg-primary/80 dark:bg-surface dark:text-primary dark:hover:bg-surface/80 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-primary text-surface py-3 px-6 rounded-lg font-semibold hover:bg-primary/80 dark:bg-surface dark:text-primary dark:hover:bg-surface/80 transition-colors"
              >
                Buy Now with PhonePe
              </button>
            </div>

            {/* Wishlist Button */}
            <button className="w-full border border-primary/30 dark:border-surface/30 text-body-md text-primary/70 dark:text-surface/70 py-3 px-6 rounded-lg font-semibold hover:bg-surface/80 dark:hover:bg-primary/80 transition-colors flex items-center justify-center gap-2">
              <Heart className="w-5 h-5" />
              Add to Wishlist
            </button>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-primary/20 dark:border-surface/20">
              <div className="text-center">
                <Truck className="w-8 h-8 text-keyline mx-auto mb-2" />
                <h4 className="font-medium text-primary dark:text-surface text-body-md">
                  Free Shipping
                </h4>
                <p className="text-body-sm text-primary/60 dark:text-surface/60">
                  On orders above ₹999
                </p>
              </div>
              <div className="text-center">
                <ShieldCheck className="w-8 h-8 text-success mx-auto mb-2" />
                <h4 className="font-medium text-primary dark:text-surface text-body-md">
                  Genuine Product
                </h4>
                <p className="text-body-sm text-primary/60 dark:text-surface/60">
                  100% authentic
                </p>
              </div>
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-secondary mx-auto mb-2" />
                <h4 className="font-medium text-primary dark:text-surface text-body-md">
                  Easy Returns
                </h4>
                <p className="text-body-sm text-primary/60 dark:text-surface/60">
                  30-day return policy
                </p>
              </div>
            </div>

            {/* Stock Status */}
            <div className="pt-4 border-t border-primary/20 dark:border-surface/20">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-success' : 'bg-error'}`}
                ></div>
                <span
                  className={`${product.inStock ? 'text-success' : 'text-error'} text-body-md`}
                >
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-heading-lg font-bold text-primary dark:text-surface mb-8">
            You might also like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* TODO: Add related products */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
