import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiRefreshCw,
  FiX,
  FiCheck,
} from "react-icons/fi";
import api from "../../services/api";
import { viewDocument, downloadDocument } from "../../services/documentService";
import useNotification from "../../hooks/useNotification";

const ViewAdminDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [loanSearch, setLoanSearch] = useState("");
  const { showSuccess, showError } = useNotification();

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = {
        page,
        size: 10,
        sort: "uploadDate,desc",
      };

      if (filter !== "all") {
        params.status = filter.toUpperCase();
      }

      if (userSearch) {
        params.userId = userSearch;
      }

      if (loanSearch) {
        params.loanId = loanSearch;
      }

      if (search) {
        params.search = search;
      }

      console.log("🔍 Fetching documents with params:", params);
      console.log("🔍 API Base URL:", process.env.REACT_APP_API_URL);

      const response = await api.get("/admin/documents", { params });
      console.log("✅ Documents response:", response.data);

      setDocuments(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("❌ Failed to fetch documents:", {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        message: error.message,
      });

      // More specific error messages
      if (error.response?.status === 403) {
        showError("Access denied. Admin privileges required.");
      } else if (error.response?.status === 404) {
        showError(
          "Documents endpoint not found. Please check API configuration."
        );
      } else if (error.response?.status === 500) {
        showError("Server error. Please try again later.");
      } else {
        showError(
          `Failed to load documents: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchDocuments();
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      await downloadDocument(documentId, fileName);
      showSuccess("Document downloaded successfully");
    } catch (err) {
      console.error("Failed to download document:", err);
      showError("Failed to download document");
    }
  };

  const handleView = async (documentId) => {
    try {
      await viewDocument(documentId);
    } catch (err) {
      console.error("Failed to view document:", err);
      showError("Failed to view document");
    }
  };

  const handleStatusChange = async (documentId, status, reason = "") => {
    try {
      if (status === "REJECTED" && !reason) {
        reason = prompt("Please provide a reason for rejection:");
        if (!reason) return;
      }

      if (status === "APPROVED") {
        await api.put(`/admin/documents/${documentId}/approve`);
      } else {
        await api.put(`/admin/documents/${documentId}/reject`, null, {
          params: { reason },
        });
      }

      // Update local state
      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.id === documentId ? { ...doc, status } : doc
        )
      );

      showSuccess(`Document ${status.toLowerCase()} successfully`);
    } catch (err) {
      console.error(`Error updating document status to ${status}:`, err);
      showError(`Failed to update document status`);
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || "pending";
    const statusClasses = {
      approved:
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700/30",
      rejected:
        "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700/30",
      pending:
        "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700/30",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${statusClasses[statusLower]}`}
      >
        {status || "Pending"}
      </span>
    );
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            View Documents
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Browse, view, and manage all uploaded documents.
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          onClick={() => {
            setFilter("all");
            setSearch("");
            setUserSearch("");
            setLoanSearch("");
            setPage(0);
            fetchDocuments();
          }}
        >
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by document type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="User ID"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Loan ID"
              value={loanSearch}
              onChange={(e) => setLoanSearch(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Filter Options */}
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
            <FiFilter /> <span>Filter:</span>
          </div>
          {["all", "pending", "approved", "rejected"].map((option) => (
            <button
              key={option}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filter === option
                  ? "bg-blue-600 text-white dark:bg-blue-700"
                  : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
              }`}
              onClick={() => {
                setFilter(option);
                setPage(0);
              }}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table */}
      {loading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-gray-900 dark:text-white">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-gray-900 dark:text-white">
                  Document Type
                </th>
                <th className="px-4 py-3 text-left text-gray-900 dark:text-white">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-gray-900 dark:text-white">
                  User
                </th>
                <th className="px-4 py-3 text-left text-gray-900 dark:text-white">
                  Loan ID
                </th>
                <th className="px-4 py-3 text-left text-gray-900 dark:text-white">
                  Upload Date
                </th>
                <th className="px-4 py-3 text-left text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {doc.id}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {doc.documentType}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {doc.documentCategory}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {doc.user?.firstName} {doc.user?.lastName}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {doc.loanId}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {new Date(doc.uploadDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(doc.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                          title="View Document"
                          onClick={() => handleView(doc.id)}
                        >
                          <FiEye />
                        </button>
                        <button
                          className="p-1 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors"
                          title="Download Document"
                          onClick={() =>
                            handleDownload(
                              doc.id,
                              doc.fileName || `document-${doc.id}`
                            )
                          }
                        >
                          <FiDownload />
                        </button>
                        {doc.status === "PENDING" && (
                          <>
                            <button
                              className="p-1 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors"
                              title="Approve Document"
                              onClick={() =>
                                handleStatusChange(doc.id, "APPROVED")
                              }
                            >
                              <FiCheck />
                            </button>
                            <button
                              className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                              title="Reject Document"
                              onClick={() =>
                                handleStatusChange(doc.id, "REJECTED")
                              }
                            >
                              <FiX />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No documents found matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          Prev
        </button>
        <span className="px-3 py-1 text-gray-900 dark:text-white">
          {page + 1} / {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page + 1 >= totalPages}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ViewAdminDocuments;
