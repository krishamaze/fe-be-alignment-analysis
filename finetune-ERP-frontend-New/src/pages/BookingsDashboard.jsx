import { useGetBookingsQuery, useUpdateBookingMutation } from '../api/erpApi';
import toast from 'react-hot-toast';

export default function BookingsDashboard() {
  const { data, isLoading, error } = useGetBookingsQuery();
  const [updateBooking] = useUpdateBookingMutation();
  const bookings = data?.content || [];

  const changeStatus = async (id, status) => {
    try {
      await updateBooking({ id, status }).unwrap();
      toast.success('Status updated');
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
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-t">
              <td className="p-2 border">{b.name}</td>
              <td className="p-2 border">{b.status}</td>
              <td className="p-2 border space-x-2">
                <button onClick={() => changeStatus(b.id, 'approved')} className="text-blue-600">Approve</button>
                <button onClick={() => changeStatus(b.id, 'in_progress')} className="text-yellow-600">In Progress</button>
                <button onClick={() => changeStatus(b.id, 'completed')} className="text-green-600">Complete</button>
                <button onClick={() => changeStatus(b.id, 'cancelled')} className="text-red-600">Cancel</button>
                <button onClick={() => changeStatus(b.id, 'rejected')} className="text-gray-600">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
