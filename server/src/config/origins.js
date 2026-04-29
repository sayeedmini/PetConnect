const DEFAULT_ORIGINS = ['http://localhost:5173'];

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

module.exports = {
  getAllowedOrigins,
};
