import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../../api/erpApi';

function Shop() {
  const [brand, setBrand] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const { data, isLoading } = useGetProductsQuery({
    ...(brand && { brand }),
    ...(onlyAvailable && { availability: true }),
  });
  const products = data?.content ?? [];
  const brands = [...new Set(products.map((p) => p.brand))];

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-4">
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
          />
          Only available
        </label>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <li key={p.id} className="border rounded p-4">
            <Link to={`/product/${p.slug}`} className="font-semibold">
              {p.name}
            </Link>
            <p className="text-sm text-gray-500">{p.brand}</p>
            <p className="mt-2">₹{p.price}</p>
            {!p.availability && (
              <p className="text-red-500 text-sm">Out of stock</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Shop;
