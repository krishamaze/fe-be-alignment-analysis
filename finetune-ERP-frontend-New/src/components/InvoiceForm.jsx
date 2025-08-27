import { useState } from 'react';
import { useCreateInvoiceMutation } from '../api/erpApi';
import { computeGST } from '../utils/gst';

export default function InvoiceForm({ bookingId, onSuccess }) {
  const [items, setItems] = useState([
    { description: '', hsn_code: '', quantity: 1, unit_price: 0 },
  ]);
  const [rates, setRates] = useState({ cgst: 9, sgst: 9, igst: 0 });
  const [createInvoice] = useCreateInvoiceMutation();

  const subtotal = items.reduce(
    (sum, i) => sum + Number(i.quantity) * Number(i.unit_price),
    0
  );
  const totals = computeGST(subtotal, rates);

  const updateItem = (idx, field, value) => {
    const next = items.slice();
    next[idx][field] = value;
    setItems(next);
  };

  const addItem = () =>
    setItems([
      ...items,
      { description: '', hsn_code: '', quantity: 1, unit_price: 0 },
    ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createInvoice({
      booking: bookingId,
      cgst: rates.cgst,
      sgst: rates.sgst,
      igst: rates.igst,
      line_items: items,
    }).unwrap();
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded space-y-4">
      {items.map((item, idx) => (
        <div key={idx} className="grid grid-cols-5 gap-2">
          <input
            placeholder="Description"
            value={item.description}
            onChange={(e) => updateItem(idx, 'description', e.target.value)}
            className="input col-span-2"
          />
          <input
            placeholder="HSN"
            value={item.hsn_code}
            onChange={(e) => updateItem(idx, 'hsn_code', e.target.value)}
            className="input"
          />
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
            className="input"
          />
          <input
            type="number"
            value={item.unit_price}
            onChange={(e) => updateItem(idx, 'unit_price', e.target.value)}
            className="input"
          />
        </div>
      ))}
      <button type="button" onClick={addItem} className="text-sm text-blue-600">
        + Line Item
      </button>

      <div className="grid grid-cols-3 gap-2">
        {['cgst', 'sgst', 'igst'].map((key) => (
          <input
            key={key}
            type="number"
            value={rates[key]}
            onChange={(e) =>
              setRates({ ...rates, [key]: Number(e.target.value) })
            }
            className="input"
            placeholder={`${key.toUpperCase()} %`}
          />
        ))}
      </div>

      <div className="text-right">
        <div>Subtotal: {subtotal.toFixed(2)}</div>
        <div>CGST: {totals.cgst.toFixed(2)}</div>
        <div>SGST: {totals.sgst.toFixed(2)}</div>
        <div>IGST: {totals.igst.toFixed(2)}</div>
        <div className="font-bold">Total: {totals.total.toFixed(2)}</div>
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        type="submit"
      >
        Save Invoice
      </button>
    </form>
  );
}
