const ToggleStatusModal = ({ isOpen, onClose, handleToggleStatus, value }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-md sm:max-w-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {value.is_active ? 'Deactivate Item?' : 'Activate Item?'}
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to {value.is_active ? 'deactivate' : 'activate'} this item?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => handleToggleStatus(value)}
            className={`px-4 py-2 rounded ${
              value.is_active
                ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {value.is_active ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToggleStatusModal;
