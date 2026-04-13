import "dotenv/config";

const getRequired = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const getOptional = (key, defaultValue) => process.env[key] || defaultValue;

const toNumber = (value, defaultValue) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

const env = Object.freeze({
  PORT: toNumber(getOptional("PORT", 3000), 3000),
  NODE_ENV: getOptional("NODE_ENV", "development"),

  MONGO_URI: getRequired("MONGO_URI"),

  JWT_ACCESS_SECRET: getRequired("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: getRequired("JWT_REFRESH_SECRET"),
  ACCESS_TOKEN_EXP: getOptional("ACCESS_TOKEN_EXP", "15m"),
  REFRESH_TOKEN_EXP: getOptional("REFRESH_TOKEN_EXP", "7d"),

  LOG_LEVEL: getOptional("LOG_LEVEL", null),
  GIT_COMMIT: getOptional("GIT_COMMIT", null),

  REDIS_URL: getOptional("REDIS_URL", "redis://localhost:6379"),

  EMAIL_USER: getRequired("EMAIL_USER"),
  EMAIL_PASS: getRequired("EMAIL_PASS"),

  GOOGLE_CLIENT_ID: getRequired("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getRequired("GOOGLE_CLIENT_SECRET"),
  FRONTEND_URL: getOptional("FRONTEND_URL", "http://localhost:3000"),
});

export default env;