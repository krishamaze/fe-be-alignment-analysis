import { useState } from 'react';
import {
  useGetUnitsQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} from '../../api/erpApi';
import toast from 'react-hot-toast';

export default function UnitsDashboard() {
  const { data, isLoading, error } = useGetUnitsQuery();
  const [createUnit] = useCreateUnitMutation();
  const [updateUnit] = useUpdateUnitMutation();
  const [deleteUnit] = useDeleteUnitMutation();
  const [form, setForm] = useState({ slug: null, name: '' });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.slug) {
        await updateUnit({
          slug: form.slug,
          body: { name: form.name },
        }).unwrap();
        toast.success('Unit updated');
      } else {
        await createUnit({ name: form.name }).unwrap();
        toast.success('Unit created');
      }
      setForm({ slug: null, name: '' });
    } catch {
      toast.error('Failed to save unit');
    }
  };

  const handleEdit = (u) => setForm({ slug: u.slug, name: u.name });

  const handleDelete = async (slug) => {
    try {
      await deleteUnit(slug).unwrap();
      toast.success('Unit deleted');
    } catch {
      toast.error('Failed to delete unit');
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Failed to load units</div>;
  const units = data?.content || [];

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Units</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Slug</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="p-2">{u.id}</td>
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.slug}</td>
                <td className="p-2 space-x-2">
                  <button
                    className="text-blue-600"
                    onClick={() => handleEdit(u)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => handleDelete(u.slug)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
        <button type="submit" className="px-4 py-2 bg-black text-white rounded">
          {form.slug ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
}
