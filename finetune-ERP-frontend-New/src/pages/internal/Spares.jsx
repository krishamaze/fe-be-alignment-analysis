import { useState, useEffect } from 'react';
import {
  useGetSparesQuery,
  useCreateSpareMutation,
  useUpdateSpareMutation,
  useDeleteSpareMutation,
} from '../../api/erpApi';
import { useAppSelector } from '../../redux/hook';
import { selectAuthRole } from '../../redux/slice/authSlice';
import toast from 'react-hot-toast';

export default function Spares() {
  const role = useAppSelector(selectAuthRole);
  const isAdmin = role === 'system_admin';
  const { data, isLoading, error } = useGetSparesQuery();
  const [createSpare] = useCreateSpareMutation();
  const [updateSpare] = useUpdateSpareMutation();
  const [deleteSpare] = useDeleteSpareMutation();
  const [form, setForm] = useState({ id: null, name: '', sku: '', price: '' });

  const spares = data?.content || [];

  useEffect(() => {
    document.title = 'Spares – Finetune';
    const desc = 'View and manage spare parts pricing.';
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
    setMeta('og:title', 'Spares – Finetune', true);
    setMeta('og:description', desc, true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await updateSpare({ id: form.id, ...form }).unwrap();
        toast.success('Spare updated');
      } else {
        await createSpare(form).unwrap();
        toast.success('Spare created');
      }
      setForm({ id: null, name: '', sku: '', price: '' });
    } catch {
      toast.error('Failed to save spare');
    }
  };

  const handleEdit = (s) => {
    setForm({ id: s.id, name: s.name, sku: s.sku, price: s.price });
  };

  const handleDelete = async (id) => {
    try {
      await deleteSpare(id).unwrap();
      toast.success('Spare deleted');
    } catch {
      toast.error('Failed to delete spare');
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Failed to load spares</div>;

  return (
    <div className="p-4 pt-24">
      <h1 className="text-2xl font-bold mb-4 text-center text-keyline">
        Spares
      </h1>
      {spares.length === 0 ? (
        <div className="text-center text-gray-600 mb-6">
          No spares available.
        </div>
      ) : (
        <ul className="space-y-4 max-w-xl mx-auto mb-6">
          {spares.map((s) => (
            <li key={s.id} className="p-4 border rounded-lg shadow-sm">
              <div className="font-semibold">{s.name}</div>
              <div className="text-sm text-gray-600">SKU: {s.sku}</div>
              {s.quality_name && (
                <div className="text-sm text-gray-600">
                  Quality: {s.quality_name}
                </div>
              )}
              {isAdmin && (
                <div className="text-sm text-gray-600">₹{s.price}</div>
              )}
              {isAdmin && (
                <div className="mt-2 space-x-2">
                  <button
                    className="text-blue-600"
                    onClick={() => handleEdit(s)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => handleDelete(s.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      {isAdmin && (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="input"
            required
          />
          <input
            type="text"
            name="sku"
            placeholder="SKU"
            value={form.sku}
            onChange={handleChange}
            className="input"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="input"
            required
          />
          <button
            type="submit"
            className="w-full bg-keyline text-white py-2 rounded"
          >
            {form.id ? 'Update Spare' : 'Add Spare'}
          </button>
        </form>
      )}
    </div>
  );
}
