import { useState } from 'react';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '../../api/erpApi';
import toast from 'react-hot-toast';

export default function ProductsDashboard() {
  const { data, isLoading, error } = useGetProductsQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [form, setForm] = useState({
    slug: null,
    name: '',
    brand: '',
    category: '',
    price: '',
    stock: '',
    availability: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      name: form.name,
      brand: form.brand,
      category: form.category,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
      availability: form.availability,
    };
    try {
      if (form.slug) {
        await updateProduct({ slug: form.slug, body }).unwrap();
        toast.success('Product updated');
      } else {
        await createProduct(body).unwrap();
        toast.success('Product created');
      }
      setForm({
        slug: null,
        name: '',
        brand: '',
        category: '',
        price: '',
        stock: '',
        availability: false,
      });
    } catch {
      toast.error('Failed to save product');
    }
  };

  const handleEdit = (p) => {
    setForm({
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.price,
      stock: p.stock,
      availability: p.availability,
    });
  };

  const handleDelete = async (slug) => {
    try {
      await deleteProduct(slug).unwrap();
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Failed to load products</div>;
  const products = data?.content || [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Brand</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Available</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="text-center">
                <td className="p-2 border">{p.name}</td>
                <td className="p-2 border">{p.brand_name}</td>
                <td className="p-2 border">{p.price}</td>
                <td className="p-2 border">{p.stock}</td>
                <td className="p-2 border">{p.availability ? 'Yes' : 'No'}</td>
                <td className="p-2 border space-x-2">
                  <button
                    className="text-blue-600"
                    onClick={() => handleEdit(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => handleDelete(p.slug)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2 max-w-md">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="input"
          required
        />
        <input
          type="number"
          name="brand"
          value={form.brand}
          onChange={handleChange}
          placeholder="Brand ID"
          className="input"
          required
        />
        <input
          type="number"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category ID"
          className="input"
          required
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="input"
          required
        />
        <input
          type="number"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="input"
          required
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="availability"
            checked={form.availability}
            onChange={handleChange}
          />
          Available
        </label>
        <button type="submit" className="px-4 py-2 bg-black text-white rounded">
          {form.slug ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
}
