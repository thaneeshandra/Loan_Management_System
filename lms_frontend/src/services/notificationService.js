import api from './api';

export const fetchUserNotifications = async (page = 0, size = 10) => {
  try {
    console.log('Fetching notifications...'); // Debug log
    const response = await api.get('/notifications', {
      params: { page, size }
    });
    console.log('Notification response:', response.data); // Debug log
    
    // ✅ Return the correct data structure - backend returns Page<NotificationDTO>
    return response.data; // This contains { content: [...], totalPages, totalElements, etc. }
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return []; // Returns empty array instead of throwing
  }
};

// ✅ Additional function for just getting the notifications array
export const fetchUserNotificationsArray = async (page = 0, size = 10) => {
  try {
    const pageData = await fetchUserNotifications(page, size);
    return pageData.content || [];
  } catch (error) {
    console.error('Error fetching notifications array:', error);
    return [];
  }
};
