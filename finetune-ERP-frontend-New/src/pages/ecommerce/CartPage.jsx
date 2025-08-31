import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from '@/redux/slice/cartSlice';
import {
  HiOutlineTrash,
  HiOutlineShoppingBag,
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
} from 'react-icons/hi';
import Payment from '@/components/ecommerce/Payment';
import { useState } from 'react';

function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, itemCount } = useSelector((state) => state.cart);
  const [showPayment, setShowPayment] = useState(false);
  const [orderId, setOrderId] = useState('');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (productId, quantity) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    if (items.length === 0) return;

    setOrderId(
      'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase()
    );
    setShowPayment(true);
  };

  const handlePaymentSuccess = (transactionId) => {
    console.log('Payment successful:', transactionId);
    alert('Payment successful! Your order has been placed.');
    dispatch(clearCart());
    setShowPayment(false);
    navigate('/shop');
  };

  const handlePaymentFailure = (error) => {
    console.log('Payment failed:', error);
    alert('Payment failed: ' + error);
    setShowPayment(false);
  };

  if (showPayment) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => setShowPayment(false)}
            className="flex items-center gap-2 text-gray-700 hover:text-keyline mb-6"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back to Cart
          </button>
          <Payment
            amount={total}
            orderId={orderId}
            onSuccess={handlePaymentSuccess}
            onFailure={handlePaymentFailure}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <HiOutlineShoppingBag className="w-8 h-8 text-keyline" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-gray-600">{itemCount} items in your cart</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="flex items-center gap-2 text-gray-700 hover:text-keyline"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            Continue Shopping
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <HiOutlineShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors font-semibold"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Cart Items
                </h2>
                <div className="space-y-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 border border-gray-200 rounded-lg"
                    >
                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 capitalize">
                          {item.category}
                        </p>
                        <p className="font-semibold text-gray-900 text-lg">
                          {formatPrice(item.price)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-4">
                          <span className="text-sm text-gray-600">
                            Quantity:
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                            >
                              -
                            </button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Subtotal ({itemCount} items):
                    </span>
                    <span className="font-medium">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">
                      {formatPrice(total * 0.18)}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span>{formatPrice(total + total * 0.18)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Checkout</span>
                    <HiOutlineArrowRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleClearCart}
                    className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>

                {/* Security Notice */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    🔒 Your payment information is secure and encrypted
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
