import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api'; // Replace with your Express server URL

export const loginUser = async (credential, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/session`, {
      credential,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
