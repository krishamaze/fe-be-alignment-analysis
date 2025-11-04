import React from 'react';

export default function SerialTable({ serials = [] }) {
  return (
    <table className="min-w-full text-sm">
      <thead>
        <tr>
          <th className="px-2">Serial</th>
          <th className="px-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {serials.map((s) => (
          <tr key={s.id}>
            <td className="border px-2">{s.serial_no}</td>
            <td className="border px-2">{s.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
