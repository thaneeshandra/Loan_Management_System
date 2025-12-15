import React, { useState, useEffect, useContext } from 'react';
import { fetchUsers, updateUser, deleteUser } from '../../services/userService';
import { FiSearch, FiEdit, FiTrash2 } from 'react-icons/fi';
import { ThemeContext } from '../../context/ThemeContext';

const ManageUsers = () => {
  const { theme } = useContext(ThemeContext);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchUsers(page, 10, 'name', 'asc', { search, role });
        const data = response.data;
        setUsers(data.content);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    loadUsers();
  }, [page, search, role]);

  const handleEditUser = (user) => {
    // Option 1: Simple prompt for role change
    const newRole = prompt(`Change role for ${user.name}:`, user.role);
    if (newRole && newRole !== user.role) {
      handleUpdateUser(user.id, { ...user, role: newRole });
    }
    
    // Option 2: You could also navigate to an edit form
    // navigate(`/admin/users/edit/${user.id}`);
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      setLoading(true);
      await updateUser(userId, userData);
      
      // Refresh the users list
      const response = await fetchUsers(page, 10, 'name', 'asc', { search, role });
      const data = response.data;
      setUsers(data.content);
      setTotalPages(data.totalPages);
      
      alert('User updated successfully!');
    } catch (err) {
      console.error('Failed to update user:', err);
      alert('Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        setLoading(true);
        await deleteUser(user.id);
        
        // Remove user from local state
        setUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
        
        // If current page becomes empty, go to previous page
        if (users.length === 1 && page > 0) {
          setPage(prev => prev - 1);
        } else {
          // Refresh the users list
          const response = await fetchUsers(page, 10, 'name', 'asc', { search, role });
          const data = response.data;
          setUsers(data.content);
          setTotalPages(data.totalPages);
        }
        
        alert('User deleted successfully!');
      } catch (err) {
        console.error('Failed to delete user:', err);
        alert('Failed to delete user. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
          <p className="text-gray-600 dark:text-gray-300">View, edit, or delete user accounts.</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" />
          </div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <option value="">All Roles</option>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">Role</th>
              <th className="px-4 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800">
            {users.map(user => (
              <tr key={user.id} className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-4 py-2 text-gray-900 dark:text-white">{user.name}</td>
                <td className="px-4 py-2 text-gray-900 dark:text-white">{user.email}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.role === 'ADMIN' 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditUser(user)}
                      disabled={loading}
                      className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 p-1 rounded transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      <FiEdit /> Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user)}
                      disabled={loading}
                      className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 p-1 rounded transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          Prev
        </button>
        <span className="px-3 py-1 text-gray-900 dark:text-white">{page + 1} / {totalPages}</span>
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

export default ManageUsers;
