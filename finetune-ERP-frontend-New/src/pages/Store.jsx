import { useState } from 'react';
import {
  useGetStoresQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
} from '../api/erpApi';
import toast from 'react-hot-toast';

export default function Store() {
  const { data, isLoading, error } = useGetStoresQuery();
  const [createStore] = useCreateStoreMutation();
  const [updateStore] = useUpdateStoreMutation();
  const [deleteStore] = useDeleteStoreMutation();
  const [form, setForm] = useState({
    id: null,
    store_name: '',
    address: '',
    code: '',
  });

  const stores = data?.content || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await updateStore({ id: form.id, ...form }).unwrap();
        toast.success('Store updated');
      } else {
        await createStore(form).unwrap();
        toast.success('Store created');
      }
      setForm({ id: null, store_name: '', address: '', code: '' });
    } catch {
      toast.error('Failed to save store');
    }
  };

  const handleEdit = (s) => {
    setForm({
      id: s.id,
      store_name: s.store_name,
      address: s.address || '',
      code: s.code,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteStore(id).unwrap();
      toast.success('Store deleted');
    } catch {
      toast.error('Failed to delete store');
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Failed to load stores</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Stores</h1>
      <ul className="space-y-2 mb-6">
        {stores.map((s) => (
          <li
            key={s.id}
            className="flex items-center justify-between border p-2 rounded"
          >
            <span>{s.store_name}</span>
            <div className="space-x-2">
              <button className="text-blue-600" onClick={() => handleEdit(s)}>
                Edit
              </button>
              <button
                className="text-red-600"
                onClick={() => handleDelete(s.id)}
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
          name="store_name"
          value={form.store_name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="code"
          value={form.code}
          onChange={handleChange}
          placeholder="Code"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="px-4 py-2 bg-black text-white rounded">
          {form.id ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
}
