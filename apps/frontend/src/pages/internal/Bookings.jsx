import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import Loader from '@/components/common/Loader';
import ReCaptchaWrapper from '@/components/common/ReCaptchaWrapper';
import MyBookings from '@/components/MyBookings';
import MultiSelectIssues from '@/components/repairs/MultiSelectIssues';
import Questionnaire from '@/components/repairs/Questionnaire';
import {
  useCreateBookingMutation,
  useGetBookingsQuery,
  useGetIssuesQuery,
  useGetQuestionsQuery,
} from '../../api/erpApi';

export default function Bookings() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    message: '',
  });
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [otherIssues, setOtherIssues] = useState('');
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [cooldown, setCooldown] = useState(false);
  const [result, setResult] = useState(null);
  const recaptchaRef = useRef(null);
  const [createBooking] = useCreateBookingMutation();
  const { data: bookingsData, refetch } = useGetBookingsQuery(undefined, {
    skip: !result,
  });
  const { data: issuesData } = useGetIssuesQuery();
  const { data: questionsData } = useGetQuestionsQuery({
    question_set_name: 'INTAKE_DEFAULT',
  });

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
      const resp = await createBooking({
        booking: { name: form.name, email: form.email },
        details: {
          date: form.date,
          time: form.time,
          message: form.message,
        },
        issues: selectedIssues,
        other_issues: otherIssues
          .split(',')
          .map((o) => o.trim())
          .filter(Boolean),
        responses: Object.entries(responses).map(([question, answer]) => ({
          question,
          answer,
        })),
        captcha_token: captcha,
      }).unwrap();
      toast.success('Booking submitted');
      setResult(resp);
      setForm({ name: '', email: '', date: '', time: '', message: '' });
      setSelectedIssues([]);
      setOtherIssues('');
      setResponses({});
      recaptchaRef.current?.reset();
      setCaptcha('');
      setCooldown(true);
      setTimeout(() => setCooldown(false), 30000);
    } catch {
      toast.error('Submission failed');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="p-4 pt-24 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Booking Submitted</h1>
        <p>
          Your booking ID is {result.id}. Current status: {result.status}.
        </p>
        <MyBookings bookings={bookingsData?.content || []} refetch={refetch} />
      </div>
    );
  }

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
        <MultiSelectIssues
          issues={issuesData || []}
          value={selectedIssues}
          onChange={setSelectedIssues}
        />
        <input
          name="otherIssues"
          value={otherIssues}
          onChange={(e) => setOtherIssues(e.target.value)}
          placeholder="Other issues (comma separated)"
          className="input"
        />
        <Questionnaire
          questions={questionsData || []}
          responses={responses}
          onChange={setResponses}
        />
        <textarea
          name="message"
          value={form.message}
          onChange={onChange}
          placeholder="Message (optional)"
          className="input"
        />
        <ReCaptchaWrapper ref={recaptchaRef} onChange={setCaptcha} />
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
