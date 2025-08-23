import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';
import END_POINTS from '../utils/Endpoints';

export default function Spares() {
  const [spares, setSpares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [form, setForm] = useState({ name: '', sku: '', price: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = 'Spares – Finetune';
    const desc = 'View and manage spare parts pricing.';
    const setMeta = (key, val, property = false) => {
      const attr = property ? 'property' : 'name';
      let tag = document.head.querySelector(`meta[${attr}='${key}']`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', val);
    };
    setMeta('description', desc);
    setMeta('og:title', 'Spares – Finetune', true);
    setMeta('og:description', desc, true);
  }, []);

  const fetchSpares = async () => {
    try {
      const res = await axios.get(
        `${END_POINTS.API_BASE_URL}${END_POINTS.GET_SPARES}`
      );
      setSpares(res.data?.content || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpares();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post(
        `${END_POINTS.API_BASE_URL}${END_POINTS.MODIFY_SPARE}`,
        form
      );
      toast.success('Spare saved');
      setForm({ name: '', sku: '', price: '' });
      fetchSpares();
    } catch {
      toast.error('Failed to save spare');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 pt-24 text-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 pt-24 text-center text-red-600">
        Failed to load spares.
      </div>
    );
  }

  return (
    <div className="p-4 pt-24">
      <h1 className="text-2xl font-bold mb-4 text-center text-keyline">
        Spares
      </h1>
      {spares.length === 0 ? (
        <div className="text-center text-gray-600 mb-6">
          No spares available.
        </div>
      ) : (
        <ul className="space-y-4 max-w-xl mx-auto mb-6">
          {spares.map((s) => (
            <li key={s.id} className="p-4 border rounded-lg shadow-sm">
              <div className="font-semibold">{s.name}</div>
              <div className="text-sm text-gray-600">SKU: {s.sku}</div>
              <div className="text-sm text-gray-600">₹{s.price}</div>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="text"
          name="sku"
          placeholder="SKU"
          value={form.sku}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="input"
          required
        />
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-keyline text-white py-2 rounded disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Add Spare'}
        </button>
      </form>
    </div>
  );
}
