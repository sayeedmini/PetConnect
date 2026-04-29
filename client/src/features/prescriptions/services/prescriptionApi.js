import axios from 'axios';
import { getToken } from '../../auth/utils/auth';
import { API_BASE } from '../../../lib/apiBase';

const API_BASE_URL = API_BASE;

const getAuthHeaders = () => {
  const token = getToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

export const getPrescriptionByAppointment = async (appointmentId) => {
  const response = await axios.get(`${API_BASE_URL}/prescriptions/appointments/${appointmentId}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

export const savePrescriptionByAppointment = async (appointmentId, payload) => {
  const response = await axios.put(
    `${API_BASE_URL}/prescriptions/appointments/${appointmentId}`,
    payload,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const getMyPrescriptions = async (petName = '') => {
  const response = await axios.get(`${API_BASE_URL}/prescriptions/my`, {
    params: petName ? { petName } : {},
    headers: getAuthHeaders(),
  });

  return response.data;
};

export const verifyPrescription = async (verificationCode) => {
  const response = await axios.get(`${API_BASE_URL}/prescriptions/verify/${verificationCode}`);
  return response.data;
};
