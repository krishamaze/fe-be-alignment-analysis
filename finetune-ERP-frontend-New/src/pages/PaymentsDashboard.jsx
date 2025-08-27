import { useGetPaymentsQuery } from '../api/erpApi';
import PaymentsTable from '../components/PaymentsTable';

export default function PaymentsDashboard() {
  const { data, isLoading, error } = useGetPaymentsQuery();
  const payments = data?.results || data || [];

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Failed to load payments</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Payments</h1>
      <PaymentsTable payments={payments} />
    </div>
  );
}
