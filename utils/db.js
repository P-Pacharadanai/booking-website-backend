import * as pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg.default;

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});

export { pool };
