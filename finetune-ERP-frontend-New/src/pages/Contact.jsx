import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReCAPTCHA from 'react-google-recaptcha';
import END_POINTS from '../utils/Endpoints';
import AppLoader from '../components/AppLoader';

export default function Contact() {
  const [form, setForm] = useState({ name: '', mobile_no: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [cooldown, setCooldown] = useState(false);
  const recaptchaRef = useRef(null);

  useEffect(() => {
    document.title = 'Contact – Finetune';
    const desc = 'Reach out for device repair or support.';
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
    setMeta('og:title', 'Contact – Finetune', true);
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
      await axios.post(`${END_POINTS.API_BASE_URL}/marketing/contact/`, {
        ...form,
        captcha_token: captcha,
      });
      toast.success('Message sent');
      setForm({ name: '', mobile_no: '', message: '' });
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
      {loading && <AppLoader />}
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      <address className="not-italic mb-4 text-gray-700">
        Cheran Plaza K.G Chavadi Road, Ettimadai, Pirivu, near KK MAHAAL,
        Coimbatore, Tamil Nadu 641105.<br />
        Phone: <a href="tel:+919791151863" className="text-keyline">+91 97911 51863</a>
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
          name="mobile_no"
          value={form.mobile_no}
          onChange={onChange}
          placeholder="Mobile"
          maxLength={10}
          className="input"
        />
        <textarea
          name="message"
          value={form.message}
          onChange={onChange}
          placeholder="Message"
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
          Send
        </button>
      </form>
    </div>
  );
}
