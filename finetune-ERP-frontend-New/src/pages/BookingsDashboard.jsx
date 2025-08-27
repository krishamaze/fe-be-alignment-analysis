import { useState, Fragment } from 'react';
import {
  useGetBookingsQuery,
  useUpdateBookingStatusMutation,
  useGetInvoicesQuery,
} from '../api/erpApi';
import InvoiceForm from '../components/InvoiceForm';
import InvoiceTable from '../components/InvoiceTable';
import PaymentsTable from '../components/PaymentsTable';
import toast from 'react-hot-toast';
import SaleEntryForm from '../components/inventory/SaleEntryForm';

export default function BookingsDashboard() {
  const { data, isLoading, error } = useGetBookingsQuery();
  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  const [modal, setModal] = useState(null); // {id, status, reason}
  const [invoiceModal, setInvoiceModal] = useState(null); // booking id
  const bookings = data?.content || [];
  const { data: invoiceData } = useGetInvoicesQuery();
  const allInvoices = invoiceData?.results || invoiceData || [];

  const changeStatus = async (id, status) => {
    try {
      await updateBookingStatus({ id, status }).unwrap();
      toast.success('Status updated');
    } catch {
      toast.error('Update failed');
    }
  };

  const openModal = (id, status) => setModal({ id, status, reason: '' });
  const closeModal = () => setModal(null);

  const submitModal = async () => {
    if (!modal.reason.trim()) {
      toast.error('Reason required');
      return;
    }
    try {
      await updateBookingStatus({
        id: modal.id,
        status: modal.status,
        reason: modal.reason,
      }).unwrap();
      toast.success('Status updated');
      closeModal();
    } catch {
      toast.error('Update failed');
    }
  };

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Failed to load bookings</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bookings</h1>
      <table className="w-full text-left border">
        <thead>
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Issues</th>
            <th className="p-2 border">Other Issues</th>
            <th className="p-2 border">Responses</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Reason</th>
            <th className="p-2 border">Actions</th>
            <th className="p-2 border">Invoice</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <Fragment key={b.id}>
              <tr className="border-t">
                <td className="p-2 border">{b.name}</td>
                <td className="p-2 border">
                  {b.issues?.length
                    ? b.issues.map((i) => (
                        <span
                          key={i.id || i}
                          className="mr-1 inline-block rounded bg-gray-100 px-2 py-1"
                        >
                          {i.name || i}
                        </span>
                      ))
                    : '-'}
                </td>
                <td className="p-2 border">
                  {b.other_issues?.length
                    ? b.other_issues.map((o) => (
                        <span
                          key={o}
                          className="mr-1 inline-block rounded bg-gray-100 px-2 py-1"
                        >
                          {o}
                        </span>
                      ))
                    : '-'}
                </td>
                <td className="p-2 border">
                  {b.responses?.length
                    ? b.responses.map((r) => (
                        <div key={r.question} className="mb-1">
                          <span className="font-medium">{r.question}</span>:{' '}
                          {r.answer}
                        </div>
                      ))
                    : '-'}
                </td>
                <td className="p-2 border">{b.status}</td>
                <td className="p-2 border">{b.reason || '-'}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => changeStatus(b.id, 'approved')}
                    className="text-blue-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => changeStatus(b.id, 'in_progress')}
                    className="text-yellow-600"
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => changeStatus(b.id, 'completed')}
                    className="text-green-600"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => openModal(b.id, 'cancelled')}
                    className="text-red-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => openModal(b.id, 'rejected')}
                    className="text-gray-600"
                  >
                    Reject
                  </button>
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => setInvoiceModal(b.id)}
                    className="text-blue-600"
                  >
                    Create Invoice
                  </button>
                </td>
              </tr>
              {(() => {
                const invs = allInvoices.filter((i) => i.booking === b.id);
                if (!invs.length) return null;
                return (
                  <tr>
                    <td colSpan={8} className="p-2 border">
                      <InvoiceTable invoices={invs} />
                      {invs.map((inv) => (
                        <PaymentsTable
                          key={inv.id}
                          payments={inv.payments || []}
                        />
                      ))}
                    </td>
                  </tr>
                );
              })()}
            </Fragment>
          ))}
        </tbody>
      </table>

      <div className="my-4">
        <h2 className="text-lg font-semibold">Record Sale</h2>
        <SaleEntryForm />
      </div>

      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-4 rounded w-80">
            <h3 className="text-lg font-bold mb-2">
              {modal.status === 'rejected' ? 'Reject' : 'Cancel'} Booking
            </h3>
            <textarea
              placeholder="Reason"
              className="input w-full mb-2"
              value={modal.reason}
              onChange={(e) => setModal({ ...modal, reason: e.target.value })}
            />
            <div className="text-right space-x-2">
              <button onClick={closeModal} className="px-3 py-1">
                Close
              </button>
              <button
                onClick={submitModal}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {invoiceModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-4 rounded w-[500px]">
            <InvoiceForm
              bookingId={invoiceModal}
              onSuccess={() => setInvoiceModal(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
