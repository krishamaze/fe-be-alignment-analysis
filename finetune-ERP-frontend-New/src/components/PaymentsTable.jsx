export default function PaymentsTable({ payments = [] }) {
  return (
    <table className="w-full text-left border mt-4">
      <thead>
        <tr>
          <th className="p-2 border">Mode</th>
          <th className="p-2 border">Amount</th>
          <th className="p-2 border">Ref</th>
          <th className="p-2 border">Date</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((p) => (
          <tr key={p.id} className="border-t">
            <td className="p-2 border">{p.mode}</td>
            <td className="p-2 border">{p.amount}</td>
            <td className="p-2 border">{p.ref_no || '-'}</td>
            <td className="p-2 border">{p.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
