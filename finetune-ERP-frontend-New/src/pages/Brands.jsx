import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Loader from '../components/common/Loader';
import { useGetBrandsQuery } from '../redux/api/publicApi';

export default function Brands() {
  const {
    data: brands = [],
    isLoading: loading,
    isError: error,
  } = useGetBrandsQuery();

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
        Failed to load brands.
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="p-4 pt-24 text-center text-gray-600">
        No brands available.
      </div>
    );
  }

  return (
    <div className="p-4 pt-24">
      <Helmet>
        <title>Brands – Finetune</title>
        <meta name="description" content="Brands we service and support." />
        <meta property="og:title" content="Brands – Finetune" />
        <meta
          property="og:description"
          content="Brands we service and support."
        />
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-center text-keyline">
        Brands
      </h1>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
        {brands.map((b) => (
          <li key={b.id} className="text-center">
            {b.logo && (
              <img
                src={b.logo}
                alt={b.name}
                className="h-16 mx-auto object-contain"
              />
            )}
            <div className="mt-2 text-sm font-medium">{b.name}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
