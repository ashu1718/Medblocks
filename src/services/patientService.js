import { TABLE_NAME } from "../config/database";

export const patientService = {
  // Get all patients
  getAllPatients: async (db) => {
    try {
      const result = await db.query(`
        SELECT * FROM ${TABLE_NAME} 
        ORDER BY created_at DESC
      `);
      return result.rows;
    } catch (error) {
      console.error("Error fetching patients:", error);
      throw new Error("Failed to fetch patients: " + error.message);
    }
  },

  // Register new patient
  registerPatient: async (db, patientData) => {
    try {
      const result = await db.query(
        `
        INSERT INTO ${TABLE_NAME} (name, dob, gender, contact) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *
      `,
        [
          patientData.name,
          patientData.dob,
          patientData.gender,
          patientData.contact,
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error registering patient:", error);
      throw new Error("Failed to register patient: " + error.message);
    }
  },

  // Search patients
  searchPatients: async (db, searchTerm) => {
    try {
      const result = await db.query(
        `
        SELECT * FROM ${TABLE_NAME}
        WHERE name ILIKE $1 
        OR contact ILIKE $1
        ORDER BY created_at DESC
      `,
        [`%${searchTerm}%`]
      );
      return result.rows;
    } catch (error) {
      console.error("Error searching patients:", error);
      throw new Error("Failed to search patients: " + error.message);
    }
  },

  // Run custom query
  runCustomQuery: async (db, query) => {
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error running custom query:", error);
      throw new Error("Failed to run query: " + error.message);
    }
  },
};
