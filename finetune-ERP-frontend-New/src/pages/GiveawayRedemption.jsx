import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRScanSection from '../components/qr/QRScanSection';

const BACKEND_URL =
  'https://script.google.com/macros/s/AKfycbxcANXk6gBddr0yIV_owEaxueJvxtvJX_Jkq8flGGVOL9hNCljPNyI-GdJ2A-jSZtcA/exec';
const API_KEY = 'ft2025122344)';

function GiveawayRedemption() {
  const [form, setForm] = useState({
    instagram_id: '',
    enrollment_no: '',
    customer_name: '',
    mobile: '',
    product: '',
    original_price: '',
    received: false,
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refNo, setRefNo] = useState('');
  const [status, setStatus] = useState('init');
  const [error, setError] = useState('');
  const [remountKey, setRemountKey] = useState(0); // For QR scanner reset
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.received) return;

    // Validate mobile number format
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(form.mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');

    const payload = {
      api_key: API_KEY,
      action: 'redeem',
      ...form,
      discount: 100,
      final_price: Math.max(0, parseInt(form.original_price) - 100),
    };

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      if (!data.ref_no) throw new Error('No reference number received');

      setRefNo(data.ref_no);
    } catch (error) {
      setError(error.message || 'Something went wrong. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = async ({ instagram_id, enrollment_no }) => {
    setStatus('fetching');
    setError('');

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        body: JSON.stringify({
          api_key: API_KEY,
          action: 'lookup',
          instagram_id,
        }),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const backendEnroll = data.enrollment_no;
      const alreadyRedeemed = data.redeemed;

      if (backendEnroll !== enrollment_no) {
        setStatus('invalid');
      } else if (alreadyRedeemed) {
        setStatus('redeemed');
      } else {
        setForm((prev) => ({ ...prev, instagram_id, enrollment_no }));
        setStatus('init');
        setStep(2);
      }
    } catch (error) {
      console.error('Lookup error:', error);
      setStatus('invalid');
      setError(error.message || 'Failed to verify QR code');
    }
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error on input
  };

  const closePopup = () => navigate('/dashboard');

  const resetToStep1 = () => {
    setStep(1);
    setStatus('init');
    setError('');
    setForm({
      instagram_id: '',
      enrollment_no: '',
      customer_name: '',
      mobile: '',
      product: '',
      original_price: '',
      received: false,
    });
    setRemountKey((prev) => prev + 1); // Force QR scanner remount
  };

  const calculateFinalPrice = () => {
    const price = parseInt(form.original_price) || 0;
    return Math.max(0, price - 100);
  };

  return (
    <div className="max-w-xl mx-auto mt-20 md:mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">
        🎁 Giveaway Redemption
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {refNo ? (
        // Success Screen
        <div className="bg-green-100 p-4 rounded text-center text-green-800 font-semibold space-y-2">
          <p>✅ Redemption Successful!</p>
          <p>
            Ref No: <span className="font-mono">{refNo}</span>
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={closePopup}
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Return to Dashboard
            </button>
            <button
              onClick={resetToStep1}
              className="mt-3 px-4 py-2 bg-black text-white rounded hover:bg-gray-900"
            >
              Process Another
            </button>
          </div>
        </div>
      ) : step === 1 ? (
        // QR Scan Step (with remount key)
        <QRScanSection
          key={remountKey}
          onScanComplete={handleLookup}
          status={status}
          setStatus={setStatus}
        />
      ) : (
        // Form Step
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Instagram ID
              </label>
              <input
                value={form.instagram_id}
                disabled
                className="w-full border px-3 py-2 bg-gray-100 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Enrollment No
              </label>
              <input
                value={form.enrollment_no}
                disabled
                className="w-full border px-3 py-2 bg-gray-100 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Customer Name *
            </label>
            <input
              type="text"
              value={form.customer_name}
              onChange={(e) =>
                handleInputChange('customer_name', e.target.value)
              }
              required
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-keyline"
              placeholder="Enter customer name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Mobile Number *
            </label>
            <input
              type="tel"
              value={form.mobile}
              onChange={(e) => handleInputChange('mobile', e.target.value)}
              required
              pattern="[0-9]{10}"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-keyline"
              placeholder="Enter 10-digit mobile number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Item Purchased *
            </label>
            <input
              type="text"
              value={form.product}
              onChange={(e) => handleInputChange('product', e.target.value)}
              required
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-keyline"
              placeholder="Enter item name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Original Price (₹) *
            </label>
            <input
              type="number"
              value={form.original_price}
              onChange={(e) =>
                handleInputChange('original_price', e.target.value)
              }
              required
              min="100"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-keyline"
              placeholder="Enter original price"
            />
          </div>

          <div className="bg-gray-50 p-3 rounded text-sm">
            ₹100 discount auto-applied. Final Price:{' '}
            <b>₹{calculateFinalPrice()}</b>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="received-checkbox"
              checked={form.received}
              onChange={(e) => handleInputChange('received', e.target.checked)}
              className="rounded"
            />
            <label
              htmlFor="received-checkbox"
              className="text-sm cursor-pointer"
            >
              Amount received from customer
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={resetToStep1}
              className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
            >
              ← Back to QR Scan
            </button>
            <button
              type="submit"
              disabled={loading || !form.received}
              className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit & Redeem'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default GiveawayRedemption;
