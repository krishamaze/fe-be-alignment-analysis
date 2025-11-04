import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/redux/hook';
import { useGetUsersQuery } from '@/api/erpApi';
import {
  assignBranchHeadToStore,
  unassignBranchHeadFromStore,
} from '../../api/store';
import toast from 'react-hot-toast';

const BranchHeadModal = ({ isOpen, onClose, store }) => {
  const dispatch = useAppDispatch();
  const { data } = useGetUsersQuery({ role: 'branch_head' }, { skip: !isOpen });
  const userData = data?.content ?? [];
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedUserId(store?.branch_head || '');
    }
  }, [isOpen, store]);

  if (!isOpen) return null;

  const availableBranchHeads = userData.filter(
    (user) =>
      user.role === 'branch_head' &&
      user.is_active &&
      !user.deleted &&
      (!user.headed_store || user.headed_store === store?.id)
  );

  const handleAssign = async () => {
    if (!selectedUserId) return;
    setLoading(true);
    const response = await dispatch(
      assignBranchHeadToStore({ storeId: store.id, userId: selectedUserId })
    );
    setLoading(false);
    if (response.meta.requestStatus === 'fulfilled') {
      toast.success('Branch head assigned');
      onClose();
    } else {
      toast.error(response.payload?.message || 'BAD REQUEST');
    }
  };

  const handleUnassign = async () => {
    setLoading(true);
    const response = await dispatch(
      unassignBranchHeadFromStore({
        storeId: store.id,
        userId: store.branch_head,
      })
    );
    setLoading(false);
    if (response.meta.requestStatus === 'fulfilled') {
      toast.success('Branch head unassigned');
      onClose();
    } else {
      toast.error(response.payload?.message || 'BAD REQUEST');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Assign Branch Head</h2>
        <select
          className="w-full border px-3 py-2 mb-4 rounded"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          <option value="">Select branch head</option>
          {availableBranchHeads.map((user) => (
            <option
              key={user.id}
              value={user.id}
              className={user.store ? 'bg-red-100' : 'bg-green-100'}
            >
              {`${user.first_name} ${user.last_name}`}
              {user.store_name ? ` | ${user.store_name}` : ' | Unassigned'}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          {store?.branch_head && (
            <button
              onClick={handleUnassign}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              {loading ? 'Processing...' : 'Unassign'}
            </button>
          )}
          <button
            onClick={handleAssign}
            disabled={loading || !selectedUserId}
            className="px-4 py-2 bg-black text-white rounded"
          >
            {loading ? 'Processing...' : 'Assign'}
          </button>
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchHeadModal;
