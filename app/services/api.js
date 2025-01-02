import axios from 'axios';

// Replace 'YOUR_LOCAL_IP' with your machine's local network IP address.
const API_URL = 'http://127.0.0.1:8000/api/';

// Fetch details
export const getDetails = async () => {
  try {
    const response = await axios.get(`${API_URL}details/`);
    console.log(response.data);
    return response.data; // Return the data fetched from the backend
  } catch (error) {
    console.error('Error fetching details:', error);
    throw error;
  }
};

// Create a new profile
export const createProfile = async (profileData) => {
  try {
    const response = await axios.post(`${API_URL}profiles/`, profileData);
    console.log('Profile created:', response.data);
    return response.data; // Return the created profile data
  } catch (error) {
    console.error('Error creating profile:', error.response || error.message);
    throw error;
  }
};

// Get profiles
export const getProfiles = async () => {
  try {
    const response = await axios.get(`${API_URL}profiles/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching profiles:', error);
    throw error;
  }
};

// Delete a profile by ID
export const deleteProfile = async (profileId) => {
  try {
    const response = await fetch(`${API_URL}/${profileId}/delete`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete profile');
    }
    return await response.json();  // Assuming response contains a success message
  } catch (error) {
    console.error('Error deleting profile:', error);
    throw error;
  }
};

// Update a profile by ID
export const updateProfile = async (profileId, updatedData) => {
  try {
    const response = await fetch(`${API_URL}/${profileId}/update`, {
      method: 'PATCH',  // Use PATCH for partial updates or PUT for full updates
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    return await response.json();  // Assuming response contains the updated profile data
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};