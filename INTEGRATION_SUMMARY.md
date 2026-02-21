# Integration Summary - Frontend & Backend Connection

## System Architecture

```

┌─────────────────────────────────────────────────────────────────┐
│                     REACT FRONTEND                              │
│                   (localhost:3000)                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Pages:                          Services:                       │
│  ├─ NewEnquiry.jsx          ├─ enquiryService.js               │
│  ├─ EnquiryList.jsx         │  ├─ createEnquiry()              │
│  ├─ UpdateEnquiry.jsx       │  ├─ getAllEnquiries()            │
│  └─ index.jsx               │  ├─ updateEnquiry()              │
│                             │  └─ deleteEnquiry()              │
│  Hooks:                     │                                   │
│  └─ useEnquiry.js      ────────────────┐                       │
│                                        │                        │
└────────────────────────────────────────┼────────────────────────┘
                                         │
                         HTTP/REST API (JSON)
                         CORS Enabled (Next ↓)
                                         │
┌────────────────────────────────────────┼────────────────────────┐
│          SPRING BOOT BACKEND                                    │
│        (localhost:8080/api)                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Controllers:               Services/Repositories:              │
│  ├─ EnquiryController.java ├─ EnquiryRepository.java          │
│  │  ├─ POST /enquiries   ──┤   └─ findByStatus()              │
│  │  ├─ GET /enquiries    ──┤   └─ findByCategory()            │
│  │  ├─ PUT /enquiries/{id}─┤   └─ findByLocation()            │
│  │  └─ DELETE /enquiries│id}│   └─ save()                      │
│  │                      │   └─ deleteById()                    │
│  └─ UserController.java    └─ (Other services...)             │
│                                                                  │
│  DTOs:     Entities:                                            │
│  ├─ EnquiryRequestDTO   ├─ Enquiry.java                       │
│  └─ EnquiryResponseDTO  └─ (Other entities)                   │
│                                                                  │
└────────────────────────────────────────┼────────────────────────┘
                                         │
                    JDBC / Hibernate ORM
                    (Auto Table Creation)
                                         │
┌────────────────────────────────────────┼────────────────────────┐
│              MYSQL DATABASE                                     │
│          (localhost:3306)                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  college_db (Auto-Created)                                      │
│  ├─ enquiries                                                   │
│  │  ├─ id (PK)                                                 │
│  │  ├─ firstName                                               │
│  │  ├─ middleName                                              │
│  │  ├─ lastName                                                │
│  │  ├─ personalMobileNumber                                    │
│  │  ├─ guardianMobileNumber                                    │
│  │  ├─ email                                                   │
│  │  ├─ meritDetails (JSON)                                     │
│  │  ├─ admissionFor (FY/DSY)                                   │
│  │  ├─ location                                                │
│  │  ├─ otherLocation                                           │
│  │  ├─ category                                                │
│  │  ├─ branchesInterested (JSON)                               │
│  │  ├─ referenceFaculty                                        │
│  │  ├─ status (Pending/Follow-up/Converted/Lost)              │
│  │  ├─ enquiryDate                                             │
│  │  ├─ createdAt (AUTO)                                        │
│  │  └─ updatedAt (AUTO)                                        │
│  └─ users                                                       │
│  └─ (Other tables)                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

```

## Data Flow

### 1. Create New Enquiry
```
Frontend
  ↓
User fills form and clicks "Submit"
  ↓
NewEnquiry.handleSubmit()
  ↓
enquiryService.createEnquiry(formData)
  ↓
POST http://localhost:8080/api/enquiries
  (with JSON payload)
  ↓
Backend
  ↓
EnquiryController.createEnquiry()
  ↓
EnquiryRepository.save(enquiry)
  ↓
Hibernate generates SQL
  ↓
MySQL INSERT INTO enquiries
  ↓
Database confirms
  ↓
Response sent back to Frontend
  ↓
"Enquiry submitted successfully!"
  ↓
Form resets, list updates
```

### 2. Fetch All Enquiries
```
Frontend
  ↓
useEnquiry.fetchEnquiries()
  ↓
enquiryService.getAllEnquiries()
  ↓
GET http://localhost:8080/api/enquiries
  ↓
Backend
  ↓
EnquiryController.getAllEnquiries()
  ↓
EnquiryRepository.findAll()
  ↓
Hibernate generates SQL
  ↓
MySQL SELECT * FROM enquiries
  ↓
Results returned as JSON
  ↓
Frontend receives data
  ↓
EnquiryList displays table
```

### 3. Update Enquiry
```
Frontend
  ↓
User modifies data and clicks "Update"
  ↓
UpdateEnquiry.handleSubmit()
  ↓
enquiryService.updateEnquiry(id, data)
  ↓
PUT http://localhost:8080/api/enquiries/{id}
  ↓
Backend
  ↓
EnquiryController.updateEnquiry()
  ↓
EnquiryRepository.save(updated)
  ↓
Hibernate generates SQL
  ↓
MySQL UPDATE enquiries SET ...
  ↓
Response sent back
  ↓
Frontend updates list
```

### 4. Delete Enquiry
```
Frontend
  ↓
User confirms delete
  ↓
enquiryService.deleteEnquiry(id)
  ↓
DELETE http://localhost:8080/api/enquiries/{id}
  ↓
Backend
  ↓
EnquiryController.deleteEnquiry()
  ↓
EnquiryRepository.deleteById(id)
  ↓
Hibernate generates SQL
  ↓
MySQL DELETE FROM enquiries WHERE id = ?
  ↓
Frontend removes from list
```

## Configuration Reference

### Frontend Configuration
**File**: `frontend/src/services/enquiryService.js`
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

### Backend Configuration
**File**: `colllege-backend/src/main/resources/application.properties`
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/college_db

# Auto Table Creation
spring.jpa.hibernate.ddl-auto=update

# CORS
@CrossOrigin(origins = "http://localhost:3000")
```

## Key Features Implemented

### ✓ Frontend
- React forms with all required fields
- Real-time validation
- Error handling and display
- Mock data fallback if API unavailable
- Loading states during API calls
- CORS support

### ✓ Backend
- REST API endpoints (CRUD operations)
- DTOs for request/response
- JPA Repository with Query methods
- Automatic table creation via Hibernate
- Input validation
- Exception handling
- Filtering by various criteria

### ✓ Database
- Automatic table creation
- Proper data types for each field
- JSON fields for complex data (branches, merit)
- Timestamps for audit trail
- Constraints and validations

## Testing the Integration

### Test 1: Create Enquiry
1. Frontend: Navigate to "New Enquiry"
2. Fill form with sample data
3. Click "Submit Enquiry"
4. Check backend logs: Should see INSERT SQL
5. Check database: `SELECT * FROM enquiries;`
✓ Enquiry should appear in database

### Test 2: Fetch Enquiries
1. Frontend: Navigate to "Enquiry List"
2. Page loads and displays all enquiries
3. Check browser console: Should see API response
4. Data matches database
✓ List displays correctly

### Test 3: Update Enquiry
1. Frontend: Click edit on an enquiry
2. Modify some fields
3. Click "Update Enquiry"
4. Check backend logs: Should see UPDATE SQL
✓ Changes reflected in list

### Test 4: Delete Enquiry
1. Frontend: Click delete on an enquiry
2. Confirm deletion
3. Check backend logs: Should see DELETE SQL
4. Refresh page: Enquiry should be gone
✓ Deletion works correctly

## Troubleshooting Integration Issues

### Issue: "xhr failed loading"
- ✓ Check backend is running on port 8080
- ✓ Check CORS configuration
- ✓ Check API URL in enquiryService.js

### Issue: "API returns 500"
- ✓ Check backend logs for errors
- ✓ Verify Enquiry entity matches database schema
- ✓ Check entity relationships

### Issue: "Tables not created"
- ✓ Check `spring.jpa.hibernate.ddl-auto=update`
- ✓ Verify database connection works
- ✓ Check MySQL user permissions
- ✓ Restart backend after fixing

### Issue: "CORS error"
- ✓ Verify @CrossOrigin annotation on controller
- ✓ Check allowed origins matches frontend URL
- ✓ Clear browser cache

## Performance Optimization Tips

1. **Frontend**:
   - Implement pagination for large lists
   - Add search/filter on frontend before API call
   - Cache data in state

2. **Backend**:
   - Add database indexes on commonly filtered fields
   - Implement pagination: `Page<Enquiry> findByStatus(...)`
   - Use lazy loading for relationships

3. **Database**:
   - Create indexes on frequently queried columns
   - Monitor query performance
   - Archive old enquiries to separate table

## Security Considerations

⚠️ Before moving to production:
- ✗ Change default MySQL password
- ✗ Enable HTTPS/SSL
- ✗ Implement authentication (JWT/OAuth)
- ✗ Add input validation and sanitization
- ✗ Rate limiting on API endpoints
- ✗ CORS restrictions for specific domains
- ✗ SQL injection prevention (using ORM reduces risk)
- ✗ Environment variables for sensitive data

## Files Modified/Created

### Backend
- ✓ `src/main/java/entity/Enquiry.java` - Updated
- ✓ `src/main/java/repository/EnquiryRepository.java` - Updated
- ✓ `src/main/java/controller/EnquiryController.java` - Updated
- ✓ `src/main/java/dto/EnquiryRequestDTO.java` - Updated
- ✓ `src/main/java/dto/EnquiryResponseDTO.java` - Updated
- ✓ `src/main/resources/application.properties` - Updated

### Frontend
- ✓ `src/services/enquiryService.js` - Updated
- ✓ `src/pages/enquiry/NewEnquiry.jsx` - Updated
- ✓ `src/pages/enquiry/UpdateEnquiry.jsx` - Updated
- ✓ `src/pages/enquiry/EnquiryList.jsx` - Updated
- ✓ `src/data/mockEnquiries.js` - Updated

### Documentation
- ✓ `SETUP_GUIDE.md` - Created
- ✓ `QUICK_START.md` - Created
- ✓ This file - Created

---

**System is now fully integrated!** Frontend and backend communicate seamlessly with automatic database table creation.
