# Admission Module Integration Guide

## Installation & Setup

### Backend Setup

#### 1. Build and Run the Backend
```bash
cd colllege-backend
mvn clean install
mvn spring-boot:run
```

#### 2. Database Setup
The application will automatically create tables if using `spring.jpa.hibernate.ddl-auto=update`

Manual table creation (optional):
```sql
CREATE DATABASE IF NOT EXISTS college_db;
USE college_db;

-- Tables will be auto-created by JPA/Hibernate
-- Or run the SQL scripts provided in the database folder
```

#### 3. Initialize Default Documents
After the server starts, call this endpoint to populate default documents:
```bash
curl -X POST http://localhost:8080/api/documents/initialize \
  -H "Content-Type: application/json"
```

### Frontend Setup

#### 1. Install Dependencies
```bash
cd frontend
npm install
```

#### 2. Update menuData.js
Add the Admissions menu item:

```javascript
// In src/data/menuData.js
export const menuData = [
  // ... existing menu items
  {
    id: 'admissions',
    name: 'Admissions',
    icon: '📋',
    route: '/admissions'
  }
];
```

#### 3. Update DashboardLayout.jsx
Add the Admissions route:

```jsx
import { AdmissionForm } from '../pages/admissions';

// In the router section:
<Routes>
  {/* ... existing routes */}
  <Route path="/admissions" element={<AdmissionForm />} />
</Routes>
```

#### 4. Update Sidebar.jsx
Ensure the sidebar includes the admissions link (it should automatically if you updated menuData)

#### 5. Run the Frontend
```bash
npm start
```

## Configuration

### Backend Configuration (application.properties)

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/college_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# Server Configuration
server.port=8080

# CORS Configuration
spring.web.cors.allowed-origins=http://localhost:3000
```

### Frontend Configuration

```javascript
// In .env file (create if doesn't exist)
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENABLE_MOCK_DATA=false
```

## File Structure

### Backend Structure
```
colllege-backend/
├── src/main/java/com/college/colllege_backend/
│   ├── entity/
│   │   ├── FYAdmission.java
│   │   ├── DSYAdmission.java
│   │   └── DocumentChecklist.java
│   ├── dto/
│   │   ├── FYAdmissionRequestDTO.java
│   │   ├── DSYAdmissionRequestDTO.java
│   │   └── DocumentChecklistDTO.java
│   ├── controller/
│   │   ├── FYAdmissionController.java
│   │   ├── DSYAdmissionController.java
│   │   └── DocumentChecklistController.java
│   ├── service/
│   │   ├── FYAdmissionService.java
│   │   ├── DSYAdmissionService.java
│   │   ├── DocumentChecklistServiceInterface.java
│   │   └── impl/
│   │       ├── FYAdmissionServiceImpl.java
│   │       ├── DSYAdmissionServiceImpl.java
│   │       └── DocumentChecklistServiceImpl.java
│   └── repository/
│       ├── FYAdmissionRepository.java
│       ├── DSYAdmissionRepository.java
│       └── DocumentChecklistRepository.java
├── pom.xml
└── src/main/resources/
    └── application.properties
```

### Frontend Structure
```
frontend/src/
├── pages/admissions/
│   ├── AdmissionForm.jsx
│   ├── AdmissionForm.css
│   ├── FYAdmissionForm.jsx
│   ├── FYAdmissionForm.css
│   ├── DSYAdmissionForm.jsx
│   ├── DSYAdmissionForm.css
│   ├── DocumentChecklist.jsx
│   ├── DocumentChecklist.css
│   ├── index.jsx
│   ├── ADMISSIONS_README.md
│   └── SETUP_GUIDE.md
├── services/
│   └── admissionService.js
├── data/
│   └── menuData.js
└── components/
    └── Sidebar.jsx
```

## Testing the Admission Module

### Test FY Admission Creation
```bash
curl -X POST http://localhost:8080/api/admissions/fy \
  -H "Content-Type: application/json" \
  -d '{
    "applicantName": "John Doe",
    "fatherName": "James Doe",
    "motherName": "Jane Doe",
    "villageCity": "Junnar",
    "tal": "Junnar",
    "dist": "Pune",
    "pinCode": "410504",
    "mobileNo": "9876543210",
    "studentEmail": "john@example.com",
    "gender": "Male",
    "dateOfBirth": "2005-01-15",
    "program": "1. Civil Engineering",
    "admissionType": "CAP-1"
  }'
```

### Test DSY Admission Creation
```bash
curl -X POST http://localhost:8080/api/admissions/dsy \
  -H "Content-Type: application/json" \
  -d '{
    "applicantName": "Jane Smith",
    "localAddress": "123 Main St, Pune",
    "permanentAddress": "456 Second St, Nasik",
    "mobileNo": "9876543211",
    "studentEmail": "jane@example.com",
    "gender": "Female",
    "dateOfBirth": "2004-05-20",
    "program": "2. Computer Engineering",
    "admissionType": "CAP-2"
  }'
```

### Get Documents
```bash
curl http://localhost:8080/api/documents/FY
curl http://localhost:8080/api/documents/DSY
```

## Troubleshooting

### Database Connection Error
**Error:** `Access denied for user 'root'@'localhost'`
**Solution:** 
- Check MySQL is running
- Verify root password in application.properties
- Ensure database exists: `CREATE DATABASE college_db;`

### Frontend Can't Connect to Backend
**Error:** `CORS error` or `404 Not Found`
**Solution:**
- Verify backend is running on port 8080
- Check REACT_APP_API_URL in .env
- Ensure CORS is enabled in SecurityConfig

### Documents Not Loading
**Error:** Empty document list in forms
**Solution:**
- Call `/api/documents/initialize` endpoint
- Check database has DocumentChecklist records
- Verify DocumentChecklistService is initialized

### Form Submission Fails
**Error:** `400 Bad Request` or `500 Internal Server Error`
**Solution:**
- Check browser console for validation errors
- Verify all required fields are filled
- Check backend logs for stack trace
- Ensure DTO validations pass

## Security Checklist

- [ ] Implement JWT authentication for admission endpoints
- [ ] Add role-based access control (only office staff can approve)
- [ ] Validate all user inputs on backend
- [ ] Encrypt sensitive data in transit (HTTPS)
- [ ] Implement rate limiting on submissions
- [ ] Add audit logging for all admission operations
- [ ] Securely store files/documents
- [ ] Implement CSRF protection
- [ ] Add input sanitization

## Performance Optimization

### Backend
- Add database indexes on frequently queried fields
- Implement pagination for listing endpoints
- Cache document checklist data
- Use connection pooling (HikariCP is already configured)

### Frontend
- Implement lazy loading for large forms
- Memoize components to prevent unnecessary re-renders
- Optimize images and assets
- Implement form data auto-save

## Monitoring

### Backend Monitoring
- Monitor application logs at `/var/log/college-backend.log`
- Check database connection pool status
- Monitor Hibernate query performance

### Frontend Monitoring
- Use browser DevTools to check API calls
- Monitor console for errors
- Track form submission metrics

## Backup & Recovery

### Database Backup
```bash
mysqldump -u root -p college_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Database Restore
```bash
mysql -u root -p college_db < backup.sql
```

## Additional Resources

- Read: [ADMISSIONS_README.md](ADMISSIONS_README.md) for complete module documentation
- Check: Backend controllers for API details
- Review: Entity classes for database schema
- Examine: Frontend components for UI/UX implementation

## Contact & Support

For issues or questions:
1. Check the troubleshooting section above
2. Review application logs
3. Contact IT support team
4. Submit a detailed bug report with:
   - Error message/screenshot
   - Steps to reproduce
   - Browser/device information
   - Backend logs (if applicable)
