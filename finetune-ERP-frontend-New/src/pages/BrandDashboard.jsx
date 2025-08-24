import { useState } from 'react';
import {
  useGetBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} from '../api/erpApi';
import toast from 'react-hot-toast';

export default function BrandDashboard() {
  const { data, isLoading, error } = useGetBrandsQuery();
  const [createBrand] = useCreateBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();
  const [form, setForm] = useState({ id: null, name: '', logo: null });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({ ...f, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', form.name);
    if (form.logo) fd.append('logo', form.logo);
    try {
      if (form.id) {
        await updateBrand({ id: form.id, body: fd }).unwrap();
        toast.success('Brand updated');
      } else {
        await createBrand(fd).unwrap();
        toast.success('Brand created');
      }
      setForm({ id: null, name: '', logo: null });
    } catch {
      toast.error('Failed to save brand');
    }
  };

  const handleEdit = (b) => {
    setForm({ id: b.id, name: b.name, logo: null });
  };

  const handleDelete = async (id) => {
    try {
      await deleteBrand(id).unwrap();
      toast.success('Brand deleted');
    } catch {
      toast.error('Failed to delete brand');
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Failed to load brands</div>;
  const brands = data?.content || [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Brands</h1>
      <ul className="space-y-2 mb-6">
        {brands.map((b) => (
          <li key={b.id} className="flex items-center justify-between border p-2 rounded">
            <span>{b.name}</span>
            <div className="space-x-2">
              <button
                className="text-blue-600"
                onClick={() => handleEdit(b)}
              >
                Edit
              </button>
              <button
                className="text-red-600"
                onClick={() => handleDelete(b.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="space-y-2 max-w-sm">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border p-2 rounded"
          required
        />
        <input type="file" name="logo" onChange={handleChange} />
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded"
        >
          {form.id ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
}
