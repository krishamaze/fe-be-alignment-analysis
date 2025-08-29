import {
  useLazyGetInvoicePdfQuery,
  useGetInvoicesQuery,
} from '../../api/erpApi';
import InvoiceTable from '../../components/InvoiceTable';

export default function InvoicesDashboard() {
  const { data, isLoading, error } = useGetInvoicesQuery();
  const [getPdf] = useLazyGetInvoicePdfQuery();
  const invoices = data?.results || data || [];

  const download = async (id) => {
    const blob = await getPdf(id).unwrap();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${id}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Failed to load invoices</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>
      <InvoiceTable invoices={invoices} onDownload={download} />
    </div>
  );
}
