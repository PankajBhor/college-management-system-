package com.college.colllege_backend.service;

import java.io.InputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.college.colllege_backend.dto.BulkUploadResultDTO;
import com.college.colllege_backend.dto.DSYAdmissionRequestDTO;
import com.college.colllege_backend.dto.FYAdmissionRequestDTO;
import com.college.colllege_backend.entity.Enquiry;
import com.college.colllege_backend.entity.LookupOption;
import com.college.colllege_backend.enums.AdmissionStatus;
import com.college.colllege_backend.repository.CourseRepository;
import com.college.colllege_backend.repository.EnquiryRepository;
import com.college.colllege_backend.repository.LookupOptionRepository;
import com.college.colllege_backend.repository.ReferenceFacultyRepository;
import com.college.colllege_backend.service.impl.DSYAdmissionServiceImpl;
import com.college.colllege_backend.service.impl.FYAdmissionServiceImpl;

@Service
public class BulkUploadService {
    private final EnquiryRepository enquiryRepository;
    private final LookupOptionRepository lookupOptionRepository;
    private final CourseRepository courseRepository;
    private final ReferenceFacultyRepository referenceFacultyRepository;
    private final FYAdmissionServiceImpl fyAdmissionService;
    private final DSYAdmissionServiceImpl dsyAdmissionService;
    private final DataFormatter formatter = new DataFormatter();

    public BulkUploadService(
            EnquiryRepository enquiryRepository,
            LookupOptionRepository lookupOptionRepository,
            CourseRepository courseRepository,
            ReferenceFacultyRepository referenceFacultyRepository,
            FYAdmissionServiceImpl fyAdmissionService,
            DSYAdmissionServiceImpl dsyAdmissionService) {
        this.enquiryRepository = enquiryRepository;
        this.lookupOptionRepository = lookupOptionRepository;
        this.courseRepository = courseRepository;
        this.referenceFacultyRepository = referenceFacultyRepository;
        this.fyAdmissionService = fyAdmissionService;
        this.dsyAdmissionService = dsyAdmissionService;
    }

    @Transactional
    public BulkUploadResultDTO uploadEnquiries(MultipartFile file) {
        return readRows(file, (row, headers, result, seenSeatNumbers) -> {
            rejectDatabaseGeneratedId(row, headers);
            String seatNo = value(row, headers, "SSC Seat No");
            require(seatNo, "SSC Seat No is required");
            String normalizedSeatNo = seatNo.trim();
            if (!seenSeatNumbers.add(normalizedSeatNo.toLowerCase())) {
                throw new IllegalArgumentException("Duplicate SSC Seat No inside Excel: " + normalizedSeatNo);
            }
            Enquiry existing = enquiryRepository.findBySscSeatNoIgnoreCase(normalizedSeatNo);
            if (existing != null) {
                throw new IllegalArgumentException("SSC Seat No already exists for " + existing.getFirstName() + " " + existing.getLastName());
            }

            String[] name = splitName(firstPresent(row, headers, "Applicant Name", "Name"));
            Enquiry enquiry = new Enquiry();
            enquiry.setFirstName(name[0]);
            enquiry.setMiddleName(name[1]);
            enquiry.setLastName(name[2]);
            enquiry.setPersonalMobileNumber(required(row, headers, "Personal Mobile Number"));
            enquiry.setGuardianMobileNumber(required(row, headers, "Guardian Mobile Number"));
            enquiry.setEmail(required(row, headers, "Email"));
            enquiry.setSscSeatNo(normalizedSeatNo);
            enquiry.setAdmissionFor(requiredLookup(row, headers, "Admission For", "admission_types"));
            String location = required(row, headers, "Location");
            enquiry.setLocation(location);
            enquiry.setOtherLocation(value(row, headers, "Other Location"));
            enquiry.setCategory(requiredLookup(row, headers, "Category", "categories"));
            enquiry.setReferenceFaculty(optionalReferenceFaculty(row, headers, "Reference Faculty"));
            enquiry.setDteRegistrationDone(booleanValue(optionalLookup(row, headers, "DTE Registration Done", "yes_no")));
            enquiry.setEmailEnabled(booleanValue(optionalLookup(row, headers, "Email Enabled", "yes_no")));
            enquiry.setProvisionalAdmission(booleanValue(optionalLookup(row, headers, "Provisional Admission", "yes_no")));
            enquiry.setProvisionalAdmissionDate(enquiry.isProvisionalAdmission() ? dateValue(row, headers, "Provisional Admission Date", false) : null);
            enquiry.setEnquiryDate(defaultString(dateString(row, headers, "Enquiry Date"), LocalDate.now().toString()));
            enquiry.setStatus(defaultString(optionalLookup(row, headers, "Status", "enquiry_statuses"), "Pending"));
            enquiry.setBranchesInterested(branchesJson(row, headers));
            enquiry.setMeritDetails(meritJson(row, headers));

            Enquiry saved = enquiryRepository.save(enquiry);
            saveLocation(saved.getLocation());
        });
    }

    @Transactional
    public BulkUploadResultDTO uploadFYAdmissions(MultipartFile file) {
        return readRows(file, (row, headers, result, seenKeys) -> {
            rejectDatabaseGeneratedId(row, headers);
            String[] name = splitName(firstPresent(row, headers, "Applicant Name", "Name"));
            FYAdmissionRequestDTO request = new FYAdmissionRequestDTO();
            request.setApplicantFirstName(name[0]);
            request.setApplicantMiddleName(name[1]);
            request.setApplicantLastName(name[2]);
            setFatherName(request, value(row, headers, "Father Name"));
            setMotherName(request, value(row, headers, "Mother Name"));
            request.setMobileNo(required(row, headers, "Mobile No"));
            request.setStudentEmail(value(row, headers, "Student Email"));
            request.setGender(requiredLookup(row, headers, "Gender", "genders"));
            request.setDateOfBirth(dateValue(row, headers, "Date Of Birth", true));
            request.setVillageCity(required(row, headers, "Village City"));
            request.setTal(value(row, headers, "Tal"));
            request.setDist(value(row, headers, "Dist"));
            request.setPinCode(value(row, headers, "Pin Code"));
            request.setAadhaarNo(value(row, headers, "Aadhaar No"));
            request.setSchoolName(value(row, headers, "School Name"));
            request.setYop(integerValue(value(row, headers, "YOP")));
            request.setMarksObtained(doubleValue(value(row, headers, "Marks Obtained")));
            request.setTotalMarks(doubleValue(value(row, headers, "Total Marks")));
            request.setEnglishMarks(doubleValue(value(row, headers, "English Marks")));
            request.setMathMarks(doubleValue(value(row, headers, "Math Marks")));
            request.setScienceMarks(doubleValue(value(row, headers, "Science Marks")));
            request.setBestOfFiveMarks(doubleValue(value(row, headers, "Best Of Five Marks")));
            request.setProgram(requiredCourse(row, headers, "Program"));
            request.setCategory(optionalLookup(row, headers, "Category", "categories"));
            request.setCaste(value(row, headers, "Caste"));
            request.setAnnualIncome(doubleValue(value(row, headers, "Annual Income")));
            request.setPhysicallyHandicapped(optionalLookup(row, headers, "Physically Handicapped", "yes_no"));
            request.setAdmissionType(requiredLookup(row, headers, "Admission Type", "admission_rounds"));
            request.setAdmissionDate(dateValue(row, headers, "Admission Date", false));
            request.setStatus(defaultString(optionalAdmissionStatus(row, headers, "Status"), "PENDING"));
            fyAdmissionService.createFYAdmission(request);
        });
    }

    @Transactional
    public BulkUploadResultDTO uploadDSYAdmissions(MultipartFile file) {
        return readRows(file, (row, headers, result, seenKeys) -> {
            rejectDatabaseGeneratedId(row, headers);
            String[] name = splitName(firstPresent(row, headers, "Applicant Name", "Name"));
            DSYAdmissionRequestDTO request = new DSYAdmissionRequestDTO();
            request.setApplicantFirstName(name[0]);
            request.setApplicantMiddleName(name[1]);
            request.setApplicantLastName(name[2]);
            setFatherName(request, value(row, headers, "Father Name"));
            setMotherName(request, value(row, headers, "Mother Name"));
            request.setMobileNo(required(row, headers, "Mobile No"));
            request.setStudentEmail(value(row, headers, "Student Email"));
            request.setGender(requiredLookup(row, headers, "Gender", "genders"));
            request.setDateOfBirth(dateValue(row, headers, "Date Of Birth", true));
            request.setLocalAddress(required(row, headers, "Local Address"));
            request.setLocalTal(value(row, headers, "Local Tal"));
            request.setLocalDist(value(row, headers, "Local Dist"));
            request.setLocalPinCode(value(row, headers, "Local Pin Code"));
            request.setPermanentAddress(defaultString(value(row, headers, "Permanent Address"), request.getLocalAddress()));
            request.setPermanentTal(value(row, headers, "Permanent Tal"));
            request.setPermanentDist(value(row, headers, "Permanent Dist"));
            request.setPermanentPinCode(value(row, headers, "Permanent Pin Code"));
            request.setAadhaarNo(value(row, headers, "Aadhaar No"));
            request.setEducationalQualification(optionalLookup(row, headers, "Educational Qualification", "educational_qualifications"));
            request.setInstituteName(value(row, headers, "Institute Name"));
            request.setPreviousProgramCode(value(row, headers, "Previous Program Code"));
            request.setPreviousCGPA(doubleValue(value(row, headers, "Previous CGPA")));
            request.setScienceMarks(doubleValue(value(row, headers, "Science Marks")));
            request.setProgram(requiredCourse(row, headers, "Program"));
            request.setCategory(optionalLookup(row, headers, "Category", "categories"));
            request.setCaste(value(row, headers, "Caste"));
            request.setAnnualIncome(value(row, headers, "Annual Income"));
            request.setPhysicallyHandicapped(optionalLookup(row, headers, "Physically Handicapped", "yes_no"));
            request.setAdmissionType(requiredLookup(row, headers, "Admission Type", "admission_rounds"));
            request.setAdmissionDate(dateValue(row, headers, "Admission Date", false));
            request.setStatus(defaultString(optionalAdmissionStatus(row, headers, "Status"), "PENDING"));
            dsyAdmissionService.createDSYAdmission(request);
        });
    }

    public byte[] enquiryTemplate() {
        List<String> headers = new ArrayList<>(List.of(
                "Name",
                "Personal Mobile Number",
                "Guardian Mobile Number",
                "Email",
                "SSC Seat No",
                "Admission For",
                "Location",
                "Other Location",
                "Category",
                "Reference Faculty",
                "DTE Registration Done",
                "Email Enabled",
                "Provisional Admission",
                "Provisional Admission Date",
                "Enquiry Date",
                "Status",
                "Class 10 Percentage",
                "Class 12 Percentage",
                "ITI Percentage",
                "Other Percentage",
                "Other Marks Of",
                "Branches Interested"
        ));
        int branchCount = Math.max(1, activeBranchNames().size());
        for (int priority = 1; priority <= branchCount; priority++) {
            headers.add("Branch Priority " + priority);
        }
        return templateWorkbook(headers, "Enquiries");
    }

    public byte[] fyAdmissionTemplate() {
        return templateWorkbook(List.of(
                "Applicant Name",
                "Father Name",
                "Mother Name",
                "Mobile No",
                "Student Email",
                "Gender",
                "Date Of Birth",
                "Village City",
                "Tal",
                "Dist",
                "Pin Code",
                "Aadhaar No",
                "School Name",
                "YOP",
                "Marks Obtained",
                "Total Marks",
                "English Marks",
                "Math Marks",
                "Science Marks",
                "Best Of Five Marks",
                "Program",
                "Category",
                "Caste",
                "Annual Income",
                "Physically Handicapped",
                "Admission Type",
                "Admission Date",
                "Status"
        ), "FY Admissions");
    }

    public byte[] dsyAdmissionTemplate() {
        return templateWorkbook(List.of(
                "Applicant Name",
                "Father Name",
                "Mother Name",
                "Mobile No",
                "Student Email",
                "Gender",
                "Date Of Birth",
                "Local Address",
                "Local Tal",
                "Local Dist",
                "Local Pin Code",
                "Permanent Address",
                "Permanent Tal",
                "Permanent Dist",
                "Permanent Pin Code",
                "Aadhaar No",
                "Educational Qualification",
                "Institute Name",
                "Previous Program Code",
                "Previous CGPA",
                "Science Marks",
                "Program",
                "Category",
                "Caste",
                "Annual Income",
                "Physically Handicapped",
                "Admission Type",
                "Admission Date",
                "Status"
        ), "DSY Admissions");
    }

    private BulkUploadResultDTO readRows(MultipartFile file, RowImporter importer) {
        BulkUploadResultDTO result = new BulkUploadResultDTO();
        if (file == null || file.isEmpty()) {
            result.addError(0, "Please select an Excel file");
            return result;
        }
        try (InputStream inputStream = file.getInputStream(); Workbook workbook = WorkbookFactory.create(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);
            Map<String, Integer> headers = headers(sheet.getRow(0));
            Set<String> seenKeys = new HashSet<>();
            for (int index = 1; index <= sheet.getLastRowNum(); index++) {
                Row row = sheet.getRow(index);
                if (row == null || isEmpty(row)) {
                    continue;
                }
                result.setTotalRows(result.getTotalRows() + 1);
                try {
                    importer.importRow(row, headers, result, seenKeys);
                    result.addSuccess();
                } catch (Exception error) {
                    result.addError(index + 1, error.getMessage());
                }
            }
        } catch (Exception error) {
            result.addError(0, "Unable to read Excel file: " + error.getMessage());
        }
        return result;
    }

    private Map<String, Integer> headers(Row headerRow) {
        if (headerRow == null) {
            throw new IllegalArgumentException("Header row is missing");
        }
        Map<String, Integer> headers = new HashMap<>();
        for (Cell cell : headerRow) {
            String header = formatter.formatCellValue(cell);
            if (!header.isBlank()) {
                headers.put(key(header), cell.getColumnIndex());
            }
        }
        return headers;
    }

    private String value(Row row, Map<String, Integer> headers, String header) {
        Integer index = headers.get(key(header));
        if (index == null) {
            return "";
        }
        Cell cell = row.getCell(index);
        if (cell == null) {
            return "";
        }
        String value = formatter.formatCellValue(cell);
        return value == null ? "" : value.trim().replaceAll("\\s+", " ");
    }

    private String firstPresent(Row row, Map<String, Integer> headers, String... names) {
        for (String name : names) {
            String value = value(row, headers, name);
            if (!value.isBlank()) {
                return value;
            }
        }
        return "";
    }

    private String required(Row row, Map<String, Integer> headers, String header) {
        return require(value(row, headers, header), header + " is required");
    }

    private String requiredLookup(Row row, Map<String, Integer> headers, String header, String lookupType) {
        String rawValue = required(row, headers, header);
        return validLookupValue(rawValue, lookupType, header);
    }

    private String optionalLookup(Row row, Map<String, Integer> headers, String header, String lookupType) {
        String rawValue = value(row, headers, header);
        if (rawValue.isBlank()) {
            return "";
        }
        return validLookupValue(rawValue, lookupType, header);
    }

    private String validLookupValue(String rawValue, String lookupType, String header) {
        Map<String, String> allowedValues = lookupValueMap(lookupType);
        String canonicalValue = allowedValues.get(normalizeControlledValue(rawValue));
        if (canonicalValue == null) {
            throw new IllegalArgumentException("Invalid " + header + ": " + rawValue
                    + ". Allowed values: " + String.join(", ", new LinkedHashSet<>(allowedValues.values())));
        }
        return canonicalValue;
    }

    private Map<String, String> lookupValueMap(String lookupType) {
        Map<String, String> values = new LinkedHashMap<>();
        for (LookupOption option : lookupOptionRepository.findByTypeAndActiveTrueOrderByDisplayOrderAscLabelAsc(lookupType)) {
            if (option.getLabel() != null && !option.getLabel().isBlank()) {
                values.put(normalizeControlledValue(option.getLabel()), option.getLabel());
            }
            if (option.getCode() != null && !option.getCode().isBlank()) {
                values.put(normalizeControlledValue(option.getCode()), option.getLabel());
            }
        }
        return values;
    }

    private String optionalReferenceFaculty(Row row, Map<String, Integer> headers, String header) {
        String rawValue = value(row, headers, header);
        if (rawValue.isBlank()) {
            return "";
        }
        Map<String, String> allowedValues = new LinkedHashMap<>();
        referenceFacultyRepository.findByActiveTrueOrderByNameAsc().forEach(faculty -> {
            if (faculty.getName() != null && !faculty.getName().isBlank()) {
                allowedValues.put(normalizeControlledValue(faculty.getName()), faculty.getName());
            }
            if (faculty.getEmail() != null && !faculty.getEmail().isBlank()) {
                allowedValues.put(normalizeControlledValue(faculty.getEmail()), faculty.getName());
            }
        });
        String canonicalValue = allowedValues.get(normalizeControlledValue(rawValue));
        if (canonicalValue == null) {
            throw new IllegalArgumentException("Invalid Reference Faculty: " + rawValue
                    + ". Allowed values: " + String.join(", ", new LinkedHashSet<>(allowedValues.values())));
        }
        return canonicalValue;
    }

    private String requiredCourse(Row row, Map<String, Integer> headers, String header) {
        String rawValue = required(row, headers, header);
        String canonicalValue = courseLookup().get(normalizeControlledValue(rawValue));
        if (canonicalValue == null) {
            throw new IllegalArgumentException("Invalid " + header + ": " + rawValue
                    + ". Allowed departments: " + String.join(", ", activeBranchNames()));
        }
        return canonicalValue;
    }

    private Map<String, String> courseLookup() {
        Map<String, String> courses = new LinkedHashMap<>();
        courseRepository.findAll().forEach(course -> {
            String name = course.getName();
            String code = course.getCode();
            if (name != null && !name.isBlank()) {
                courses.put(normalizeControlledValue(name), name);
            }
            if (code != null && !code.isBlank() && name != null && !name.isBlank()) {
                courses.put(normalizeControlledValue(code), name);
                courses.put(normalizeControlledValue(code + ". " + name), name);
            }
        });
        return courses;
    }

    private String optionalAdmissionStatus(Row row, Map<String, Integer> headers, String header) {
        String rawValue = value(row, headers, header);
        if (rawValue.isBlank()) {
            return "";
        }
        for (AdmissionStatus status : AdmissionStatus.values()) {
            if (status.name().equalsIgnoreCase(rawValue) || status.getDisplayName().equalsIgnoreCase(rawValue)) {
                return status.name();
            }
        }
        throw new IllegalArgumentException("Invalid " + header + ": " + rawValue
                + ". Allowed values: PENDING, APPROVED, REJECTED, SUCCESS, INCOMPLETE");
    }

    private void rejectDatabaseGeneratedId(Row row, Map<String, Integer> headers) {
        for (String header : List.of("ID", "Id", "Enquiry ID", "Admission ID")) {
            String id = value(row, headers, header);
            if (!id.isBlank()) {
                throw new IllegalArgumentException(header + " is database generated and cannot be provided in bulk upload");
            }
        }
    }

    private String require(String value, String message) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(message);
        }
        return value.trim();
    }

    private LocalDate dateValue(Row row, Map<String, Integer> headers, String header, boolean required) {
        Integer index = headers.get(key(header));
        if (index == null) {
            if (required) throw new IllegalArgumentException(header + " is required");
            return null;
        }
        Cell cell = row.getCell(index);
        if (cell == null || formatter.formatCellValue(cell).trim().isEmpty()) {
            if (required) throw new IllegalArgumentException(header + " is required");
            return null;
        }
        if (DateUtil.isCellDateFormatted(cell)) {
            return cell.getDateCellValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        }
        return LocalDate.parse(formatter.formatCellValue(cell).trim());
    }

    private String dateString(Row row, Map<String, Integer> headers, String header) {
        LocalDate date = dateValue(row, headers, header, false);
        return date == null ? "" : date.toString();
    }

    private String[] splitName(String fullName) {
        String value = require(fullName, "Name is required").trim().replaceAll("\\s+", " ");
        String[] parts = value.split(" ");
        if (parts.length < 2) {
            throw new IllegalArgumentException("Name must contain at least first and last name");
        }
        String first = parts[0];
        String last = parts[parts.length - 1];
        String middle = "";
        if (parts.length > 2) {
            middle = String.join(" ", java.util.Arrays.copyOfRange(parts, 1, parts.length - 1));
        }
        return new String[] { first, middle, last };
    }

    private String[] splitOptionalName(String fullName) {
        if (fullName == null || fullName.isBlank()) {
            return new String[] { "", "", "" };
        }
        String value = fullName.trim().replaceAll("\\s+", " ");
        String[] parts = value.split(" ");
        String first = parts[0];
        String last = parts.length > 1 ? parts[parts.length - 1] : "";
        String middle = parts.length > 2 ? String.join(" ", java.util.Arrays.copyOfRange(parts, 1, parts.length - 1)) : "";
        return new String[] { first, middle, last };
    }

    private void setFatherName(FYAdmissionRequestDTO request, String fullName) {
        String[] name = splitOptionalName(fullName);
        request.setFatherFirstName(name[0]);
        request.setFatherMiddleName(name[1]);
        request.setFatherLastName(name[2]);
    }

    private void setMotherName(FYAdmissionRequestDTO request, String fullName) {
        String[] name = splitOptionalName(fullName);
        request.setMotherFirstName(name[0]);
        request.setMotherMiddleName(name[1]);
        request.setMotherLastName(name[2]);
    }

    private void setFatherName(DSYAdmissionRequestDTO request, String fullName) {
        String[] name = splitOptionalName(fullName);
        request.setFatherFirstName(name[0]);
        request.setFatherMiddleName(name[1]);
        request.setFatherLastName(name[2]);
    }

    private void setMotherName(DSYAdmissionRequestDTO request, String fullName) {
        String[] name = splitOptionalName(fullName);
        request.setMotherFirstName(name[0]);
        request.setMotherMiddleName(name[1]);
        request.setMotherLastName(name[2]);
    }

    private boolean isEmpty(Row row) {
        for (Cell cell : row) {
            if (!formatter.formatCellValue(cell).trim().isEmpty()) {
                return false;
            }
        }
        return true;
    }

    private String key(String value) {
        return value == null ? "" : value.toLowerCase().replaceAll("[^a-z0-9]", "");
    }

    private Boolean booleanValue(String value) {
        String normalized = value == null ? "" : value.trim().toLowerCase();
        return normalized.equals("yes") || normalized.equals("true") || normalized.equals("1");
    }

    private Integer integerValue(String value) {
        if (value == null || value.isBlank()) return null;
        return (int) Math.round(Double.parseDouble(value));
    }

    private Double doubleValue(String value) {
        if (value == null || value.isBlank()) return null;
        return Double.parseDouble(value);
    }

    private String defaultString(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
    }

    private String meritJson(Row row, Map<String, Integer> headers) {
        return "{"
                + "\"class10\":\"" + escape(value(row, headers, "Class 10 Percentage")) + "\","
                + "\"class12\":\"" + escape(value(row, headers, "Class 12 Percentage")) + "\","
                + "\"iti\":\"" + escape(value(row, headers, "ITI Percentage")) + "\","
                + "\"other\":\"" + escape(value(row, headers, "Other Percentage")) + "\","
                + "\"otherDescription\":\"" + escape(value(row, headers, "Other Marks Of")) + "\""
                + "}";
    }

    private byte[] templateWorkbook(List<String> headers, String sheetName) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet(sheetName);
            Row row = sheet.createRow(0);
            for (int index = 0; index < headers.size(); index++) {
                row.createCell(index).setCellValue(headers.get(index));
                sheet.autoSizeColumn(index);
            }
            workbook.write(output);
            return output.toByteArray();
        } catch (Exception error) {
            throw new IllegalStateException("Unable to create Excel template: " + error.getMessage(), error);
        }
    }

    private List<String> activeBranchNames() {
        return courseRepository.findAll().stream()
                .map(course -> course.getName())
                .filter(name -> name != null && !name.isBlank())
                .toList();
    }

    private String branchesJson(Row row, Map<String, Integer> headers) {
        List<String> branches = new ArrayList<>();
        Map<String, String> validBranches = activeBranchLookup();
        String combinedBranches = value(row, headers, "Branches Interested");
        if (!combinedBranches.isBlank()) {
            for (String branch : combinedBranches.split("[,;]")) {
                if (!branch.trim().isBlank()) {
                    branches.add(validBranchName(branch.trim(), validBranches));
                }
            }
        }
        for (int priority = 1; priority <= 50; priority++) {
            String branch = value(row, headers, "Branch Priority " + priority);
            if (branch.isBlank()) {
                branch = value(row, headers, "Branch " + priority);
            }
            if (!branch.isBlank()) {
                branches.add(validBranchName(branch, validBranches));
            }
        }
        StringBuilder builder = new StringBuilder("[");
        Set<String> seenBranches = new HashSet<>();
        for (String branch : branches) {
            if (branch != null && !branch.isBlank() && seenBranches.add(branch.toLowerCase())) {
                int priority = seenBranches.size();
                if (priority > 1) builder.append(",");
                builder.append("{\"branch\":\"").append(escape(branch)).append("\",\"priority\":").append(priority).append("}");
            }
        }
        return builder.append("]").toString();
    }

    private Map<String, String> activeBranchLookup() {
        Map<String, String> branches = new LinkedHashMap<>();
        for (String branch : activeBranchNames()) {
            branches.put(normalizeBranchName(branch), branch);
        }
        return branches;
    }

    private String validBranchName(String branch, Map<String, String> validBranches) {
        String canonicalName = validBranches.get(normalizeBranchName(branch));
        if (canonicalName == null) {
            throw new IllegalArgumentException(
                    "Invalid department in branch priorities: " + branch + ". Allowed departments: "
                            + String.join(", ", validBranches.values()));
        }
        return canonicalName;
    }

    private String normalizeBranchName(String branch) {
        return branch == null ? "" : branch.trim().toLowerCase().replaceAll("\\s+", " ");
    }

    private String normalizeControlledValue(String value) {
        return value == null ? "" : value.trim().toLowerCase().replaceAll("\\s+", " ");
    }

    private String escape(String value) {
        return value == null ? "" : value.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private void saveLocation(String location) {
        if (location == null || location.isBlank()) {
            return;
        }
        String code = location.trim().toUpperCase().replaceAll("[^A-Z0-9]+", "_").replaceAll("^_|_$", "");
        if (code.isEmpty() || lookupOptionRepository.existsByTypeAndCode("locations", code)) {
            return;
        }
        lookupOptionRepository.save(new LookupOption("locations", code, location.trim(), 999));
    }

    @FunctionalInterface
    private interface RowImporter {
        void importRow(Row row, Map<String, Integer> headers, BulkUploadResultDTO result, Set<String> seenKeys);
    }
}
