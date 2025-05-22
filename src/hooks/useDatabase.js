import { useState, useEffect, useRef } from "react";
import { initDatabase, BC_CHANNEL_NAME } from "../config/database";
import { patientService } from "../services/patientService";

export const useDatabase = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patients, setPatients] = useState([]);
  const dbRef = useRef(null);
  const bcRef = useRef(null);

  // Initialize database and broadcast channel
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Initialize database
        const db = await initDatabase();
        dbRef.current = db;

        // Load initial data
        const initialPatients = await patientService.getAllPatients(db);
        setPatients(initialPatients);

        // Setup broadcast channel
        bcRef.current = new BroadcastChannel(BC_CHANNEL_NAME);
        bcRef.current.onmessage = async (event) => {
          if (event.data.type === "update") {
            const updatedPatients = await patientService.getAllPatients(db);
            setPatients(updatedPatients);
          }
        };

        setIsLoading(false);
      } catch (err) {
        console.error("Database initialization error:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    initialize();

    // Cleanup
    return () => {
      if (bcRef.current) {
        bcRef.current.close();
      }
    };
  }, []);

  // Register new patient
  const registerPatient = async (patientData) => {
    try {
      setError(null);
      const newPatient = await patientService.registerPatient(
        dbRef.current,
        patientData
      );
      setPatients((prev) => [newPatient, ...prev]);

      // Notify other tabs
      if (bcRef.current) {
        bcRef.current.postMessage({ type: "update" });
      }

      return newPatient;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Search patients
  const searchPatients = async (searchTerm) => {
    try {
      setError(null);
      const results = await patientService.searchPatients(
        dbRef.current,
        searchTerm
      );
      setPatients(results);
      return results;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Run custom query
  const runCustomQuery = async (query) => {
    try {
      setError(null);
      return await patientService.runCustomQuery(dbRef.current, query);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    isLoading,
    error,
    patients,
    registerPatient,
    searchPatients,
    runCustomQuery,
  };
};
