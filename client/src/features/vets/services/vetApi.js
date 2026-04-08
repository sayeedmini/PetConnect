import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/vets';

export const getAllVets = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const getVetById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

export const createVet = async (vetData) => {
  const response = await axios.post(API_BASE_URL, vetData);
  return response.data;
};