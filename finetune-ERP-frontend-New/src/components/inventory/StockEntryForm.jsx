import React, { useState } from 'react';
import { useCreateStockEntryMutation } from '../../api/erpApi';

export default function StockEntryForm({
  defaultType = 'purchase',
  bookingId,
}) {
  const [form, setForm] = useState({
    entry_type: defaultType,
    store: '',
    product_variant: '',
    quantity: 0,
    unit_price: 0,
    booking: bookingId || '',
  });
  const [createEntry] = useCreateStockEntryMutation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createEntry(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        name="store"
        value={form.store}
        onChange={handleChange}
        placeholder="Store ID"
        className="border p-1 w-full"
      />
      <input
        name="product_variant"
        value={form.product_variant}
        onChange={handleChange}
        placeholder="Variant ID"
        className="border p-1 w-full"
      />
      <input
        type="number"
        name="quantity"
        value={form.quantity}
        onChange={handleChange}
        className="border p-1 w-full"
      />
      <input
        type="number"
        name="unit_price"
        value={form.unit_price}
        onChange={handleChange}
        className="border p-1 w-full"
      />
      {form.entry_type === 'sale' && !bookingId && (
        <input
          name="booking"
          value={form.booking}
          onChange={handleChange}
          placeholder="Booking ID"
          className="border p-1 w-full"
        />
      )}
      <button type="submit" className="px-2 py-1 bg-blue-500 text-white">
        Save
      </button>
    </form>
  );
}
