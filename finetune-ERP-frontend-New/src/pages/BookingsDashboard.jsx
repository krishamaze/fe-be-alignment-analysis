import { useState } from 'react';
import {
  useGetBookingsQuery,
  useUpdateBookingStatusMutation,
} from '../api/erpApi';
import toast from 'react-hot-toast';

export default function BookingsDashboard() {
  const { data, isLoading, error } = useGetBookingsQuery();
  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  const [modal, setModal] = useState(null); // {id, status, reason}
  const bookings = data?.content || [];

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
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Reason</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-t">
              <td className="p-2 border">{b.name}</td>
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
            </tr>
          ))}
        </tbody>
      </table>

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
    </div>
  );
}
