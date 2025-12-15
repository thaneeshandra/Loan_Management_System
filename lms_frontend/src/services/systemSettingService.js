import api from './api';

/**
 * Fetch all system settings
 * @returns {Promise} Promise with system settings data
 */
export const fetchAllSettings = async () => {
  try {
    console.log('Fetching all system settings...');
    
    try {
      const response = await api.get('/api/settings');
      console.log('Settings fetched successfully:', response.data);
      return response.data;
    } catch (apiError) {
      console.log('⚠️ API error in fetchAllSettings, returning mock data');
      
      // Return mock data for UI development purposes
      return [
        { key: 'systemName', value: 'Loan Management System' },
        { key: 'systemVersion', value: '1.0.0' },
        { key: 'maintenanceMode', value: 'false' },
        { key: 'maxLoanAmount', value: '100000' },
        { key: 'minLoanAmount', value: '1000' },
        { key: 'defaultInterestRate', value: '5.5' },
        // Add more mock settings as needed
      ];
    }
  } catch (error) {
    console.error('Error in fetchAllSettings:', error.message);
    throw error;
  }
};

/**
 * Update system settings
 * @param {Array} settings - Array of {key, value} objects for settings to update
 * @returns {Promise} Promise with updated system settings
 */
export const updateSettings = async (settings) => {
  try {
    console.log('Updating settings:', settings);
    
    // If we have multiple settings to update, use the batch endpoint
    if (Array.isArray(settings) && settings.length > 1) {
      const response = await api.put('/api/settings/batch', settings);
      console.log('Batch settings updated successfully');
      return response.data;
    } 
    
    // If it's a single setting or object
    const settingToUpdate = Array.isArray(settings) ? settings[0] : settings;
    const response = await api.put('/api/settings', settingToUpdate);
    console.log('Setting updated successfully');
    return response.data;
  } catch (error) {
    console.error('Error updating settings:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get single setting by key with default value
 * @param {String} key - Setting key to retrieve
 * @param {*} defaultValue - Default value if setting doesn't exist
 * @returns {Promise} Promise with setting value
 */
export const getSetting = async (key, defaultValue) => {
  try {
    console.log(`Fetching setting: ${key}`);
    const settings = await fetchAllSettings();
    
    // Find the setting in the array
    if (Array.isArray(settings)) {
      const setting = settings.find(s => s.key === key);
      return setting ? setting.value : defaultValue;
    }
    
    // If settings is an object with direct key access
    return settings[key] !== undefined ? settings[key] : defaultValue;
  } catch (error) {
    console.error(`Error fetching setting ${key}:`, error.message);
    return defaultValue;
  }
};