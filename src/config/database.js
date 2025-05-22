import { PGlite } from "@electric-sql/pglite";

export const DB_NAME = "patient_registration_db";
export const TABLE_NAME = "patients";
export const BC_CHANNEL_NAME = "patient-registration-channel";

// Database schema
export const PATIENT_SCHEMA = `
  CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    dob TEXT NOT NULL,
    gender TEXT CHECK(gender IN ('Male','Female','Other')) NOT NULL,
    contact TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

// Initialize database
export const initDatabase = async () => {
  try {
    const db = new PGlite({
      database: DB_NAME,
      debug: true,
      synchronous: true,
    });

    await db.ready;
    await db.exec(PATIENT_SCHEMA);

    return db;
  } catch (error) {
    console.error("Database initialization error:", error);
    throw new Error("Failed to initialize database: " + error.message);
  }
};
