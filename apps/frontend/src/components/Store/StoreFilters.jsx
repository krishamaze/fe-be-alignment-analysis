const StoreFilters = ({
  search,
  status,
  branchHead,
  onSearchChange,
  onStatusChange,
  onBranchHeadChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search stores..."
        className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-keyline transition"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      {/* Status Filter */}
      <div className="w-full sm:w-auto relative">
        <select
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-keyline appearance-none transition"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {/* Dropdown Icon */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Branch Head Filter */}
      <div className="w-full sm:w-auto relative">
        <select
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-keyline appearance-none transition"
          value={branchHead}
          onChange={(e) => onBranchHeadChange(e.target.value)}
        >
          <option value="">All Stores</option>
          <option value="assigned">With Branch Head</option>
          <option value="unassigned">Without Branch Head</option>
        </select>
        {/* Dropdown Icon */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default StoreFilters;
