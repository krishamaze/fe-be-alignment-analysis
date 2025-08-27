import { useState } from 'react';
import { useCreatePaymentMutation } from '../api/erpApi';

export default function ReceiptForm({ invoiceId, onSuccess }) {
  const [form, setForm] = useState({ mode: 'cash', amount: '', ref_no: '' });
  const [createPayment] = useCreatePaymentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPayment({
      invoice: invoiceId,
      ...form,
      date: new Date().toISOString().slice(0, 10),
    }).unwrap();
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded space-y-2">
      <select
        value={form.mode}
        onChange={(e) => setForm({ ...form, mode: e.target.value })}
        className="input w-full"
      >
        <option value="cash">Cash</option>
        <option value="card">Card</option>
        <option value="upi">UPI</option>
        <option value="emi">EMI</option>
      </select>
      <input
        placeholder="Amount"
        type="number"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
        className="input w-full"
      />
      <input
        placeholder="Reference"
        value={form.ref_no}
        onChange={(e) => setForm({ ...form, ref_no: e.target.value })}
        className="input w-full"
      />
      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        type="submit"
      >
        Record Payment
      </button>
    </form>
  );
}
