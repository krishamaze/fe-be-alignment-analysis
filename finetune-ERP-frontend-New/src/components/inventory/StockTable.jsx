import React from 'react';

export default function StockTable({ ledgers = [] }) {
  return (
    <table className="min-w-full text-sm">
      <thead>
        <tr>
          <th className="px-2">Variant</th>
          <th className="px-2">Store</th>
          <th className="px-2">Qty</th>
        </tr>
      </thead>
      <tbody>
        {ledgers.map((l) => (
          <tr key={`${l.store}-${l.product_variant}`}>
            <td className="border px-2">{l.product_variant}</td>
            <td className="border px-2">{l.store}</td>
            <td className="border px-2">{l.quantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
