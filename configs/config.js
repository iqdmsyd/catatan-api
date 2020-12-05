module.exports = {
  ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  URL: process.env.BASE_URL || "http://localhost:3000",
  MONGODB_URI:
    process.env.MONGODB_URI ||
    "mongodb+srv://catatanAPI:Qxj5Rj5VV7agQe6Q@sandbox.u6jnv.mongodb.net/catatan_api",
  JWT_SECRET: process.env.JWT_SECRET || "secret0",
};