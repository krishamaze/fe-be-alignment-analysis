import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useGetProductsQuery,
  useGetBrandsQuery,
  useGetDepartmentsQuery,
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
} from '../../api/erpApi';
import PageWrapper from '@/components/layout/PageWrapper';

function Shop() {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [department, setDepartment] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [ordering, setOrdering] = useState('-date_created');

  const { data: brandData } = useGetBrandsQuery();
  const brandOptions = brandData?.content ?? brandData ?? [];

  const { data: deptData } = useGetDepartmentsQuery();
  const deptOptions = deptData?.content ?? [];

  const { data: catData } = useGetCategoriesQuery(
    department ? { department } : undefined
  );
  const catOptions = catData?.content ?? [];

  const { data: subData } = useGetSubCategoriesQuery(
    category ? { category } : undefined
  );
  const subOptions = subData?.content ?? [];

  const params = {
    ...(selectedBrands.length && { brand: selectedBrands.join(',') }),
    ...(onlyAvailable && { availability: true }),
    ...(department && { department }),
    ...(category && { category }),
    ...(subcategory && { subcategory }),
    ...(minPrice > 0 && { min_price: minPrice }),
    ...(maxPrice > 0 && { max_price: maxPrice }),
    ...(ordering && { ordering }),
  };

  const { data, isLoading } = useGetProductsQuery(params);
  const products = data?.content ?? [];

  const toggleBrand = (id) => {
    setSelectedBrands((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  // clamp price sliders
  const handleMinPrice = (val) => {
    setMinPrice(Math.min(val, maxPrice));
  };
  const handleMaxPrice = (val) => {
    setMaxPrice(Math.max(val, minPrice));
  };

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <PageWrapper mode="scroll">
      <div className="space-y-6">
        {/* Filters */}
        <div className="p-4 space-y-6">
          {/* Sort */}
          <section className="space-y-3">
            <h3 className="font-medium text-sm">Sort</h3>
            <select
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="-date_created">Newest</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
            </select>
          </section>

          {/* Categories */}
          <section className="space-y-3">
            <h3 className="font-medium text-sm">Categories</h3>
            <div className="space-y-2">
              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setCategory('');
                  setSubcategory('');
                }}
                className="border p-2 rounded w-full"
              >
                <option value="">All Departments</option>
                {deptOptions.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name}
                  </option>
                ))}
              </select>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubcategory('');
                }}
                className="border p-2 rounded w-full"
              >
                <option value="">All Categories</option>
                {catOptions.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">All SubCategories</option>
                {subOptions.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* Brands */}
          <section className="space-y-3">
            <h3 className="font-medium text-sm">Brands</h3>
            <div className="flex flex-wrap gap-2">
              {brandOptions.map((b) => (
                <label key={b.id} className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b.id)}
                    onChange={() => toggleBrand(b.id)}
                  />
                  {b.name}
                </label>
              ))}
            </div>
          </section>

          {/* Price & Availability */}
          <section className="space-y-3">
            <h3 className="font-medium text-sm">Price & Availability</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100000"
                  value={minPrice}
                  onChange={(e) => handleMinPrice(Number(e.target.value))}
                />
                <input
                  type="range"
                  min="0"
                  max="100000"
                  value={maxPrice}
                  onChange={(e) => handleMaxPrice(Number(e.target.value))}
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                />
                Available
              </label>
            </div>
          </section>
        </div>

        {/* Products */}
        <div className="p-4">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <li key={p.id} className="border rounded p-4">
                <Link to={`/product/${p.slug}`} className="font-semibold">
                  {p.name}
                </Link>
                <p className="text-sm text-gray-500">{p.brand_name}</p>
                <p className="mt-2">₹{p.price}</p>
                {!p.availability && (
                  <p className="text-red-500 text-sm">Out of stock</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Shop;
