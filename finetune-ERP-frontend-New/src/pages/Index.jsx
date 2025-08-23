import { useEffect, useState } from 'react';
import axios from 'axios';
import END_POINTS from '../utils/Endpoints';
import Loader from '../components/common/Loader';

export default function Index() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    document.title = 'Brands – Finetune';
    const desc = 'Brands we service and support.';
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
    setMeta('og:title', 'Brands – Finetune', true);
    setMeta('og:description', desc, true);
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get(`${END_POINTS.API_BASE_URL}/marketing/brands/`);
        setBrands(res.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  if (loading) {
    return (
      <div className="p-4 pt-24 text-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 pt-24 text-center text-red-600">Failed to load brands.</div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="p-4 pt-24 text-center text-gray-600">No brands available.</div>
    );
  }

  return (
    <div className="p-4 pt-24">
      <h1 className="text-2xl font-bold mb-4 text-center text-keyline">Brands</h1>
      <ul className="list-disc pl-5 space-y-2 max-w-xl mx-auto">
        {brands.map((b) => (
          <li key={b.id}>{b.name}</li>
        ))}
      </ul>
    </div>
  );
}
