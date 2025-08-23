import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Loader from '../components/common/Loader';
import { useGetSparesQuery } from '../redux/api/publicApi';

export default function Spares() {
  const {
    data: spares = [],
    isLoading: loading,
    isError: error,
  } = useGetSparesQuery();

  useEffect(() => {
    document.title = 'Spares – Finetune';
    const desc = 'View available spare parts.';
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

  if (spares.length === 0) {
    return (
      <div className="p-4 pt-24 text-center text-gray-600">
        No spares available.
      </div>
    );
  }

  return (
    <div className="p-4 pt-24">
      <Helmet>
        <title>Spares – Finetune</title>
        <meta name="description" content="View available spare parts." />
        <meta property="og:title" content="Spares – Finetune" />
        <meta property="og:description" content="View available spare parts." />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-center text-keyline">
        Spares
      </h1>
      <ul className="space-y-4 max-w-xl mx-auto">
        {spares.map((s) => (
          <li key={s.id} className="p-4 border rounded-lg shadow-sm">
            <div className="font-semibold">{s.name}</div>
            <div className="text-sm text-gray-600">{s.type}</div>
            <div className="text-sm text-gray-600">
              {s.is_available ? 'Available' : 'Unavailable'}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
