# Database Troubleshooting Guide

## Step 1: Verify MySQL is Running

### Windows:
```powershell
# Check if MySQL service is running
Get-Service MySQL80   # or MySQL57, MySQL56, depending on version

# If not running, start it:
Start-Service MySQL80
```

### Verify MySQL Connection:
```powershell
mysql -u root -p
# Enter password when prompted (default: password)
# You should see: mysql>
```

---

## Step 2: Verify Database & Table Exist

```sql
-- List all databases
SHOW DATABASES;

-- Should see: college_db

-- Use the database
USE college_db;

-- Show tables
SHOW TABLES;

-- Should see: enquiries table

-- Check table structure
DESC enquiries;

-- Check if any data exists
SELECT COUNT(*) FROM enquiries;
```

---

## Step 3: Check Backend Logs

When you start the backend with:
```bash
cd colllege-backend
./mvnw spring-boot:run
```

**Look for these messages:**
- ✅ "Started ColllegeBackendApplication" - Backend started successfully
- ✅ "HHH000424" - Hibernate message about DDL execution
- ❌ "Connection refused" - MySQL not running
- ❌ "Access denied" - Wrong username/password
- ❌ "Unknown database 'college_db'" - Database not created

---

## Step 4: Test API Endpoint with cURL

```bash
# Test creating an enquiry
curl -X POST http://localhost:8080/api/enquiries \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "personalMobileNumber": "9876543210",
    "guardianMobileNumber": "9876543211",
    "email": "test@example.com",
    "admissionFor": "FY",
    "category": "General",
    "location": "Pune",
    "branchesInterested": "[{\"branch\":\"Computer\",\"priority\":1}]",
    "enquiryDate": "2026-02-21",
    "status": "Pending"
  }'

# Should return 201 with the created enquiry data
```

---

## Step 5: Database Configuration

**Current config in application.properties:**
```
spring.datasource.url=jdbc:mysql://localhost:3306/college_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update
```

**If you have a DIFFERENT MySQL password:**

Edit `application.properties` and change:
```properties
spring.datasource.password=YOUR_ACTUAL_PASSWORD
```

---

## Step 6: Common Issues & Fixes

### Issue 1: "Connection refused"
- **Cause**: MySQL not running
- **Fix**: Start MySQL service
```powershell
# Windows
Start-Service MySQL80

# Or use Services app:
# Press Win + R → services.msc → Find MySQL → Start
```

### Issue 2: "Access denied for user 'root'@'localhost'"
- **Cause**: Wrong password
- **Fix**: Update `spring.datasource.password` in application.properties

### Issue 3: "Unknown database 'college_db'"
- **Cause**: Database wasn't created
- **Fix**: Create manually:
```sql
CREATE DATABASE college_db;
USE college_db;
```

### Issue 4: Table not created automatically
- **Cause**: `ddl-auto=update` not working
- **Fix**: Create table manually:
```sql
CREATE TABLE enquiries (
  id BIGINT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(255) NOT NULL,
  middle_name VARCHAR(255),
  last_name VARCHAR(255) NOT NULL,
  personal_mobile_number VARCHAR(10) NOT NULL,
  guardian_mobile_number VARCHAR(10) NOT NULL,
  email VARCHAR(255) NOT NULL,
  merit_details VARCHAR(1000),
  admission_for VARCHAR(50) NOT NULL,
  location VARCHAR(255) NOT NULL,
  other_location VARCHAR(255),
  category VARCHAR(50) NOT NULL,
  branches_interested LONGTEXT,
  reference_faculty VARCHAR(255),
  status VARCHAR(50) NOT NULL,
  enquiry_date VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (id)
);
```

---

## Step 7: Verify Frontend is Sending Correct Data

Open browser DevTools (F12):

1. Go to **Network** tab
2. Create an enquiry from the form
3. Look for POST request to `http://localhost:8080/api/enquiries`
4. Check **Request** tab - verify JSON being sent
5. Check **Response** tab - look for errors or success (201 status)

**Expected successful response:**
```json
{
  "id": 1,
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "status": "Pending",
  ...
}
```

---

## Step 8: Test with Postman or cURL

**Create enquiry with all required fields:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "personalMobileNumber": "9876543210",
  "guardianMobileNumber": "9876543220",
  "email": "john@example.com",
  "merit": "{\"class10\": \"85\", \"class12\": \"88\"}",
  "admissionFor": "FY",
  "location": "Pune",
  "category": "General",
  "branchesInterested": "[{\"branch\":\"Computer\",\"priority\":1}]",
  "enquiryDate": "2026-02-21",
  "status": "Pending"
}
```

---

## Quick Checklist:

- [ ] MySQL service is running
- [ ] Can connect to MySQL with: `mysql -u root -p`
- [ ] Database `college_db` exists
- [ ] Table `enquiries` exists (check with: `SHOW TABLES;`)
- [ ] Backend is running (see "Started ColllegeBackendApplication")
- [ ] No connection errors in backend logs
- [ ] Frontend is hitting correct API URL: `http://localhost:8080/api/enquiries`
- [ ] All required fields filled in form
- [ ] Response shows 201 status code (Created)
- [ ] Test with cURL/Postman confirms API works

---

## Still Not Working?

1. **Restart MySQL**:
```powershell
Stop-Service MySQL80
Start-Service MySQL80
```

2. **Rebuild backend**:
```bash
cd colllege-backend
./mvnw clean compile
./mvnw spring-boot:run
```

3. **Clear all data and restart**:
```sql
DROP DATABASE college_db;
# Restart backend → it will auto-create the database and table
```

4. **Check backend logs for actual error message** - this is the most important!

