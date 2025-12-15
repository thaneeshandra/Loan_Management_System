import React from 'react';
import PropTypes from 'prop-types';

const colorClasses = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900",
    border: "border-blue-100 dark:border-blue-800",
    icon: "text-blue-500 dark:text-blue-400",
    text: "text-blue-700 dark:text-blue-200"
  },
  green: {
    bg: "bg-green-50 dark:bg-green-900",
    border: "border-green-100 dark:border-green-800",
    icon: "text-green-500 dark:text-green-400",
    text: "text-green-700 dark:text-green-200"
  },
  yellow: {
    bg: "bg-yellow-50 dark:bg-yellow-900",
    border: "border-yellow-100 dark:border-yellow-800",
    icon: "text-yellow-500 dark:text-yellow-400",
    text: "text-yellow-700 dark:text-yellow-200"
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-900",
    border: "border-purple-100 dark:border-purple-800",
    icon: "text-purple-500 dark:text-purple-400",
    text: "text-purple-700 dark:text-purple-200"
  },
  // New color options
  primary: {
    bg: "bg-blue-50 dark:bg-blue-900",
    border: "border-blue-100 dark:border-blue-800",
    icon: "text-blue-500 dark:text-blue-400",
    text: "text-blue-700 dark:text-blue-200"
  },
  success: {
    bg: "bg-green-50 dark:bg-green-900",
    border: "border-green-100 dark:border-green-800",
    icon: "text-green-500 dark:text-green-400",
    text: "text-green-700 dark:text-green-200"
  },
  warning: {
    bg: "bg-orange-50 dark:bg-orange-900",
    border: "border-orange-100 dark:border-orange-800",
    icon: "text-orange-500 dark:text-orange-400",
    text: "text-orange-700 dark:text-orange-200"
  },
  info: {
    bg: "bg-cyan-50 dark:bg-cyan-900",
    border: "border-cyan-100 dark:border-cyan-800",
    icon: "text-cyan-500 dark:text-cyan-400",
    text: "text-cyan-700 dark:text-cyan-200"
  },
  danger: {
    bg: "bg-red-50 dark:bg-red-900",
    border: "border-red-100 dark:border-red-800",
    icon: "text-red-500 dark:text-red-400",
    text: "text-red-700 dark:text-red-200"
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-900",
    border: "border-indigo-100 dark:border-indigo-800",
    icon: "text-indigo-500 dark:text-indigo-400",
    text: "text-indigo-700 dark:text-indigo-200"
  }
};

const StatCard = ({ title, value, icon, color, onClick }) => {
  const classes = colorClasses[color] || colorClasses.blue;
  return (
    onClick ? (
      <button
        type="button"
        className={`${classes.bg} p-4 rounded-lg border ${classes.border} transition-all duration-200 hover:shadow-md cursor-pointer text-left w-full`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-sm font-medium text-gray-700 dark:text-gray-200`}>{title}</h3>
          <div className={classes.icon}>{icon}</div>
        </div>
        <p className={`text-2xl font-bold ${classes.text}`}>{value}</p>
      </button>
    ) : (
      <div
        className={`${classes.bg} p-4 rounded-lg border ${classes.border} transition-all duration-200 hover:shadow-md`}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-sm font-medium text-gray-700 dark:text-gray-200`}>{title}</h3>
          <div className={classes.icon}>{icon}</div>
        </div>
        <p className={`text-2xl font-bold ${classes.text}`}>{value}</p>
      </div>
    )
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['blue', 'green', 'yellow', 'purple', 'primary', 'success', 'warning', 'info', 'danger', 'indigo']),
  onClick: PropTypes.func,
};

export default StatCard;