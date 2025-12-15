import React from 'react';
import { USER_ROLES } from '../../constants/loanConstants';

const UserTable = ({
  users,
  currentPage,
  totalPages,
  onPageChange,
  onSort,
  sortField,
  sortDirection,
  onFilterChange,
  filters,
}) => {
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(field, direction);
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="border px-3 py-1 rounded w-full md:w-1/3"
        />
        <select
          value={filters.role}
          onChange={(e) => onFilterChange({ ...filters, role: e.target.value })}
          className="border px-3 py-1 rounded w-full md:w-1/4"
        >
          <option value="">All Roles</option>
          <option value={USER_ROLES.ADMIN}>Admin</option>
          <option value={USER_ROLES.USER}>User</option>
        </select>
      </div>

      {/* Table */}
      <table className="min-w-full table-auto text-sm text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            {['name', 'email', 'role'].map((field) => (
              <th
                key={field}
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleSort(field)}
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
                {sortField === field && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
              </th>
            ))}
            <th className="px-4 py-2">Mobile</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.role?.name}</td>
              <td className="px-4 py-2">{user.mobileNumber}</td>
              <td className="px-4 py-2">
                <button className="text-blue-600 hover:underline mr-2">Edit</button>
                <button className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">{currentPage + 1} / {totalPages}</span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage + 1 >= totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserTable;
