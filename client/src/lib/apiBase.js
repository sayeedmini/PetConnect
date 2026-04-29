const API_ORIGIN = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_BASE = `${API_ORIGIN}/api`;
export const API_AUTH_BASE = `${API_BASE}/auth`;
export const API_VETS_BASE = `${API_BASE}/vets`;
export const API_APPOINTMENTS_BASE = `${API_BASE}/appointments`;

export default API_ORIGIN;
