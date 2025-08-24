import { useEffect, useState } from 'react';
import {
  getUsers,
  modifyUserStatus,
  softDeleteUser,
  updateUser,
} from '../api/user';
import NoDataFound from '../assets/images/NoDataFound.png';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { getStores } from '../api/store';
import { createUser } from '../api/user';
import { MESSAGE } from '../utils/Constants';
import Loader from '../components/common/Loader';
import { MdToggleOff, MdToggleOn } from 'react-icons/md';
import ToggleStatusModal from '../components/ToggleStatusModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import ResponsivePaginationHandler from '../components/ResponsivePaginationHandler';
import { FaEdit, FaUserTie } from 'react-icons/fa';
import { FaBuildingUser } from 'react-icons/fa6';
import StoreAssignModal from '../components/Store/StoreAssignModal';

const UserList = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state?.user);
  const { userData } = useAppSelector((state) => state?.user);
  const [isEdit, setIsEdit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // const { stores } = useAppSelector((state) => state?.store);
  const { totalPages, currentPage, totalElements, pageSize } = useAppSelector(
    (state) => state?.user
  );
  const [showToggle, setShowToggle] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [storeAssignModal, setStoreAssignModal] = useState(false);

  const [user, setUser] = useState({
    id: '',
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    role: '',
  });

  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    search: '',
  });

  useEffect(() => {
    dispatch(getUsers(pagination));
    dispatch(getStores());
  }, [pagination, dispatch, storeAssignModal]);

  const generateRandomString = (length) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => {
      const updatedUser = {
        ...prev,
        [name]: value,
      };

      if (name === 'first_name' || name === 'last_name') {
        const firstNamePart = updatedUser.first_name
          .toLowerCase()
          .slice(0, 3)
          .padEnd(3, 'a');
        const lastNamePart =
          updatedUser.last_name.toLowerCase().slice(0, 1) || 'a';
        const randomPart = generateRandomString(2);
        updatedUser.username =
          `${firstNamePart}${lastNamePart}${randomPart}`.slice(0, 6);
      }

      return updatedUser;
    });
  };

  const validateForm = () => {
    if (!user.first_name || !user.email || !user.role || !user.phone) {
      toast.error('Please fill all required fields');
      return false;
    }

    if (!user.id && user.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(user.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    if (user.id) {
      await dispatch(updateUser(user))
        .then((response) => {
          if (response.meta.requestStatus === 'fulfilled') {
            toast.success(MESSAGE.USER_UPDATED);
            handleClose();
            dispatch(getUsers(pagination));
            dispatch(getStores());
          } else {
            toast.error('BAD REQUEST');
          }
        })
        .catch((error) => {
          toast.error(error?.message);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else {
      await dispatch(createUser(user))
        .then((response) => {
          if (response.meta.requestStatus === 'fulfilled') {
            toast.success(MESSAGE.USER_CREATED);
            handleClose();
            dispatch(getUsers());
            dispatch(getStores());
          } else {
            toast.error('BAD REQUEST');
          }
        })
        .catch((error) => {
          toast.error(error?.message);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  const onEdit = (obj) => {
    const {
      id,
      first_name,
      last_name,
      username,
      email,
      password,
      phone,
      role,
    } = obj;
    setUser({
      id: id,
      first_name: first_name,
      last_name: last_name,
      username: username,
      email: email,
      password: password,
      phone: phone,
      role: role,
    });
    setIsEdit(true);
  };

  const handleClose = () => {
    setIsEdit(false);
    setShowToggle(false);
    setShowDeleteModal(false);
    setStoreAssignModal(false);
    setUser({
      id: '',
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      password: '',
      phone: '',
      role: '',
      // store: '',
    });
  };

  const handleToggleStatus = (user) => {
    dispatch(modifyUserStatus({ id: user.id, is_active: !user.is_active }))
      .then((response) => {
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success(MESSAGE.USER_STATUS_UPDATED);
          dispatch(getStores());
          dispatch(getUsers(pagination));
          handleClose();
        } else {
          toast.error('BAD REQUEST');
        }
      })
      .catch((error) => {
        toast.error(error?.message);
      });
  };

  const handleToggleClick = (user) => {
    setUser(user);
    setShowToggle(true);
  };

  const handleDeleteAction = (id) => {
    dispatch(softDeleteUser(id))
      .then((response) => {
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success(MESSAGE.USER_DELETED);
          dispatch(getStores());
          dispatch(getUsers());
          handleClose();
        } else {
          toast.error('BAD REQUEST');
        }
      })
      .catch((error) => {
        toast.error(error?.message);
      });
  };

  const handleDeleteClick = (user) => {
    setUser(user);
    setShowDeleteModal(true);
  };

  const handleSearch = (value) => {
    setPagination((prev) => ({
      ...prev,
      search: value,
    }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      ['page']: page,
    }));
  };

  const handleStoreAssignClick = (user) => {
    setStoreAssignModal(true);
    setUser(user);
  };

  const handleMobilePageChange = (size) => {
    setPagination((prev) => ({
      ...prev,
      ['size']: size,
    }));
  };

  return (
    <div className="relative">
      {!isEdit && (
        <div className="p-6">
          {isLoading && <Loader />}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto">
                <h1 className="text-2xl font-bold text-gray-800">Users</h1>
                {/* Mobile-only ADD button */}
                <button
                  className="sm:hidden px-4 py-2 bg-black text-white rounded hover:bg-gray-900 ml-auto"
                  onClick={() => setIsEdit(true)}
                >
                  ADD
                </button>
              </div>

              {/* Search Input */}
              <div className="w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search stores"
                  className="w-full px-3 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-keyline"
                  onChange={(e) => handleSearch(e.target.value)}
                  value={pagination.search}
                />
              </div>
            </div>

            {/* Desktop-only ADD button */}
            <button
              className="hidden sm:inline-block px-4 py-2 bg-black text-white rounded hover:bg-gray-900"
              onClick={() => setIsEdit(true)}
            >
              ADD
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userData.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <img
                  src={NoDataFound}
                  alt="No data found"
                  className="w-48 h-auto"
                />
                <p className="mt-4 text-gray-500">No data found</p>
              </div>
            ) : (
              userData.map((user, index) => (
                <div
                  key={index}
                  className="relative p-5 rounded-xl bg-white/70 shadow-lg backdrop-blur-lg border border-gray-200 transition hover:shadow-xl flex flex-col justify-between"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-m text-gray-500 mt-2">
                      <strong>Email:</strong> {user.email || '-'}
                    </p>
                    <p className="text-m text-gray-500">
                      <strong>Phone:</strong> {user.phone || '-'}
                    </p>
                    <p className="text-m text-gray-500">
                      <strong>Role:</strong> {user.role || '-'}
                    </p>
                    <p className="text-m text-gray-500">
                      <strong>Store:</strong>{' '}
                      {user.store_name || (
                        <span className="text-m text-gray-400">unassigned</span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span
                      onClick={() => handleToggleClick(user)}
                      className="cursor-pointer"
                    >
                      {user.is_active ? (
                        <MdToggleOn
                          className="text-green-500 hover:scale-110 transition-transform"
                          size={26}
                        />
                      ) : (
                        <MdToggleOff
                          className="text-red-500 hover:scale-110 transition-transform"
                          size={26}
                        />
                      )}
                    </span>
                    <div className="flex gap-3 items-center">
                      <button
                        onClick={() => handleStoreAssignClick(user)}
                        title="Assign Store"
                        className="text-gray-700 hover:text-keyline transition-transform hover:scale-110"
                      >
                        <FaBuildingUser size={20} />
                      </button>
                      <button
                        onClick={() => onEdit(user)}
                        className="text-yellow-500 hover:text-yellow-600"
                      >
                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293z" />
                          <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                        </svg> */}
                        <FaEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        data-bs-toggle="modal"
                        data-bs-target="#staticDeletedPopup"
                        className="text-red-500 hover:text-red-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="currentColor"
                          className="bi bi-trash3"
                          viewBox="0 0 16 16"
                        >
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
        </div>
      )}

      {isEdit && (
        <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                  {user?.id ? 'Update User' : 'Create User'}
                </h2>
                <button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="first_name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      placeholder="Enter full name"
                      value={user.first_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-keyline"
                      required
                    />
                  </div>

                  {/* Initial */}
                  <div>
                    <label
                      htmlFor="last_name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Initial (Parent Name)
                    </label>
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      placeholder="Enter parent name or initial"
                      value={user.last_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-keyline"
                    />
                  </div>

                  {/* Username */}
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Username (Auto-generated)
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={user.username}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter email address"
                      value={user.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-keyline"
                      required
                    />
                  </div>

                  {/* Password (only for create) */}
                  {!user.id && (
                    <div className="relative">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter password (min 8 chars)"
                        value={user.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-keyline"
                        required
                        minLength="8"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center pt-5"
                      >
                        {showPassword ? (
                          <svg
                            className="h-5 w-5 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-5 w-5 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      value={user.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-keyline"
                      required
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={user.role}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-keyline"
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="branch_head">Branch Head</option>
                      <option value="advisor">Advisor</option>
                      <option value="system_admin">System Admin</option>
                    </select>
                  </div>

                  {/* Store assignment */}
                  {/* <div>
                    <label htmlFor="store" className="block text-sm font-medium text-gray-700 mb-1">
                      Assign to Store
                    </label>
                    <select
                      id="store"
                      name="store"
                      value={user.store}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-keyline"
                    >
                      <option value="">Select Store (Optional)</option>
                      {stores.map((store) => (
                        <option key={store.id} value={store.id}>
                          {store.store_name} ({store.code})
                        </option>
                      ))}
                    </select>
                  </div> */}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row sm:justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-keyline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full sm:w-auto px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-keyline ${
                      isSubmitting
                        ? 'bg-gray-400'
                        : 'bg-black hover:bg-gray-900'
                    }`}
                  >
                    {user?.id ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <StoreAssignModal
        isOpen={storeAssignModal}
        onClose={() => handleClose()}
        user={user}
      />

      <ToggleStatusModal
        isOpen={showToggle}
        onClose={() => handleClose()}
        handleToggleStatus={handleToggleStatus}
        value={user}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => handleClose()}
        handleDeleteAction={handleDeleteAction}
        value={user}
      />
    </div>
  );
};

export default UserList;
