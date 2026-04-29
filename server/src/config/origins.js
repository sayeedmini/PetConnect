const DEFAULT_ORIGINS = ['http://localhost:5173'];

const isVercelOrigin = (origin) => {
  try {
    const hostname = new URL(origin).hostname;
    return hostname === 'vercel.app' || hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
};

const parseOrigins = (...rawValues) => {
  const values = rawValues
    .filter(Boolean)
    .flatMap((value) => String(value).split(','))
    .map((origin) => origin.trim())
    .filter(Boolean);

  return values.length > 0 ? [...new Set(values)] : DEFAULT_ORIGINS;
};

const getAllowedOrigins = () =>
  parseOrigins(process.env.CLIENT_URLS, process.env.CLIENT_URL, process.env.FRONTEND_URL);

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  return getAllowedOrigins().includes(origin) || isVercelOrigin(origin);
};

module.exports = {
  getAllowedOrigins,
  isAllowedOrigin,
};
