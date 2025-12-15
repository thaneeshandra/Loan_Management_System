import React from "react";
import { LOAN_STATUS } from "../../constants/loanConstants";

const LoanTable = ({
  loans,
  currentPage,
  totalPages,
  onPageChange,
  onSort,
  sortField,
  sortDirection,
  onFilterChange,
  filters,
  onStatusChange,
}) => {
  const handleSort = (field) => {
    const direction =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
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
          onChange={(e) =>
            onFilterChange({ ...filters, search: e.target.value })
          }
          className="border px-3 py-1 rounded w-full md:w-1/3"
        />
        <input
          type="date"
          value={filters.dateRange.startDate || ""}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              dateRange: { ...filters.dateRange, startDate: e.target.value },
            })
          }
          className="border px-3 py-1 rounded w-full md:w-1/4"
        />

        <input
          type="date"
          value={filters.dateRange.endDate || ""}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              dateRange: { ...filters.dateRange, endDate: e.target.value },
            })
          }
          className="border px-3 py-1 rounded w-full md:w-1/4"
        />

        <select
          value={filters.role}
          onChange={(e) => onFilterChange({ ...filters, role: e.target.value })}
          className="border px-3 py-1 rounded w-full md:w-1/4"
        >
          <option value="">All Roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) =>
            onFilterChange({ ...filters, status: e.target.value })
          }
          className="border px-3 py-1 rounded w-full md:w-1/4"
        >
          <option value="">All Statuses</option>
          <option value={LOAN_STATUS.PENDING}>Pending</option>
          <option value={LOAN_STATUS.APPROVED}>Approved</option>
          <option value={LOAN_STATUS.REJECTED}>Rejected</option>
        </select>
      </div>

      {/* Table */}
      <table className="min-w-full table-auto text-sm text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Loan Type</th>
            <th
              className="px-4 py-2 cursor-pointer"
              onClick={() => handleSort("amountRequested")}
            >
              Amount{" "}
              {sortField === "amountRequested" &&
                (sortDirection === "asc" ? "▲" : "▼")}
            </th>
            <th className="px-4 py-2">Status</th>
            <th
              className="px-4 py-2 cursor-pointer"
              onClick={() => handleSort("createdAt")}
            >
              Date{" "}
              {sortField === "createdAt" &&
                (sortDirection === "asc" ? "▲" : "▼")}
            </th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{loan.user?.name}</td>
              <td className="px-4 py-2">{loan.loanType}</td>
              <td className="px-4 py-2">₹{loan.amountRequested}</td>
              <td className="px-4 py-2">{loan.status}</td>
              <td className="px-4 py-2">
                {new Date(loan.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 space-x-2">
                {loan.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => onStatusChange(loan.id, "APPROVED")}
                      className="text-green-600 hover:underline"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onStatusChange(loan.id, "REJECTED")}
                      className="text-red-600 hover:underline"
                    >
                      Reject
                    </button>
                  </>
                )}
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
        <span className="px-3 py-1">
          {currentPage + 1} / {totalPages}
        </span>
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

export default LoanTable;
