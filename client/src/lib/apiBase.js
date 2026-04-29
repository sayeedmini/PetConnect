const PROD_API_ORIGIN = 'https://petconnect-df33.onrender.com';

export const API_ORIGIN =
	import.meta.env.VITE_API_URL ||
	(import.meta.env.DEV ? 'http://localhost:5000' : PROD_API_ORIGIN);

export const API_BASE = `${API_ORIGIN}/api`;
export const API_AUTH_BASE = `${API_BASE}/auth`;
export const API_VETS_BASE = `${API_BASE}/vets`;
export const API_APPOINTMENTS_BASE = `${API_BASE}/appointments`;

export default API_ORIGIN;
