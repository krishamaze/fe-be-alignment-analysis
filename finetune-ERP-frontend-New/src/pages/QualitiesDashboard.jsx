import { useState } from 'react';
import {
  useGetQualitiesQuery,
  useCreateQualityMutation,
  useUpdateQualityMutation,
  useDeleteQualityMutation,
} from '../api/erpApi';
import toast from 'react-hot-toast';

export default function QualitiesDashboard() {
  const { data, isLoading, error } = useGetQualitiesQuery();
  const [createQuality] = useCreateQualityMutation();
  const [updateQuality] = useUpdateQualityMutation();
  const [deleteQuality] = useDeleteQualityMutation();
  const [form, setForm] = useState({ slug: null, name: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.slug) {
        await updateQuality({ slug: form.slug, body: { name: form.name } }).unwrap();
        toast.success('Quality updated');
      } else {
        await createQuality({ name: form.name }).unwrap();
        toast.success('Quality created');
      }
      setForm({ slug: null, name: '' });
    } catch {
      toast.error('Failed to save quality');
    }
  };

  const handleEdit = (q) => setForm({ slug: q.slug, name: q.name });

  const handleDelete = async (slug) => {
    try {
      await deleteQuality(slug).unwrap();
      toast.success('Quality deleted');
    } catch {
      toast.error('Failed to delete quality');
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Failed to load qualities</div>;
  const qualities = data?.content || [];

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Qualities</h1>
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
            {qualities.map((q) => (
              <tr key={q.id} className="border-b">
                <td className="p-2">{q.id}</td>
                <td className="p-2">{q.name}</td>
                <td className="p-2">{q.slug}</td>
                <td className="p-2 space-x-2">
                  <button className="text-blue-600" onClick={() => handleEdit(q)}>
                    Edit
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => handleDelete(q.slug)}
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
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded"
        >
          {form.slug ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
}
