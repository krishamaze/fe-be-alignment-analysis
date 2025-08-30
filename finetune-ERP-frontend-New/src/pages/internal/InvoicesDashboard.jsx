import { useGetInvoicesQuery } from '../../api/erpApi';
import InvoiceTable from '@/components/InvoiceTable';

export default function InvoicesDashboard() {
  const { data, isLoading, error } = useGetInvoicesQuery();
  const invoices = data?.results || data || [];

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Failed to load invoices</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>
      {/* TODO(v1.1): Enable invoice PDF once Railway system libraries available */}
      <InvoiceTable invoices={invoices} />
    </div>
  );
}
