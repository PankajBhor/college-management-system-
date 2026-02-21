# College Management System - Admission Module

## Overview
The Admission Module is a comprehensive system for managing First Year (FY) and Direct Second Year (DSY) diploma admissions for Jaihind Polytechnic Kuran.

## Features

### 1. **Two Types of Admissions**
   - **FY (First Year)**: For students seeking admission to first-year diploma program
   - **DSY (Direct Second Year)**: For students seeking admission to second-year diploma program

### 2. **Comprehensive Form Fields**

   **FY Admission Form Includes:**
   - Personal Information (Name, Gender, DOB, Blood Group)
   - Parent/Guardian Address
   - Contact Information
   - Identification (UID, Aadhaar)
   - Previous Exam Details (SSC Marks)
   - Program Selection
   - Category and Income Information
   - Document Checklist (10 documents)
   - Legal and Academic Undertakings

   **DSY Admission Form Includes:**
   - Personal Information
   - Local and Permanent Address
   - Contact Information
   - Educational Qualification Details
   - Previous Institute/Program Information
   - Program Selection
   - Program Preferences (up to 4)
   - Document Checklist (7 documents)
   - Legal and Academic Undertakings

### 3. **Document Management**
   - FY: 10 Required Documents
   - DSY: 7 Required Documents
   - Checklist with Original and Attested Copy tracking
   - Predefined document lists auto-loaded from database

### 4. **Data Validation**
   - Email validation
   - 10-digit mobile number validation
   - Required field validation
   - Real-time error display

## Backend Implementation

### Entities
- `FYAdmission.java` - First Year Admission entity
- `DSYAdmission.java` - Direct Second Year Admission entity
- `DocumentChecklist.java` - Document tracking entity

### DTOs
- `FYAdmissionRequestDTO.java` - DTO for FY admission requests
- `DSYAdmissionRequestDTO.java` - DTO for DSY admission requests
- `DocumentChecklistDTO.java` - DTO for document information

### Services
- `FYAdmissionService` / `FYAdmissionServiceImpl` - FY admission business logic
- `DSYAdmissionService` / `DSYAdmissionServiceImpl` - DSY admission business logic
- `DocumentChecklistServiceInterface` / `DocumentChecklistServiceImpl` - Document management

### Controllers
- `FYAdmissionController` - REST endpoints for FY admissions
- `DSYAdmissionController` - REST endpoints for DSY admissions
- `DocumentChecklistController` - REST endpoints for documents

### Repositories
- `FYAdmissionRepository` - Database access for FY admissions
- `DSYAdmissionRepository` - Database access for DSY admissions
- `DocumentChecklistRepository` - Database access for documents

## API Endpoints

### FY Admission Endpoints
```
POST   /api/admissions/fy                      - Create FY admission
GET    /api/admissions/fy                      - Get all FY admissions
GET    /api/admissions/fy/{id}                 - Get FY admission by ID
GET    /api/admissions/fy/status/{status}      - Get by status
GET    /api/admissions/fy/admission-type/{type} - Get by admission type
PUT    /api/admissions/fy/{id}                 - Update FY admission
DELETE /api/admissions/fy/{id}                 - Delete FY admission
```

### DSY Admission Endpoints
```
POST   /api/admissions/dsy                      - Create DSY admission
GET    /api/admissions/dsy                      - Get all DSY admissions
GET    /api/admissions/dsy/{id}                 - Get DSY admission by ID
GET    /api/admissions/dsy/status/{status}      - Get by status
GET    /api/admissions/dsy/admission-type/{type} - Get by admission type
PUT    /api/admissions/dsy/{id}                 - Update DSY admission
DELETE /api/admissions/dsy/{id}                 - Delete DSY admission
```

### Document Endpoints
```
GET    /api/documents/{admissionType}           - Get documents for admission type (FY/DSY)
POST   /api/documents/initialize                - Initialize default documents
```

## Frontend Components

### Main Components
- **AdmissionForm.jsx** - Selection interface for FY/DSY
- **FYAdmissionForm.jsx** - Full FY admission form
- **DSYAdmissionForm.jsx** - Full DSY admission form
- **DocumentChecklist.jsx** - Document tracking component

### Service
- **admissionService.js** - API communication layer

### Styling
- **AdmissionForm.css** - Selection interface styles
- **FYAdmissionForm.css** - FY form styles
- **DSYAdmissionForm.css** - DSY form styles
- **DocumentChecklist.css** - Document checklist styles

## FY Admission Required Documents (10)
1. Domicile / Nationality Certificate
2. 10th Mark Sheet
3. 12th/ITI Mark Sheet
4. Leaving Certificate
5. Caste Certificate
6. Non Creamy Layer Certificate
7. Income Certificate
8. Defence Certificate
9. Aadhaar Card
10. Any Other

## DSY Admission Required Documents (7)
1. Domicile / Nationality Certificate
2. Leaving Certificate from Previous Institute
3. Caste Certificate
4. Non Creamy Layer Certificate (valid up to 31 March)
5. Income Certificate
6. Xerox copy of Aadhaar Card
7. Mark Sheets from Previous Program

## Integration with Dashboard

To add the Admissions tab to the office staff dashboard:

1. **Import the component:**
   ```jsx
   import { AdmissionForm } from './pages/admissions';
   ```

2. **Add to menu data** (in `menuData.js`):
   ```javascript
   {
     id: 'admissions',
     name: 'Admissions',
     icon: '📋',
     route: '/admissions'
   }
   ```

3. **Add route** (in your router):
   ```jsx
   <Route path="/admissions" element={<AdmissionForm />} />
   ```

## Data Flow

### Creating a New Admission
1. User selects FY or DSY from selection interface
2. User fills out comprehensive form with validation
3. System fetches document checklist from API
4. User submits form with document acknowledgments
5. Data is validated and sent to backend
6. Backend saves admission record to database
7. Frontend displays success message
8. User is redirected to admissions page

### Viewing Admissions (Office Staff)
1. Staff can view all admissions
2. Filter by status (PENDING, APPROVED, REJECTED)
3. Filter by admission type (CAP-1, CAP-2, etc.)
4. View complete application details
5. Update status or reject applications

## Admission Statuses
- **PENDING** - Initial status when submitted
- **APPROVED** - Approved by staff
- **REJECTED** - Rejected by staff

## Database Schema

### FY_ADMISSIONS Table
```sql
CREATE TABLE fy_admissions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  applicant_name VARCHAR(255) NOT NULL,
  father_name VARCHAR(255),
  mother_name VARCHAR(255),
  village_city VARCHAR(255) NOT NULL,
  tal VARCHAR(100),
  dist VARCHAR(100),
  pin_code VARCHAR(10),
  occupation VARCHAR(255),
  mobile_no VARCHAR(10),
  student_email VARCHAR(255),
  gender VARCHAR(50),
  date_of_birth DATE,
  blood_group VARCHAR(5),
  student_uid VARCHAR(255),
  aadhaar_no VARCHAR(12),
  school_name VARCHAR(255),
  yop INT,
  marks_obtained DOUBLE,
  total_marks DOUBLE,
  english_marks DOUBLE,
  math_marks DOUBLE,
  best_of_five_marks DOUBLE,
  program VARCHAR(255) NOT NULL,
  category VARCHAR(50),
  caste VARCHAR(100),
  annual_income DOUBLE,
  physically_handicapped VARCHAR(10),
  admission_type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  status VARCHAR(20)
);
```

### DSY_ADMISSIONS Table
```sql
CREATE TABLE dsy_admissions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  applicant_name VARCHAR(255) NOT NULL,
  father_name VARCHAR(255),
  mother_name VARCHAR(255),
  local_address VARCHAR(500) NOT NULL,
  local_tal VARCHAR(100),
  local_dist VARCHAR(100),
  local_pin_code VARCHAR(10),
  permanent_address VARCHAR(500) NOT NULL,
  permanent_tal VARCHAR(100),
  permanent_dist VARCHAR(100),
  permanent_pin_code VARCHAR(10),
  mobile_no VARCHAR(10),
  student_email VARCHAR(255),
  gender VARCHAR(50),
  date_of_birth DATE,
  blood_group VARCHAR(5),
  student_uid VARCHAR(255),
  aadhaar_no VARCHAR(12),
  educational_qualification VARCHAR(100),
  institute_name VARCHAR(255),
  previous_program_code VARCHAR(50),
  previous_cgpa DOUBLE,
  program VARCHAR(255) NOT NULL,
  category VARCHAR(50),
  caste VARCHAR(100),
  annual_income VARCHAR(50),
  physically_handicapped VARCHAR(10),
  admission_type VARCHAR(20) NOT NULL,
  preference1 INT,
  preference2 INT,
  preference3 INT,
  preference4 INT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  status VARCHAR(20)
);
```

### DOCUMENT_CHECKLISTS Table
```sql
CREATE TABLE document_checklists (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  admission_type VARCHAR(10),
  document_name VARCHAR(255),
  is_required BOOLEAN,
  sequence_order INT
);
```

## Usage Instructions

### For Office Staff
1. Navigate to the Admissions tab
2. View all applications or filter by status/type
3. Click on an application to view details
4. Approve or reject applications
5. Print applications if needed

### For Students (if public portal)
1. Select admission type (FY or DSY)
2. Fill out the comprehensive form
3. Ensure all required documents are listed
4. Submit the application
5. Receive confirmation
6. Wait for office staff approval

## Form Validation Rules
- Applicant name: Required, non-empty
- Mobile number: Required, exactly 10 digits
- Email: Required, valid email format
- Gender: Required
- Date of Birth: Required
- Program: Required
- Admission Type: Required
- For DSY: Both local and permanent addresses required

## Security Considerations
- All submissions are timestamped
- Staff approval workflow prevents unauthorized submissions
- Database stores sensitive information securely
- API endpoints should be protected with authentication

## Future Enhancements
1. File upload for documents
2. Payment integration for admission fees
3. Email notifications for admission status
4. Merit list generation
5. Seat allocation algorithm
6. Batch operations for staff
7. Advanced reporting and analytics
8. Document verification workflow
9. Application timeline tracking
10. SMS notifications

## Support
For issues or questions about the Admission Module, please contact the IT support team.
