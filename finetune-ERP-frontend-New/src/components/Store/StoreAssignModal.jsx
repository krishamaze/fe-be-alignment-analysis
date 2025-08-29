import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { assignStoreToUser, unassignStoreFromUser } from '../../api/user';
import {
  assignBranchHeadToStore,
  unassignBranchHeadFromStore,
} from '../../api/store';
import toast from 'react-hot-toast';

const StoreAssignModal = ({ isOpen, onClose, user }) => {
  const dispatch = useAppDispatch();
  const { stores, loading } = useAppSelector((state) => state.store);
  const [selectedStoreId, setSelectedStoreId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedStoreId(user.store || '');
    }
  }, [isOpen, dispatch, user]);

  if (!isOpen) return null;

  const handleAssign = async () => {
    if (!selectedStoreId) return;
    try {
      let response;
      if (user.role === 'branch_head') {
        response = await dispatch(
          assignBranchHeadToStore({
            storeId: Number(selectedStoreId),
            userId: user.id,
          })
        );
      } else {
        response = await dispatch(
          assignStoreToUser({ userId: user.id, store: Number(selectedStoreId) })
        );
      }
      if (response.meta.requestStatus === 'fulfilled') {
        toast.success('Store assigned');
        onClose();
      } else {
        toast.error(response.payload?.message || 'BAD REQUEST');
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const handleUnassign = async () => {
    try {
      let response;
      if (user.role === 'branch_head') {
        response = await dispatch(
          unassignBranchHeadFromStore({
            storeId: Number(selectedStoreId),
            userId: user.id,
          })
        );
      } else {
        response = await dispatch(unassignStoreFromUser({ userId: user.id }));
      }
      if (response.meta.requestStatus === 'fulfilled') {
        toast.success('Store unassigned');
        onClose();
      } else {
        toast.error(response.payload?.message || 'BAD REQUEST');
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Assign Store</h2>
        <select
          className="w-full border px-3 py-2 mb-4 rounded"
          value={selectedStoreId}
          onChange={(e) => setSelectedStoreId(e.target.value)}
        >
          <option value="">Select store</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.store_name || store.code}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          {user?.store && (
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
            disabled={loading || !selectedStoreId}
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

export default StoreAssignModal;
