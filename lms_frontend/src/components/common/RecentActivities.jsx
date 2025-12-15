import React from 'react';
import { Link } from 'react-router-dom';

const RecentActivities = ({ activities = [], formatDate, profileLink = "/profile" }) => (
  <div>
    <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
    <div className="space-y-3 border dark:border-gray-700 rounded-lg divide-y dark:divide-gray-700">
      {activities.length > 0 ? (
        activities.map(activity => (
          <div key={activity.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
            <p className="font-medium">{activity.message}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{formatDate(activity.sentAt)}</p>
          </div>
        ))
      ) : (
        <div className="p-3 text-gray-500 dark:text-gray-400">No recent activities</div>
      )}
    </div>
  </div>
);

export default RecentActivities;