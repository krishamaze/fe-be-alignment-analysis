import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/common/Loader';
import END_POINTS from '../utils/Endpoints';

export default function StoreDetails() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await axios.get(
          `${END_POINTS.API_BASE_URL}${END_POINTS.GET_STORES}/${id}`
        );
        setStore(res.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [id]);

  useEffect(() => {
    const name = store?.store_name
      ? `${store.store_name} – Finetune`
      : 'Store – Finetune';
    document.title = name;
    const desc = store?.store_name
      ? `Details for ${store.store_name}.`
      : 'Store details.';
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
    setMeta('og:title', name, true);
    setMeta('og:description', desc, true);
  }, [store]);

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
        Failed to load store.
      </div>
    );
  }

  if (!store) {
    return (
      <div className="p-4 pt-24 text-center text-gray-600">
        Store not found.
      </div>
    );
  }

  return (
    <div className="p-4 pt-24 max-w-xl mx-auto space-y-2">
      <h1 className="text-2xl font-bold text-keyline">{store.store_name}</h1>
      <p>
        <span className="font-semibold">Code:</span> {store.code}
      </p>
      <p>
        <span className="font-semibold">Address:</span> {store.address}
      </p>
    </div>
  );
}
