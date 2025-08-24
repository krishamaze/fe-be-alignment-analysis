import { useState } from 'react';
import toast from 'react-hot-toast';
import { useCancelBookingMutation } from '../api/erpApi';

export default function MyBookings({ bookings = [], refetch }) {
  const [cancelBooking] = useCancelBookingMutation();
  const [modal, setModal] = useState(null); // {id, reason}

  const openModal = (id) => setModal({ id, reason: '' });
  const closeModal = () => setModal(null);

  const submit = async () => {
    if (!modal.reason.trim()) {
      toast.error('Reason required');
      return;
    }
    try {
      await cancelBooking({ id: modal.id, reason: modal.reason }).unwrap();
      toast.success('Booking cancelled');
      closeModal();
      refetch?.();
    } catch {
      toast.error('Cancellation failed');
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">My Bookings</h2>
      <table className="w-full text-left border">
        <thead>
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Reason</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-t">
              <td className="p-2 border">{b.id}</td>
              <td className="p-2 border">{b.status}</td>
              <td className="p-2 border">{b.reason || '-'}</td>
              <td className="p-2 border">
                {['pending', 'approved'].includes(b.status) && (
                  <button
                    onClick={() => openModal(b.id)}
                    className="text-red-600"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-4 rounded w-80">
            <h3 className="text-lg font-bold mb-2">Cancel Booking</h3>
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
                onClick={submit}
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
