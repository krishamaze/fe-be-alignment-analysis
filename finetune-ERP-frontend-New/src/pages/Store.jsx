import { useAppDispatch, useAppSelector } from "../redux/hook";
import { createStore, getStores, modifyStoreStatus, softDeleteStore, updateStore } from "../api/store";
import { useEffect, useState } from "react";
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';
import { MESSAGE } from "../utils/Constants";
import NoDataFound from '../assets/images/NoDataFound.png';
import StoreFilters from "../components/Store/StoreFilters";
import BranchHeadModal from "../components/Store/BranchHeadModal";
import { MdToggleOff, MdToggleOn } from 'react-icons/md';
import { FaEdit, FaUserTie } from 'react-icons/fa';
import ResponsivePaginationHandler from "../components/ResponsivePaginationHandler";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import ToggleStatusModal from "../components/ToggleStatusModal";

const Store = () => {

  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((state) => state?.store)
  const { stores } = useAppSelector((state) => state?.store)
  const [isEdit, setIsEdit] = useState(false)
  const { totalPages, currentPage, totalElements, pageSize } = useAppSelector((state) => state?.store)
  const [showToggle, setShowToggle] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [store, setStore] = useState({
    id: '',
    store_name: '',
    address: '',
    code: '',
    is_active: ''
  });

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    search: '',
    status: '',
    branch_head_status: ''
  });

  const [branchHeadModalOpen, setBranchHeadModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    dispatch(getStores(pagination));
  }, [pagination, dispatch, branchHeadModalOpen]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStore(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openBranchHeadModal = (store) => {
    setSelectedStore(store);
    setBranchHeadModalOpen(true);
  };

  const closeBranchHeadModal = () => {
    setSelectedStore(null);
    setBranchHeadModalOpen(false);
  };

  const onEdit = (obj) => {
    const { id, store_name, address, code, is_active } = obj;

    setStore({
      id: id,
      store_name: store_name,
      address: address,
      code: code,
      is_active: is_active
    })
    setIsEdit(true)
  }


  const handleSubmit = async (store) => {
    setIsSubmitting(true);

    const newStore = {
      ...store,
      is_active: true,
    };

    if (!store.id) {
      await dispatch(createStore(newStore))
        .then((response) => {
          if (response.meta.requestStatus === 'fulfilled') {
            toast.success(MESSAGE.STORE_CREATED)
            handleClose();
            dispatch(getStores(pagination));
          }
          else {
            toast.error("BAD REQUEST")
          }
        })
        .catch((error) => {
          toast.error(error?.message)
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
    else {
      await dispatch(updateStore(store))
        .then((response) => {
          if (response.meta.requestStatus === 'fulfilled') {
            toast.success(MESSAGE.STORE_UPDATED)
            handleClose();
            dispatch(getStores(pagination));
          }
          else {
            toast.error("BAD REQUEST")
          }
        })
        .catch((error) => {
          toast.error(error?.message)
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  const handleToggleStatus = (status) => {
    dispatch(modifyStoreStatus({ id: status.id, is_active: !status.is_active }))
      .then((response) => {
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success(MESSAGE.STORE_STATUS_UPDATED)
          dispatch(getStores(pagination))
          handleClose();
        } else {
          toast.error("BAD REQUEST")
        }
      })
      .catch((error) => {
        toast.error(error?.message)
      });
  }

  const handleToggleClick = (store) => {
    setStore(store);
    setShowToggle(true);
  }

  const handleDeleteClick = (store) => {
    setStore(store);
    setShowDeleteModal(true);
  }


  const handleDeleteAction = (id) => {
    dispatch(softDeleteStore(id))
      .then((response) => {
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success(MESSAGE.STORE_DELETED)
          handleClose();
          dispatch(getStores())
        } else {
          toast.error("BAD REQUEST")
        }
      })
      .catch((error) => {
        toast.error(error?.message)
      });
  }

  const handleClose = () => {
    setIsEdit(false)
    setShowToggle(false);
    setShowDeleteModal(false);
    setStore({
      id: '',
      store_name: '',
      address: '',
      code: '',
      is_active: ''
    })
  }

  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      page: page
    }));
  }

  const handleMobilePageChange = (size) => {
    console.log("Mobile Page Change store :", size);
    setPagination(prev => ({
      ...prev,
      size: size
    }));
  }

  const handleSearch = (value) => {
    setPagination(prev => ({
      ...prev,
      search: value
    }));
  }

  return (
    <>
      {!isEdit &&
        <div className="">
          {isLoading && <Loader />}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Stores</h1>
            <button
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-900"
              onClick={() => setIsEdit(true)}
            >
              ADD
            </button>
          </div>
          <StoreFilters
            search={pagination.search}
            status={pagination.status}
            branchHead={pagination.branch_head_status}
            onSearchChange={handleSearch}
            onStatusChange={(value) => setPagination(prev => ({ ...prev, page: 0, status: value }))}
            onBranchHeadChange={(value) => setPagination(prev => ({ ...prev, page: 0, branch_head_status: value }))}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 p-2">
            {stores.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center text-center py-10">
                <img src={NoDataFound} alt="No data found" className="w-48 h-auto" />
                <p className="mt-4 text-gray-500">No data found</p>
              </div>
            ) : (
              stores.map((store) => (
                <div
                  key={store.id}
                  className="flex flex-col justify-between h-full bg-white rounded-2xl p-6 shadow-lg border border-gray-200 transition-all hover:shadow-2xl"
                >
                  {/* Store Info */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900">{store.store_name}</h3>

                    <div className="text-sm text-gray-700">
                      <p>
                        <span className="font-medium">Code:</span> {store.code}
                      </p>
                      <p>
                        <span className="font-medium">Address:</span> {store.address}
                      </p>
                    </div>

                    {/* Branch Head Info */}
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 font-medium">Branch Head:</p>
                      {store.branch_head_name ? (
                        <div className="text-sm text-gray-800">
                          <p className="font-semibold">{store.branch_head_name}</p>
                          <p className="text-xs text-gray-500">{store.branch_head_email}</p>
                        </div>
                      ) : (
                        <p className="italic text-gray-400 text-sm">Not assigned</p>
                      )}
                    </div>
                  </div>

                  {/* Actions - bottom */}
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                    <span
                      onClick={() => handleToggleClick(store)}
                      className="cursor-pointer transition-transform hover:scale-110"
                      title="Toggle Active"
                    >
                      {store.is_active ? (
                        <MdToggleOn className="text-green-500" size={28} />
                      ) : (
                        <MdToggleOff className="text-red-500" size={28} />
                      )}
                    </span>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => openBranchHeadModal(store)}
                        title="Assign Branch Head"
                        className="text-gray-700 hover:text-keyline transition-transform hover:scale-110"
                      >
                        <FaUserTie size={18} />
                      </button>
                      <button
                        onClick={() => onEdit(store)}
                        className="text-yellow-500 hover:text-yellow-600 transition-transform hover:scale-110"
                        title="Edit Store"
                      >
                        {/* <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706l-1.043 1.043-2-2 1.043-1.043a.5.5 0 0 1 .707 0l1.293 1.293z" />
                          <path
                            fillRule="evenodd"
                            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11A.5.5 0 0 1 2.5 2H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                          />
                        </svg> */}
                        <FaEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(store)}
                        className="text-red-500 hover:text-red-700 transition-transform hover:scale-110"
                        title="Delete Store"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1z" />
                          <path d="M5.03 4.97a.5.5 0 0 1 .47-.53.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 1 1-.998.06l-.5-8.5zM10.03 4.97a.5.5 0 0 1 .47-.53.5.5 0 0 1 .528.47l-.5 8.5a.5.5 0 0 1-.998.06l.5-8.5zM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>        
          <ResponsivePaginationHandler
            currentPage={currentPage}
            totalPages={totalPages}
            size={pageSize}
            totalElements={totalElements}
            onPageChange={(page) => handlePageChange(page)}
            onMobilePageChange={handleMobilePageChange}
          />
        </div>}

      {/* Add Store */}
      {isEdit && (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                  {store.id ? 'Update Store' : 'Add Store'}
                </h2>
                <button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label="Close"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(store);
                }}
                className="space-y-5"
              >
                {/* Store Name */}
                <div>
                  <label
                    htmlFor="store_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Store Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="store_name"
                    name="store_name"
                    type="text"
                    placeholder="Enter store name"
                    value={store.store_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-keyline"
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Enter store address"
                    value={store.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-keyline"
                    required
                  />
                </div>

                {/* Store Code */}
                <div>
                  <label
                    htmlFor="code"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Store Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="code"
                    name="code"
                    type="text"
                    placeholder="Enter unique store code"
                    value={store.code}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-keyline"
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-keyline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-keyline ${isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-black hover:bg-gray-900'
                      }`}
                  >
                    {store.id ? 'Update Store' : 'Add Store'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <BranchHeadModal
        isOpen={branchHeadModalOpen}
        onClose={closeBranchHeadModal}
        store={selectedStore}
      />

      <ToggleStatusModal
        isOpen={showToggle}
        onClose={() => handleClose()}
        handleToggleStatus={handleToggleStatus}
        value={store}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => handleClose()}
        handleDeleteAction={handleDeleteAction}
        value={store}
      />

    </>
  );

};

export default Store;
