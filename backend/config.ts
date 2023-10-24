import dotenv from "dotenv";
dotenv.config();

const PORT_ENV = process.env.PORT;
const DATABASE_ENV = process.env.DATABASE;
const JWT_SECRET_ENV = process.env.JWT_SECRET;

const getPort = () => {
  if (!PORT_ENV) throw new Error("PORT_ENV not found");
  return PORT_ENV;
};

const getDatabase = () => {
  if (!DATABASE_ENV) throw new Error("DATABASE_ENV not found");
  return DATABASE_ENV;
};

const getJwtSecret = () => {
  if (!JWT_SECRET_ENV) throw new Error("JWT_SECRET_ENV not found");
  return JWT_SECRET_ENV;
};

export const PORT = getPort();
export const DATABASE = getDatabase();
export const JWT_SECRET = getJwtSecret();
