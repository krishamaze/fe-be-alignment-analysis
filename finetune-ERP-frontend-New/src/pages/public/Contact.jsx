import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const desc = 'Reach out for device repair or support.';
    document.title = 'Contact – Finetune';
    let tag = document.head.querySelector("meta[name='description']");
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', desc);
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      toast.success('Message sent');
      setForm({ name: '', email: '', message: '' });
    } catch {
      toast.error('Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <title>Contact – Finetune</title>
      <meta
        name="description"
        content="Reach out for device repair or support."
      />
      <meta property="og:title" content="Contact – Finetune" />
      <meta
        property="og:description"
        content="Reach out for device repair or support."
      />
      <div className="p-4 pt-24 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
        <address className="not-italic mb-4 text-gray-700">
          Cheran Plaza K.G Chavadi Road, Ettimadai, Pirivu, near KK MAHAAL,
          Coimbatore, Tamil Nadu 641105.
          <br />
          Phone:{' '}
          <a href="tel:+919791151863" className="text-keyline">
            +91 97911 51863
          </a>
        </address>
        <form onSubmit={submit} className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Name"
            className="input"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="Email"
            className="input"
            required
          />
          <textarea
            name="message"
            value={form.message}
            onChange={onChange}
            placeholder="Message"
            className="input"
            required
          />
          <div className="input h-24 flex items-center justify-center text-gray-500">
            Captcha placeholder
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </>
  );
}
