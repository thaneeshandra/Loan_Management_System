import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const colorClasses = {
  blue: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
  gray: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
  green: 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600',
  purple: 'bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600',
};

const QuickActions = ({ icon, title, to, onClick, color = 'blue' }) => {
  const baseClasses = `flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-colors ${colorClasses[color] || colorClasses.blue}`;

  const content = (
    <div className={baseClasses}>
      {icon}
      <span className="font-medium">{title}</span>
    </div>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="w-full text-left bg-transparent border-none p-0 m-0 cursor-pointer">
        {content}
      </button>
    );
  }

  if (to) {
    return (
      <Link to={to} className="block w-full">
        {content}
      </Link>
    );
  }

  return <div className="block w-full">{content}</div>;
};

QuickActions.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  to: PropTypes.string,
  onClick: PropTypes.func,
  color: PropTypes.oneOf(['blue', 'gray', 'green', 'purple']),
};

export default QuickActions;
