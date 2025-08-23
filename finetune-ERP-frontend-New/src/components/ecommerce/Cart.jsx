import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  closeCart,
} from '../../redux/slice/cartSlice';
import {
  HiOutlineX,
  HiOutlineTrash,
  HiOutlineShoppingBag,
  HiOutlineArrowRight,
} from 'react-icons/hi';
import Payment from './Payment';
import { useState } from 'react';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, itemCount, isOpen } = useSelector(
    (state) => state.cart
  );
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

  const handleCloseCart = () => {
    dispatch(closeCart());
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
    handleCloseCart();
    navigate('/shop');
  };

  const handlePaymentFailure = (error) => {
    console.log('Payment failed:', error);
    alert('Payment failed: ' + error);
    setShowPayment(false);
  };

  if (!isOpen) return null;

  if (showPayment) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Complete Payment</h2>
              <button
                onClick={() => setShowPayment(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <HiOutlineX className="w-6 h-6" />
              </button>
            </div>
          </div>
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <HiOutlineShoppingBag className="w-6 h-6 text-keyline" />
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full border border-keyline">
              {itemCount}
            </span>
          </div>
          <button
            onClick={handleCloseCart}
            className="text-gray-500 hover:text-gray-700"
          >
            <HiOutlineX className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <HiOutlineShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-600 mb-6">
                Add some products to get started!
              </p>
              <button
                onClick={() => {
                  handleCloseCart();
                  navigate('/shop');
                }}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 border border-gray-200 rounded-lg"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.category}
                    </p>
                    <p className="font-semibold text-gray-900">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stockCount}
                          className={`w-6 h-6 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50
                            ${item.quantity >= item.stockCount ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          +
                        </button>
                        {item.quantity >= item.stockCount && (
                          <div className="text-red-500 text-sm">
                            Stock reached max limit
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            {/* Summary */}
            <div className="space-y-2">
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
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
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

              <button
                onClick={() => {
                  handleCloseCart();
                  navigate('/shop');
                }}
                className="w-full text-gray-700 hover:text-keyline font-medium"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
