import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import ReCAPTCHA from 'react-google-recaptcha';
import END_POINTS from '../utils/Endpoints';
import Loader from '../components/common/Loader';

export default function Bookings() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    issue: '',
    date: '',
    time: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [cooldown, setCooldown] = useState(false);
  const [success, setSuccess] = useState(false);
  const recaptchaRef = useRef(null);

  useEffect(() => {
    document.title = 'Book a Service – Finetune';
    const desc = 'Schedule a service booking with Finetune.';
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
    setMeta('og:title', 'Book a Service – Finetune', true);
    setMeta('og:description', desc, true);
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const issues = ['Screen', 'Battery', 'Other']; // TODO fetch from API

  const submit = async (e) => {
    e.preventDefault();
    if (cooldown) {
      toast.error('Please wait before submitting again');
      return;
    }
    if (!captcha) {
      toast.error('Captcha verification failed');
      return;
    }
    const token = Cookies.get('token');
    if (!token) {
      toast.error('Please log in to book a service');
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        `${END_POINTS.API_BASE_URL}/bookings`,
        { ...form, captcha_token: captcha },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Booking submitted');
      setSuccess(true);
      setForm({
        name: '',
        email: '',
        issue: '',
        date: '',
        time: '',
        message: '',
      });
      recaptchaRef.current?.reset();
      setCaptcha('');
      setCooldown(true);
      setTimeout(() => setCooldown(false), 30000);
    } catch {
      toast.error('Submission failed');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 pt-24 max-w-xl mx-auto">
      {loading && <Loader />}
      <h1 className="text-2xl font-bold mb-4">Book a Service</h1>
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
          placeholder="Email (optional)"
          className="input"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={onChange}
          className="input"
          required
        />
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={onChange}
          className="input"
          required
        />
        <select
          name="issue"
          value={form.issue}
          onChange={onChange}
          className="input"
          required
        >
          <option value="">Select issue</option>
          {issues.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
        <textarea
          name="message"
          value={form.message}
          onChange={onChange}
          placeholder="Message (optional)"
          className="input"
        />
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''}
          onChange={setCaptcha}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          Submit
        </button>
        {success && (
          <p className="text-green-600">Booking submitted successfully.</p>
        )}
      </form>
    </div>
  );
}
