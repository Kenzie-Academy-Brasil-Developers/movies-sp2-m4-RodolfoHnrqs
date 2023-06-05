import { Client } from "pg";
import "dotenv/config";

const client = new Client({
  host: process.env.HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const connectDatabase = async () => {
  await client.connect();
  console.log("Database connected.");
};

export { client, connectDatabase };