
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

console.log("MySQL diagnostic:", {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  passwordLoaded: Boolean(process.env.MYSQL_PASSWORD),
  passwordLength: process.env.MYSQL_PASSWORD?.length,
});

export const env = {
  port: Number(process.env.PORT) || 5000,

  clientUrl:
    process.env.CLIENT_URL || "http://localhost:5173",

  nodeEnv:
    process.env.NODE_ENV || "development",

  auth: {
    secret:
      process.env.AUTH_SECRET ||
      "change-this-to-a-long-random-secret",

    tokenTtlHours:
      Number(process.env.AUTH_TOKEN_TTL_HOURS) || 12,
  },

  mysql: {
    host:
      process.env.MYSQL_HOST || "127.0.0.1",

    port:
      Number(process.env.MYSQL_PORT) || 3306,

    database:
      process.env.MYSQL_DATABASE || "anbira_db",

    user:
      process.env.MYSQL_USER || "root",

    password:
      process.env.MYSQL_PASSWORD || "",
  },
};
