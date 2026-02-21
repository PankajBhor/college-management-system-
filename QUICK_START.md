# Quick Start Guide - College Management System

## Quick Setup (5 minutes)

### Prerequisites
- MySQL running locally
- Java 17+ installed
- Node.js installed
- Go to project root directory

### Step 1: Start Backend (Terminal 1)
```bash
cd colllege-backend
./mvnw spring-boot:run
```
✓ Wait for message: "Started ColllegeBackendApplication in..."
✓ Backend runs on http://localhost:8080

### Step 2: Start Frontend (Terminal 2)
```bash
cd frontend
npm install
npm start
```
✓ Browser opens automatically at http://localhost:3000

### Step 3: Test the App
1. Navigate to "Enquiry" section
2. Click "New Enquiry"
3. Fill in the form:
   - First Name: `John`
   - Last Name: `Doe`
   - Personal Mobile: `9876543210`
   - Guardian Mobile: `9876543220`
   - Email: `john@example.com`
   - Admission For: `FY`
   - Category: `General`
   - Location: `Pune`
   - Select 2-3 branches (in priority order)
4. Click "Submit Enquiry"
5. See success message!

## What's Happening Behind the Scenes

```
Frontend (React)
    ↓ API Call (JSON)
Backend (Spring Boot)
    ↓ Query
Database (MySQL)
    ↓ Creates/Updates Tables Automatically
    ↓ Returns Data
Backend (Spring Boot)
    ↓ Returns JSON Response
Frontend (React)
    ↓ Displays Data
```

## Database Auto-Creation

✓ **Tables are created automatically!** No manual SQL needed.

When the backend starts, it will:
1. Connect to MySQL
2. Create `college_db` database (if not exists)
3. Create `enquiries` table with all fields
4. Ready for enquiry submissions!

To verify:
```bash
mysql -u root -p
use college_db;
SHOW TABLES;
SELECT * FROM enquiries;
```

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Port 3000 already in use" | Change port: `PORT=4000 npm start` |
| "Port 8080 already in use" | Change in `application.properties`: `server.port=8081` |
| "Cannot connect to database" | Ensure MySQL is running: `mysql -u root -p` |
| "Table not created" | Check backend logs for errors, restart backend |
| "API returns 404" | Verify backend is running on http://localhost:8080 |
| "Form submission fails" | Check browser console (F12) for error details |

## Useful URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/enquiries
- **Browser DevTools**: F12
- **MySQL**: `mysql -u root -p`

## File Structure

```
college-management-system/
├── colllege-backend/          # Spring Boot Backend
│   ├── src/main/java/        # Java code
│   ├── src/main/resources/   # application.properties
│   └── pom.xml               # Dependencies
├── frontend/                  # React Frontend
│   ├── src/
│   │   ├── pages/enquiry/    # Enquiry forms
│   │   ├── services/         # API calls
│   │   └── components/       # React components
│   └── package.json          # Dependencies
└── SETUP_GUIDE.md            # Detailed setup
```

## Key Features Implemented

✓ **Frontend Form Fields**:
- Personal info (first, middle, last name)
- Contact (personal & guardian mobile, email)
- Academic (10th, 12th, other merit)
- Admission type (FY/DSY)
- Location (dropdown + other option)
- Category (General/OBC/SC/ST)
- Branches (multi-select with priority)
- Reference faculty

✓ **Backend Features**:
- REST API endpoints for CRUD operations
- Auto-create tables with Hibernate
- Validation on inputs
- Filter by status/category/admission/location
- CORS enabled for frontend communication

✓ **Database**:
- Auto-creates `enquiries` table
- Stores all enquiry information
- Handles JSON data for branches and merit

## API Examples

### Get all enquiries
```bash
curl http://localhost:8080/api/enquiries
```

### Create enquiry
```bash
curl -X POST http://localhost:8080/api/enquiries \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "personalMobileNumber": "9876543210",
    "guardianMobileNumber": "9876543220",
    "admissionFor": "FY",
    "category": "General",
    "location": "Pune",
    "branchesInterested": "[{\"branch\":\"Computer\",\"priority\":1}]",
    "enquiryDate": "2026-02-21",
    "status": "Pending"
  }'
```

## Next Steps

1. ✓ Backend is running
2. ✓ Frontend is running
3. ✓ Database auto-created
4. ✓ Enquiries can be submitted

Start adding enquiries! The system is fully functional.

---

**Need help?** Check `SETUP_GUIDE.md` for detailed instructions.
