import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import AppLoader from '../components/AppLoader';
import END_POINTS from '../utils/Endpoints';

export default function Category() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get(`${END_POINTS.API_BASE_URL}${END_POINTS.GET_CATEGORIES}/${slug}`),
          axios.get(`${END_POINTS.API_BASE_URL}${END_POINTS.GET_PRODUCTS}?category=${slug}`),
        ]);
        setCategory(catRes.data);
        setProducts(prodRes.data?.content || []);
        const title = `${catRes.data.name} – Finetune`;
        const desc = `Products under ${catRes.data.name}`;
        document.title = title;
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
        setMeta('og:title', title, true);
        setMeta('og:description', desc, true);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="p-4 pt-24 text-center">
        <AppLoader />
      </div>
    );
  }
  if (error || !category) {
    return <div className="p-4 pt-24 text-center text-red-600">Failed to load category.</div>;
  }
  return (
    <div className="p-4 pt-24">
      <h1 className="text-2xl font-bold mb-4 text-center text-keyline">{category.name}</h1>
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
