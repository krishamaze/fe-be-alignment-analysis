import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ReCAPTCHA from 'react-google-recaptcha';
import END_POINTS from '../utils/Endpoints';
import Loader from '../components/common/Loader';

export default function ScheduleCall() {
  const [form, setForm] = useState({ name: '', date: '', time: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [cooldown, setCooldown] = useState(false);
  const recaptchaRef = useRef(null);

  useEffect(() => {
    document.title = 'Schedule a Call – Finetune';
    const desc = 'Request a callback from our support team.';
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
    setMeta('og:title', 'Schedule a Call – Finetune', true);
    setMeta('og:description', desc, true);
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
    try {
      setLoading(true);
      await axios.post(`${END_POINTS.API_BASE_URL}/marketing/schedule-call/`, {
        ...form,
        captcha_token: captcha,
      });
      toast.success('We will reach out soon');
      setForm({ name: '', date: '', time: '', message: '' });
      recaptchaRef.current?.reset();
      setCaptcha('');
      setCooldown(true);
      setTimeout(() => setCooldown(false), 30000);
    } catch {
      toast.error('Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 pt-24 max-w-xl mx-auto">
      {loading && <Loader />}
      <h1 className="text-2xl font-bold mb-4">Schedule a Call</h1>
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
      </form>
    </div>
  );
}
