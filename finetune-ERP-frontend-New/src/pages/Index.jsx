import { useEffect, useState } from 'react';
import axios from 'axios';
import END_POINTS from '../utils/Endpoints';

export default function Index() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    axios
      .get(`${END_POINTS.API_BASE_URL}/marketing/brands/`)
      .then((res) => setBrands(res.data))
      .catch(() => setBrands([]));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Brands</h1>
      <ul className="list-disc pl-5">
        {brands.map((b) => (
          <li key={b.id}>{b.name}</li>
        ))}
      </ul>
    </div>
  );
}
