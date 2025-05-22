import React, { useState } from "react";
import { useDatabase } from "./hooks/useDatabase";

const styles = {
  container: {
    maxWidth: 800,
    margin: "auto",
    padding: 20,
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: 30,
    color: "#2c3e50",
  },
  form: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 8,
    marginBottom: 30,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    display: "block",
    marginBottom: 5,
    color: "#495057",
  },
  input: {
    width: "100%",
    padding: 8,
    borderRadius: 4,
    border: "1px solid #ced4da",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 16,
    width: "100%",
  },
  error: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: 10,
    borderRadius: 4,
    marginBottom: 20,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 20,
  },
  th: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    textAlign: "left",
    borderBottom: "2px solid #dee2e6",
  },
  td: {
    padding: 12,
    borderBottom: "1px solid #dee2e6",
  },
  searchBox: {
    marginBottom: 20,
  },
  sqlBox: {
    marginTop: 40,
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  textarea: {
    width: "100%",
    height: 100,
    padding: 8,
    marginBottom: 10,
    borderRadius: 4,
    border: "1px solid #ced4da",
    fontFamily: "monospace",
  },
};

export default function App() {
  const {
    isLoading,
    error,
    patients,
    registerPatient,
    searchPatients,
    runCustomQuery,
  } = useDatabase();

  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "Male",
    contact: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sqlQuery, setSqlQuery] = useState(`SELECT * FROM patients;`);
  const [queryResult, setQueryResult] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerPatient(form);
      setForm({ name: "", dob: "", gender: "Male", contact: "" });
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      await searchPatients(searchTerm);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const handleSqlQuery = async () => {
    try {
      const result = await runCustomQuery(sqlQuery);
      setQueryResult(result);
    } catch (err) {
      console.error("Query failed:", err);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: "center", padding: 40 }}>
          <h2>Initializing Database...</h2>
          <p>Please wait while we set up your local database.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Patient Registration System</h1>

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Name</label>
          <input
            required
            name="name"
            value={form.name}
            onChange={handleInputChange}
            style={styles.input}
            placeholder="Full Name"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Date of Birth</label>
          <input
            required
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleInputChange}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleInputChange}
            style={styles.input}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Contact</label>
          <input
            name="contact"
            value={form.contact}
            onChange={handleInputChange}
            style={styles.input}
            placeholder="Phone or Email"
          />
        </div>

        <button type="submit" style={styles.button}>
          Register Patient
        </button>
      </form>

      <div style={styles.searchBox}>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.input}
            placeholder="Search patients..."
          />
        </form>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>DOB</th>
            <th style={styles.th}>Gender</th>
            <th style={styles.th}>Contact</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(({ id, name, dob, gender, contact }) => (
            <tr key={id}>
              <td style={styles.td}>{name}</td>
              <td style={styles.td}>{dob}</td>
              <td style={styles.td}>{gender}</td>
              <td style={styles.td}>{contact}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={styles.sqlBox}>
        <h2>Run SQL Query</h2>
        <textarea
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
          style={styles.textarea}
        />
        <button onClick={handleSqlQuery} style={styles.button}>
          Execute Query
        </button>

        {queryResult.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <h3>Query Results</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  {Object.keys(queryResult[0]).map((key) => (
                    <th key={key} style={styles.th}>
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {queryResult.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((value, j) => (
                      <td key={j} style={styles.td}>
                        {value?.toString()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
