import React, { useState, useEffect, useContext } from 'react';
import { FiUser, FiMail, FiHome, FiEdit2, FiSave } from 'react-icons/fi';
import api from '../../services/api';
import { ThemeContext } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext'; // Import notification hook

const Profile = () => {
  // Get theme context
  const { theme } = useContext(ThemeContext);
  
  // Get notification functions
  const { success, error } = useNotification();
  
  // Determine classes based on theme
  const bgClass = theme?.mode === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textClass = theme?.mode === 'dark' ? 'text-gray-200' : 'text-gray-800';
  const sectionBgClass = theme?.mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50';
  const inputBgDisabled = theme?.mode === 'dark' ? 'bg-gray-600' : 'bg-gray-100';
  const inputBgEnabled = theme?.mode === 'dark' ? 'bg-gray-800' : 'bg-white';
  const inputBorderDisabled = theme?.mode === 'dark' ? 'border-gray-600' : 'border-gray-200';
  const inputBorderEnabled = theme?.mode === 'dark' ? 'border-blue-500' : 'border-blue-300';
  const labelClass = theme?.mode === 'dark' ? 'text-gray-300' : 'text-gray-700';
  
  // State for user profile data
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/users/me');
        const user = response.data;

        setProfile({
          firstName: user.name?.split(' ')[0] || user.name || '',
          lastName: user.name?.split(' ')[1] || '',
          email: user.email || '',
          phone: user.mobileNumber || '',
          address: user.address || '',
        });
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [error]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updateData = {
        name: `${profile.firstName} ${profile.lastName}`.trim(),
        mobileNumber: profile.phone,
        address: profile.address,
      };

      const response = await api.put('/users/me', updateData);

      const updated = response.data;
      setProfile(prev => ({
        ...prev,
        firstName: updated.name?.split(' ')[0] || '',
        lastName: updated.name?.split(' ')[1] || '',
        email: updated.email,
        phone: updated.mobileNumber,
        address: updated.address,
      }));

      setIsEditing(false);
      success('Profile updated successfully');
    } catch (err) {
      console.error('Failed to update profile:', err);
      error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  if (isLoading && !profile.email) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${theme?.mode === 'dark' ? 'border-blue-400' : 'border-blue-500'}`}></div>
      </div>
    );
  }

  return (
    <div className={`max-w-3xl mx-auto ${bgClass} rounded-lg shadow-md p-6 transition-colors duration-200`}>
      {/* Removed the notification display div since React-Toastify handles it */}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${textClass}`}>My Profile</h1>
        {!isEditing ? (
          <button
            onClick={toggleEdit}
            className={`flex items-center gap-2 ${theme?.mode === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded-md transition-colors`}
          >
            <FiEdit2 /> Edit Profile
          </button>
        ) : (
          <button
            onClick={toggleEdit}
            className={`flex items-center gap-2 ${theme?.mode === 'dark' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-500 hover:bg-gray-600'} text-white px-4 py-2 rounded-md transition-colors`}
          >
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className={`${sectionBgClass} p-6 rounded-lg mb-6 transition-colors duration-200`}>
          <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${textClass}`}>
            <FiUser className="text-blue-500" /> Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${labelClass} mb-1`}>First Name</label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full p-2 border rounded-md ${isEditing ? `${inputBgEnabled} ${inputBorderEnabled}` : `${inputBgDisabled} ${inputBorderDisabled}`} ${textClass} transition-colors duration-200`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${labelClass} mb-1`}>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full p-2 border rounded-md ${isEditing ? `${inputBgEnabled} ${inputBorderEnabled}` : `${inputBgDisabled} ${inputBorderDisabled}`} ${textClass} transition-colors duration-200`}
              />
            </div>
          </div>
        </div>

        <div className={`${sectionBgClass} p-6 rounded-lg mb-6 transition-colors duration-200`}>
          <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${textClass}`}>
            <FiMail className="text-blue-500" /> Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${labelClass} mb-1`}>Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled={true} // Email is always disabled/non-editable
                className={`w-full p-2 border rounded-md ${inputBgDisabled} ${inputBorderDisabled} ${textClass} transition-colors duration-200`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${labelClass} mb-1`}>Phone</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full p-2 border rounded-md ${isEditing ? `${inputBgEnabled} ${inputBorderEnabled}` : `${inputBgDisabled} ${inputBorderDisabled}`} ${textClass} transition-colors duration-200`}
              />
            </div>
          </div>
        </div>

        <div className={`${sectionBgClass} p-6 rounded-lg mb-6 transition-colors duration-200`}>
          <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${textClass}`}>
            <FiHome className="text-blue-500" /> Address
          </h2>
          <div>
            <label className={`block text-sm font-medium ${labelClass} mb-1`}>Address</label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-2 border rounded-md ${isEditing ? `${inputBgEnabled} ${inputBorderEnabled}` : `${inputBgDisabled} ${inputBorderDisabled}`} ${textClass} transition-colors duration-200`}
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center gap-2 ${theme?.mode === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700'} text-white px-6 py-2 rounded-md transition-colors`}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave /> Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;
