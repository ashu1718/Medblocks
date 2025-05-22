# Patient Registration App

A frontend-only patient registration application built with React and PGlite for data storage. This application demonstrates how to build a persistent, multi-tab synchronized database application using only frontend technologies.

## Features

- Register new patients with name, date of birth, gender, and contact information
- View all registered patients in a sortable table
- Run raw SQL queries against the patient database
- Data persistence across page refreshes
- Real-time synchronization across multiple browser tabs
- Modern, responsive UI

## Technical Details

- Built with React and PGlite (a SQLite-compatible database that runs in the browser)
- Uses BroadcastChannel API for cross-tab communication
- Data is stored in IndexedDB for persistence
- No backend required - everything runs in the browser

## Setup Instructions

1. Clone the repository:

```bash
git clone <repository-url>
cd patient-registration
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Registering a Patient

1. Fill out the registration form with:
   - Full Name
   - Date of Birth
   - Gender (Male/Female/Other)
   - Contact Information (Phone or Email)
2. Click "Register Patient" to save the record

### Viewing Patients

- All registered patients are displayed in a table below the registration form
- Patients are sorted by registration date (newest first)
- The table is scrollable if there are many records

### Running SQL Queries

1. Enter your SQL query in the text area
2. Click "Run Query" to execute
3. Results will be displayed in a table below
4. Example queries:

   ```sql
   -- Get all patients
   SELECT * FROM patients;

   -- Search by name
   SELECT * FROM patients WHERE name LIKE '%John%';

   -- Get patients by gender
   SELECT * FROM patients WHERE gender = 'Female';
   ```

## Multi-tab Support

- The application automatically synchronizes data across multiple tabs
- When you register a patient in one tab, all other tabs will update automatically
- Data persists even after closing and reopening the browser

## Development Challenges and Solutions

1. **Data Persistence**

   - Challenge: Ensuring data survives page refreshes
   - Solution: Using PGlite with IndexedDB backend for persistent storage

2. **Cross-tab Synchronization**

   - Challenge: Keeping data in sync across multiple tabs
   - Solution: Implemented BroadcastChannel API for real-time updates

3. **SQL Query Safety**

   - Challenge: Preventing SQL injection in raw queries
   - Solution: PGlite provides built-in parameterized query support

4. **UI/UX**
   - Challenge: Creating an intuitive interface for both registration and SQL queries
   - Solution: Implemented a clean, responsive design with clear sections

## Deployment

The application can be deployed to any static hosting service. For example, using Vercel:

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Deploy:

```bash
vercel
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
