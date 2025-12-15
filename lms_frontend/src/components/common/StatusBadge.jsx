// components/common/StatusBadge.jsx
const StatusBadge = ({ status }) => {
  const statusClasses = {
    APPROVED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    COMPLETED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    DEFAULT: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  };
  const cls = statusClasses[status?.toUpperCase()] || statusClasses.DEFAULT;
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls}`}>
      {status || "Unknown"}
    </span>
  );
};
export default StatusBadge;