import { useState } from 'react';
import {
  useGetIssuesQuery,
  useCreateIssueMutation,
  useUpdateIssueMutation,
  useDeleteIssueMutation,
} from '../../api/erpApi';
import toast from 'react-hot-toast';

export default function IssuesDashboard() {
  const { data: issues = [], isLoading, error } = useGetIssuesQuery();
  const [createIssue] = useCreateIssueMutation();
  const [updateIssue] = useUpdateIssueMutation();
  const [deleteIssue] = useDeleteIssueMutation();
  const [name, setName] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createIssue({ name }).unwrap();
      setName('');
    } catch {
      toast.error('Failed to create');
    }
  };

  const edit = async (issue) => {
    const n = prompt('Issue', issue.name);
    if (!n) return;
    try {
      await updateIssue({ id: issue.id, body: { name: n } }).unwrap();
    } catch {
      toast.error('Update failed');
    }
  };

  const remove = async (id) => {
    try {
      await deleteIssue(id).unwrap();
    } catch {
      toast.error('Delete failed');
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Failed to load</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Issues</h1>
      <form onSubmit={submit} className="mb-4 flex gap-2">
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New issue"
        />
        <button className="bg-black text-white px-3 py-1 rounded">Add</button>
      </form>
      <table className="w-full text-left border">
        <tbody>
          {issues.map((i) => (
            <tr key={i.id} className="border-t">
              <td className="p-2 border">{i.name}</td>
              <td className="p-2 border text-right space-x-2">
                <button onClick={() => edit(i)} className="text-blue-600">
                  Edit
                </button>
                <button onClick={() => remove(i.id)} className="text-red-600">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
