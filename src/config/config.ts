export default () => ({
  PORT: parseInt(process.env.PORT, 10) || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  ACCESS_SECRET: process.env.ACCESS_SECRET,
  REFRESH_SECRET: process.env.REFRESH_SECRET,
  REDIS_URL: process.env.REDIS_URL,
  REDIS_TTL: parseInt(process.env.REDIS_TTL, 10),
  REDIS_MAX: parseInt(process.env.REDIS_MAX, 10),
  REDIS_USERNAME: process.env.REDIS_USERNAME,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
});
