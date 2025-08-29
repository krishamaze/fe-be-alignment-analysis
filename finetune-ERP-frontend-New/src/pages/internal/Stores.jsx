import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../components/common/Loader';
import END_POINTS from '../../utils/Endpoints';

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    document.title = 'Stores – Finetune';
    const desc = 'Browse Finetune service branches.';
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
    setMeta('og:title', 'Stores – Finetune', true);
    setMeta('og:description', desc, true);
  }, []);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axios.get(
          `${END_POINTS.API_BASE_URL}${END_POINTS.GET_STORES}?store_type=BRANCH`
        );
        setStores(res.data?.content || []);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
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
      <div className="p-4 pt-24 text-center text-red-600">
        Failed to load stores.
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="p-4 pt-24 text-center text-gray-600">
        No stores available.
      </div>
    );
  }

  return (
    <div className="p-4 pt-24">
      <h1 className="text-2xl font-bold mb-4 text-center text-keyline">
        Stores
      </h1>
      <ul className="space-y-4 max-w-xl mx-auto">
        {stores.map((s) => (
          <li
            key={s.id}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <Link to={`/stores/${s.id}`} className="font-semibold text-lg">
              {s.store_name}
            </Link>
            <p className="text-sm text-gray-600">
              {s.address}
              {s.phone && (
                <>
                  <br />
                  {s.phone}
                </>
              )}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
