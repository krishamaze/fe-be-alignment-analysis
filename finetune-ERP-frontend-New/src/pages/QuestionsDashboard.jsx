import { useState } from 'react';
import {
  useGetQuestionsQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} from '../api/erpApi';
import toast from 'react-hot-toast';

export default function QuestionsDashboard() {
  const { data: questions = [], isLoading, error } = useGetQuestionsQuery();
  const [createQuestion] = useCreateQuestionMutation();
  const [updateQuestion] = useUpdateQuestionMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();
  const [form, setForm] = useState({ text: '', type: 'text', set: '' });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    if (!form.text.trim()) return;
    try {
      await createQuestion({
        text: form.text,
        type: form.type,
        question_set_name: form.set,
      }).unwrap();
      setForm({ text: '', type: 'text', set: '' });
    } catch {
      toast.error('Failed to create');
    }
  };

  const edit = async (q) => {
    const text = prompt('Question', q.text);
    if (!text) return;
    try {
      await updateQuestion({ id: q.id, body: { text } }).unwrap();
    } catch {
      toast.error('Update failed');
    }
  };

  const remove = async (id) => {
    try {
      await deleteQuestion(id).unwrap();
    } catch {
      toast.error('Delete failed');
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Failed to load</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Questions</h1>
      <form onSubmit={submit} className="mb-4 flex flex-wrap gap-2">
        <input
          name="text"
          className="input"
          value={form.text}
          onChange={onChange}
          placeholder="Question"
        />
        <select name="type" className="input" value={form.type} onChange={onChange}>
          <option value="text">Text</option>
          <option value="choice">Choice</option>
        </select>
        <input
          name="set"
          className="input"
          value={form.set}
          onChange={onChange}
          placeholder="Set name"
        />
        <button className="bg-black text-white px-3 py-1 rounded">Add</button>
      </form>
      <table className="w-full text-left border">
        <tbody>
          {questions.map((q) => (
            <tr key={q.id} className="border-t">
              <td className="p-2 border">{q.text}</td>
              <td className="p-2 border text-right space-x-2">
                <button onClick={() => edit(q)} className="text-blue-600">
                  Edit
                </button>
                <button onClick={() => remove(q.id)} className="text-red-600">
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
