import { useState } from 'react';
import {
  useGetVariantsQuery,
  useCreateVariantMutation,
  useUpdateVariantMutation,
  useDeleteVariantMutation,
} from '../api/erpApi';
import toast from 'react-hot-toast';

export default function VariantsDashboard() {
  const { data, isLoading, error } = useGetVariantsQuery();
  const [createVariant] = useCreateVariantMutation();
  const [updateVariant] = useUpdateVariantMutation();
  const [deleteVariant] = useDeleteVariantMutation();
  const [form, setForm] = useState({
    slug: null,
    product: '',
    variant_name: '',
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
      product: form.product,
      variant_name: form.variant_name,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
      availability: form.availability,
    };
    try {
      if (form.slug) {
        await updateVariant({ slug: form.slug, body }).unwrap();
        toast.success('Variant updated');
      } else {
        await createVariant(body).unwrap();
        toast.success('Variant created');
      }
      setForm({
        slug: null,
        product: '',
        variant_name: '',
        price: '',
        stock: '',
        availability: false,
      });
    } catch {
      toast.error('Failed to save variant');
    }
  };

  const handleEdit = (v) => {
    setForm({
      slug: v.slug,
      product: v.product,
      variant_name: v.variant_name,
      price: v.price,
      stock: v.stock,
      availability: v.availability,
    });
  };

  const handleDelete = async (slug) => {
    try {
      await deleteVariant(slug).unwrap();
      toast.success('Variant deleted');
    } catch {
      toast.error('Failed to delete variant');
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Failed to load variants</div>;
  const variants = data?.content || [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Variants</h1>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Available</th>
              <th className="p-2 border">Product</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => (
              <tr key={v.id} className="text-center">
                <td className="p-2 border">{v.variant_name}</td>
                <td className="p-2 border">{v.price}</td>
                <td className="p-2 border">{v.stock}</td>
                <td className="p-2 border">{v.availability ? 'Yes' : 'No'}</td>
                <td className="p-2 border">
                  <a href={`/product/${v.product}`} className="text-blue-600 underline">
                    {v.product}
                  </a>
                </td>
                <td className="p-2 border space-x-2">
                  <button
                    className="text-blue-600"
                    onClick={() => handleEdit(v)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => handleDelete(v.slug)}
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
          name="product"
          value={form.product}
          onChange={handleChange}
          placeholder="Product Slug"
          className="input"
          required
        />
        <input
          type="text"
          name="variant_name"
          value={form.variant_name}
          onChange={handleChange}
          placeholder="Variant Name"
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
