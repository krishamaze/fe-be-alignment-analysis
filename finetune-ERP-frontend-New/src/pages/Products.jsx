import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AppLoader from '../components/AppLoader';
import END_POINTS from '../utils/Endpoints';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filters, setFilters] = useState({ brand: '', category: '', department: '', min_price: '', max_price: '' });

  useEffect(() => {
    document.title = 'Products – Finetune';
    const desc = 'Browse available products.';
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
    setMeta('og:title', 'Products – Finetune', true);
    setMeta('og:description', desc, true);
  }, []);

  const fetchProducts = async (query = '') => {
    try {
      const res = await axios.get(`${END_POINTS.API_BASE_URL}${END_POINTS.GET_PRODUCTS}${query}`);
      setProducts(res.data?.content || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.append(k, v);
    });
    const q = params.toString();
    await fetchProducts(q ? `?${q}` : '');
  };

  if (loading) {
    return (
      <div className="p-4 pt-24 text-center">
        <AppLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 pt-24 text-center text-red-600">Failed to load products.</div>
    );
  }

  return (
    <div className="p-4 pt-24">
      <h1 className="text-2xl font-bold mb-4 text-center text-keyline">Products</h1>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-4 grid grid-cols-2 gap-2">
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={filters.brand}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={filters.category}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={filters.department}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="min_price"
          placeholder="Min Price"
          value={filters.min_price}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="max_price"
          placeholder="Max Price"
          value={filters.max_price}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <button type="submit" className="col-span-2 bg-keyline text-white py-2 rounded">
          Apply Filters
        </button>
      </form>
      {products.length === 0 ? (
        <div className="text-center text-gray-600">No products found.</div>
      ) : (
        <ul className="space-y-4 max-w-xl mx-auto">
          {products.map((p) => (
            <li key={p.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <Link to={`/products/${p.id}`} className="font-semibold text-lg">
                {p.name}
              </Link>
              <p className="text-sm text-gray-600">{p.brand} – ₹{p.price}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
