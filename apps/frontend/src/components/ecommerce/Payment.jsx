import { useState } from 'react';
import {
  HiOutlineCreditCard,
  HiOutlinePhone,
  HiOutlineQrcode,
  HiOutlineCheckCircle,
} from 'react-icons/hi';

function Payment({ amount, orderId, onSuccess, onFailure }) {
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');

  // Mock PhonePe API configuration placeholder (unused)

  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // Simulate PhonePe API call
      const response = await simulatePhonePePayment();

      if (response.success) {
        setPaymentStatus('success');
        setTimeout(() => {
          onSuccess(response.transactionId);
        }, 2000);
      } else {
        setPaymentStatus('failed');
        setTimeout(() => {
          onFailure(response.error);
        }, 2000);
      }
    } catch {
      setPaymentStatus('failed');
      onFailure('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const simulatePhonePePayment = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate 90% success rate
        const isSuccess = Math.random() > 0.1;
        resolve({
          success: isSuccess,
          transactionId: isSuccess ? 'TXN' + Date.now() : null,
          error: isSuccess ? null : 'Payment declined by bank',
        });
      }, 3000);
    });
  };

  const validateForm = () => {
    if (paymentMethod === 'upi' && !upiId) {
      alert('Please enter UPI ID');
      return false;
    }
    if (paymentMethod === 'phone' && !phoneNumber) {
      alert('Please enter phone number');
      return false;
    }
    return true;
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderPaymentStatus = () => {
    switch (paymentStatus) {
      case 'processing':
        return (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-keyline mx-auto mb-4"></div>
            <p className="text-gray-600">Processing payment...</p>
            <p className="text-sm text-gray-500 mt-2">
              Please don't close this window
            </p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center py-8">
            <HiOutlineCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              Payment Successful!
            </h3>
            <p className="text-gray-600">Your order has been confirmed</p>
          </div>
        );
      case 'failed':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">✕</span>
            </div>
            <h3 className="text-xl font-semibold text-red-600 mb-2">
              Payment Failed
            </h3>
            <p className="text-gray-600">
              Please try again with a different method
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  if (paymentStatus !== 'pending') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        {renderPaymentStatus()}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <HiOutlineCreditCard className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">PhonePe Payment</h2>
        </div>
        <p className="text-gray-600">Complete your payment securely</p>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Order ID:</span>
          <span className="font-mono text-sm">{orderId}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-600">Amount:</span>
          <span className="text-xl font-bold text-gray-900">
            {formatAmount(amount)}
          </span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Choose Payment Method
        </h3>

        <div className="space-y-3">
          <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="upi"
              checked={paymentMethod === 'upi'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3"
            />
            <div className="flex items-center gap-3">
              <HiOutlineQrcode className="w-6 h-6 text-keyline" />
              <div>
                <div className="font-medium">UPI Payment</div>
                <div className="text-sm text-gray-500">
                  Pay using any UPI app
                </div>
              </div>
            </div>
          </label>

          <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="phone"
              checked={paymentMethod === 'phone'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3"
            />
            <div className="flex items-center gap-3">
              <HiOutlinePhone className="w-6 h-6 text-keyline" />
              <div>
                <div className="font-medium">Phone Number</div>
                <div className="text-sm text-gray-500">
                  Pay using phone number
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Payment Details */}
      <div className="mb-6">
        {paymentMethod === 'upi' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UPI ID
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="example@upi"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-keyline focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter your UPI ID (e.g., name@bank, phone@upi)
            </p>
          </div>
        )}

        {paymentMethod === 'phone' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter 10-digit mobile number"
              maxLength="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-keyline focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? 'Processing...' : `Pay ${formatAmount(amount)}`}
      </button>

      {/* Security Notice */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          🔒 Your payment is secured by PhonePe's advanced encryption
        </p>
      </div>

      {/* Payment Methods Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Supported UPI Apps:
        </h4>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>PhonePe</span>
          <span>•</span>
          <span>Google Pay</span>
          <span>•</span>
          <span>Paytm</span>
          <span>•</span>
          <span>BHIM</span>
        </div>
      </div>
    </div>
  );
}

export default Payment;
