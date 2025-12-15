import React, { useState, useEffect } from 'react';
import DocumentList from '../../components/user/DocumentList';
import { FiFileText, FiFilter, FiRefreshCw } from 'react-icons/fi';
import api from '../../services/api';

const ViewDocuments = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    fetchDocuments();
  };

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/documents/user');
      setDocuments(response.data || []);
    } catch (err) {
      setDocuments([]);
    }
  };

  // Real-time filtering effect
  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredDocuments(documents);
    } else {
      const filtered = documents.filter(doc => 
        doc.status?.toLowerCase() === filterStatus.toLowerCase()
      );
      setFilteredDocuments(filtered);
    }
  }, [documents, filterStatus]);

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line
  }, [refreshKey]);

  // Calculate statistics from filtered documents
  const total = filteredDocuments.length;
  const approved = filteredDocuments.filter(doc => doc.status?.toLowerCase() === 'approved').length;
  const pending = filteredDocuments.filter(doc => doc.status?.toLowerCase() === 'pending').length;
  const rejected = filteredDocuments.filter(doc => doc.status?.toLowerCase() === 'rejected').length;

  // Handle filter change with real-time update
  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <FiFileText className="text-blue-600 dark:text-blue-400" size={24} />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">My Documents</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              View and manage all your uploaded documents across all loan applications.
              {filterStatus !== 'all' && (
                <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                  Filtered by: {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                </span>
              )}
            </p>
          </div>
          
          <div className="flex space-x-2">
            {/* Filter by Status */}
            <div className="flex items-center space-x-2">
              <FiFilter className="text-gray-400 dark:text-gray-500" size={16} />
              <select
                value={filterStatus}
                onChange={handleFilterChange}
                className="border border-gray-300 dark:border-gray-700 rounded px-3 py-1 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
            >
              <FiRefreshCw size={14} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards - Now shows filtered statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FiFileText className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {filterStatus === 'all' ? 'Total Documents' : 'Filtered Documents'}
              </p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <FiFileText className="text-green-600 dark:text-green-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Approved</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">{approved}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <FiFileText className="text-yellow-600 dark:text-yellow-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Pending</p>
              <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{pending}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <FiFileText className="text-red-600 dark:text-red-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Rejected</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">{rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Documents List - Pass filtered documents */}
      <DocumentList 
        key={refreshKey} 
        showAllDocuments={true} 
        filterStatus={filterStatus}
        documents={filteredDocuments}
      />
      
    </div>
  );
};

export default ViewDocuments;
