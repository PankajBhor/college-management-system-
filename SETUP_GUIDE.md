# College Management System - Setup Guide

## Overview
The College Management System consists of:
- **Frontend**: React application running on `localhost:3000`
- **Backend**: Spring Boot application running on `localhost:8080`
- **Database**: MySQL database (`college_db`)

## Prerequisites

### 1. Install Required Software
- **Node.js**: Download from https://nodejs.org/ (LTS version recommended)
- **Java JDK 17+**: Download from https://www.oracle.com/java/technologies/downloads/
- **MySQL Server 8.0+**: Download from https://www.mysql.com/downloads/mysql/
- **Git**: Download from https://git-scm.com/

### 2. Verify Installations
```bash
# Check Node.js
node --version
npm --version

# Check Java
java -version

# Check MySQL
mysql --version
```

## Database Setup

### 1. Start MySQL Server
- **Windows**: MySQL should start automatically as a service
- **Mac**: Use `brew services start mysql@8.0` or MySQL Workbench
- **Linux**: Use `sudo systemctl start mysql`

### 2. Create Database (Optional - Will Auto-Create)
If you want to manually create the database:
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE college_db;

# Exit
EXIT;
```

**Note**: The application is configured with `createDatabaseIfNotExist=true`, so the database will be created automatically on first run if it doesn't exist.

### 3. Verify MySQL Connection
Make sure you can connect with username `root` and password `password` (or update `application.properties` with your credentials).

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd colllege-backend
```

### 2. Update Database Credentials (if needed)
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.username=root       # Your MySQL username
spring.datasource.password=password   # Your MySQL password
```

### 3. Build and Run with Maven
```bash
# Build the project
./mvnw clean package

# Run the application
./mvnw spring-boot:run
```

Or use your IDE (IntelliJ, VS Code, Eclipse):
- Right-click on `ColllegeBackendApplication.java`
- Select "Run" or "Run As" > "Java Application"

### 4. Verify Backend is Running
- Backend should start on `http://localhost:8080`
- You should see logs indicating:
  - Database connection success
  - Table creation/updates
  - Spring Boot started successfully

### 5. Check API Endpoints
- **Get All Enquiries**: `GET http://localhost:8080/api/enquiries`
- **Create Enquiry**: `POST http://localhost:8080/api/enquiries`

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm start
```

The frontend will automatically open at `http://localhost:3000`

### 4. Verify Frontend is Running
- React application should open in your browser
- Navigation should work
- You should see the Enquiry forms and list

## Database & Tables

The application will automatically create the following tables:

### Enquiries Table
```sql
CREATE TABLE `enquiries` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(255) NOT NULL,
  `middle_name` VARCHAR(255),
  `last_name` VARCHAR(255) NOT NULL,
  `personal_mobile_number` VARCHAR(10) NOT NULL,
  `guardian_mobile_number` VARCHAR(10) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `merit_details` VARCHAR(1000),
  `admission_for` VARCHAR(50) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `other_location` VARCHAR(255),
  `category` VARCHAR(50) NOT NULL,
  `branches_interested` LONGTEXT,
  `reference_faculty` VARCHAR(255),
  `status` VARCHAR(50) NOT NULL DEFAULT 'Pending',
  `enquiry_date` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Automatic Creation**: Don't worry about creating tables manually - Hibernate will do it automatically!

## API Endpoints

### Enquiry Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/enquiries` | Get all enquiries |
| GET | `/api/enquiries/{id}` | Get enquiry by ID |
| POST | `/api/enquiries` | Create new enquiry |
| PUT | `/api/enquiries/{id}` | Update enquiry |
| DELETE | `/api/enquiries/{id}` | Delete enquiry |
| GET | `/api/enquiries/by-status/{status}` | Get by status |
| GET | `/api/enquiries/by-category/{category}` | Get by category |
| GET | `/api/enquiries/by-admission/{admissionFor}` | Get by admission type |
| GET | `/api/enquiries/by-location/{location}` | Get by location |

## Enquiry Form Fields

The form accepts the following fields:

### Personal Information
- First Name (required)
- Middle Name (optional)
- Last Name (required)

### Contact Information
- Personal Mobile Number (required, 10 digits)
- Guardian Mobile Number (required, 10 digits)
- Email (required, valid format)

### Academic Information
- Class 10 Merit/Percentage (optional)
- Class 12 Merit/Percentage (optional)
- Other Merit/Percentage (optional)

### Admission Details
- Admission For (required): FY or DSY
- Category (required): General, OBC, SC, ST

### Location
- Location (required): Select from dropdown or specify "Other"
- Other Location (required if "Other" selected)

### Branches Interested
- Select branches in priority order (automatic priority assignment)
- Available branches: Computer, Civil, Mechanical, E&TC, Electrical, Mehatronics, IT

### Additional Information
- Reference Faculty (optional)

## Troubleshooting

### Database Connection Failed
1. Verify MySQL is running: `mysql -u root -p` (should connect)
2. Check credentials in `application.properties`
3. Ensure database exists or auto-create is enabled
4. Check MySQL port (default: 3306)

### Port Already in Use
```bash
# Change backend port in application.properties:
server.port=8081

# Change frontend port:
PORT=4000 npm start
```

### Tables Not Created
1. Check backend logs for Hibernate messages
2. Verify `spring.jpa.hibernate.ddl-auto=update` is set
3. Ensure database user has CREATE/ALTER privileges
4. Restart the application

### Frontend Cannot Connect to Backend
1. Verify backend is running on `http://localhost:8080`
2. Check CORS settings in `EnquiryController.java`
3. Check browser console for error messages
4. Verify API endpoint URL in services

### Dependencies Missing
```bash
# For frontend
npm install axios

# For backend - Maven should handle automatically
./mvnw install
```

## Running the Full Application

### Terminal 1 - Backend
```bash
cd colllege-backend
./mvnw spring-boot:run
# Backend runs on http://localhost:8080
```

### Terminal 2 - Frontend
```bash
cd frontend
npm start
# Frontend opens at http://localhost:3000
```

## Testing the Connection

1. Open browser at `http://localhost:3000`
2. Navigate to "Enquiry" > "New Enquiry"
3. Fill in the form with test data
4. Submit the enquiry
5. You should see success message
6. Check database to verify data was saved:

```bash
mysql -u root -p college_db
SELECT * FROM enquiries;
```

## Development Tips

### View Backend Logs
- IntelliJ: Built-in console shows logs
- Terminal: Logs display directly when running with maven/gradle

### View Frontend Logs
- Browser DevTools: F12 > Console tab
- Application runs with hot-reload (changes auto-refresh)

### Debug Mode
- Backend: Set breakpoints in Java code, use IDE debugger
- Frontend: Use React DevTools extension, browser DevTools

## Database Backup

```bash
# Export database
mysqldump -u root -p college_db > college_db_backup.sql

# Import database
mysql -u root -p college_db < college_db_backup.sql
```

## Security Notes

⚠️ **WARNING**: Current configuration is for development only!

Before deploying to production:
1. Change MySQL credentials
2. Enable HTTPS
3. Implement proper authentication
4. Update CORS settings
5. Use environment variables for sensitive data
6. Enable SSL/TLS encryption

---

For more information or issues, check the application logs and browser console for detailed error messages.
