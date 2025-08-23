import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AppLoader from '../components/AppLoader';
import END_POINTS from '../utils/Endpoints';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${END_POINTS.API_BASE_URL}${END_POINTS.GET_PRODUCTS}/${id}`);
        setProduct(res.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const title = product?.name ? `${product.name} – Finetune` : 'Product – Finetune';
    document.title = title;
    const desc = product?.name ? `Details for ${product.name}.` : 'Product details.';
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
  }, [product]);

  if (loading) {
    return (
      <div className="p-4 pt-24 text-center">
        <AppLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 pt-24 text-center text-red-600">Failed to load product.</div>
    );
  }

  if (!product) {
    return (
      <div className="p-4 pt-24 text-center text-gray-600">Product not found.</div>
    );
  }

  return (
    <div className="p-4 pt-24 max-w-xl mx-auto space-y-2">
      <h1 className="text-2xl font-bold text-keyline">{product.name}</h1>
      <p><span className="font-semibold">Brand:</span> {product.brand}</p>
      <p><span className="font-semibold">Category:</span> {product.category}</p>
      <p><span className="font-semibold">Price:</span> ₹{product.price}</p>
      {product.variants && product.variants.length > 0 && (
        <div>
          <h2 className="font-semibold mt-4">Variants</h2>
          <ul className="list-disc pl-5">
            {product.variants.map((v) => (
              <li key={v.id}>{v.name} – ₹{v.price}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
