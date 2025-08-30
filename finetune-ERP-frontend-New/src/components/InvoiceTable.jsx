export default function InvoiceTable({ invoices = [] }) {
  return (
    <table className="w-full text-left border mt-4">
      <thead>
        <tr>
          <th className="p-2 border">Invoice No</th>
          <th className="p-2 border">Total</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((inv) => (
          <tr key={inv.id} className="border-t">
            <td className="p-2 border">{inv.invoice_no}</td>
            <td className="p-2 border">{inv.total}</td>
            <td className="p-2 border">{inv.status}</td>
            <td className="p-2 border">
              {/* TODO(v1.1): Enable invoice PDF once Railway system libraries available */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
