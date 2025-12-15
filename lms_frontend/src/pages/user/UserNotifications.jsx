import React, { useEffect, useState } from "react";
import api from "../../services/api";

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications(page);
    // eslint-disable-next-line
  }, [page]);

  const fetchNotifications = async (pageNum = 0) => {
    setLoading(true);
    try {
      const res = await api.get(`/notifications?page=${pageNum}&size=10`);
      setNotifications(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setNotifications([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  let notificationsContent;
  if (loading) {
    notificationsContent = (
      <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
    );
  } else if (notifications.length === 0) {
    notificationsContent = (
      <div className="text-center text-gray-500 dark:text-gray-400">No notifications found.</div>
    );
  } else {
    notificationsContent = (
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {notifications.map((n) => (
          <li
            key={n.id}
            className={`p-4 ${n.isRead ? "bg-gray-50 dark:bg-gray-800" : "bg-blue-50 dark:bg-blue-900"} transition-colors`}
          >
            <div className="flex justify-between items-center">
              <span className={`font-medium ${n.isRead ? "text-gray-700 dark:text-gray-300" : "text-blue-700 dark:text-blue-300"}`}>
                {n.message}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-4">
                {n.timestamp ? new Date(n.timestamp).toLocaleString() : ""}
              </span>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Your Notifications</h2>
      {notificationsContent}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">{page + 1} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
            disabled={page + 1 >= totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserNotifications;