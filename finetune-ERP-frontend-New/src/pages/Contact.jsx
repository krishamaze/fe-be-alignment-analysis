import { useState } from 'react';
import axios from 'axios';
import END_POINTS from '../utils/Endpoints';

export default function Contact() {
  const [form, setForm] = useState({ name: '', mobile_no: '', message: '' });
  const [sent, setSent] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    await axios.post(`${END_POINTS.API_BASE_URL}/marketing/contact/`, form);
    setSent(true);
  };

  if (sent) return <div className="p-4">Thanks for contacting us.</div>;

  return (
    <form onSubmit={submit} className="p-4 space-y-3">
      <input
        name="name"
        value={form.name}
        onChange={onChange}
        placeholder="Name"
        className="border p-2 w-full"
      />
      <input
        name="mobile_no"
        value={form.mobile_no}
        onChange={onChange}
        placeholder="Mobile"
        className="border p-2 w-full"
      />
      <textarea
        name="message"
        value={form.message}
        onChange={onChange}
        placeholder="Message"
        className="border p-2 w-full"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">
        Send
      </button>
    </form>
  );
}
