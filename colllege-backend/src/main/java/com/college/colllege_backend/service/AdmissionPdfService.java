package com.college.colllege_backend.service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.function.Supplier;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.college.colllege_backend.entity.DSYAdmission;
import com.college.colllege_backend.entity.FYAdmission;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

@Service
public class AdmissionPdfService {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd-MM-yyyy");
    private static final Font TITLE_FONT = new Font(Font.HELVETICA, 15, Font.BOLD, new Color(22, 42, 72));
    private static final Font SUBTITLE_FONT = new Font(Font.HELVETICA, 8, Font.NORMAL, Color.DARK_GRAY);
    private static final Font SECTION_FONT = new Font(Font.HELVETICA, 8, Font.BOLD, Color.WHITE);
    private static final Font LABEL_FONT = new Font(Font.HELVETICA, 7, Font.BOLD, new Color(45, 55, 72));
    private static final Font VALUE_FONT = new Font(Font.HELVETICA, 7, Font.NORMAL, Color.BLACK);
    private static final Font SMALL_FONT = new Font(Font.HELVETICA, 6, Font.NORMAL, Color.DARK_GRAY);
    private static final Color HEADER_BLUE = new Color(31, 78, 121);
    private static final Color LIGHT_BORDER = new Color(205, 213, 224);

    public byte[] generateFYAdmissionForm(FYAdmission admission) {
        validateFYAdmission(admission);

        List<Section> sections = List.of(
                new Section("Student Details", rows(
                        field("Application No.", admission.getId()),
                        field("Full Name", fullName(admission.getApplicantFirstName(), admission.getApplicantMiddleName(), admission.getApplicantLastName())),
                        field("Gender", admission.getGender()),
                        field("Date of Birth", admission.getDateOfBirth() == null ? null : admission.getDateOfBirth().format(DATE_FORMAT)),
                        field("Blood Group", admission.getBloodGroup()),
                        field("Aadhaar No.", admission.getAadhaarNo()))),
                new Section("Parent / Guardian Details", rows(
                        field("Father Name", fullName(admission.getFatherFirstName(), admission.getFatherMiddleName(), admission.getFatherLastName())),
                        field("Mother Name", fullName(admission.getMotherFirstName(), admission.getMotherMiddleName(), admission.getMotherLastName())),
                        field("Occupation", admission.getOccupation()),
                        field("Mobile No.", admission.getMobileNo()),
                        field("Email", admission.getStudentEmail()),
                        field("Physically Handicapped", admission.getPhysicallyHandicapped()))),
                new Section("Address Details", rows(
                        field("Village / City", admission.getVillageCity()),
                        field("Taluka", admission.getTal()),
                        field("District", admission.getDist()),
                        field("Pin Code", admission.getPinCode()))),
                new Section("Previous Examination Details", rows(
                        field("School Name", admission.getSchoolName()),
                        field("Year of Passing", admission.getYop()),
                        field("Marks Obtained", admission.getMarksObtained()),
                        field("Total Marks", admission.getTotalMarks()),
                        field("English Marks", admission.getEnglishMarks()),
                        field("Math Marks", admission.getMathMarks()),
                        field("Science Marks", admission.getScienceMarks()),
                        field("Best of Five", admission.getBestOfFiveMarks()))),
                new Section("Admission Details", rows(
                        field("Program", admission.getProgram()),
                        field("Admission Type", admission.getAdmissionType()),
                        field("Category", admission.getCategory()),
                        field("Caste", admission.getCaste()),
                        field("Annual Income", admission.getAnnualIncome()),
                        field("Status", admission.getStatus()))),
                new Section("Documents Submitted", rows(
                        field("Domicile / Nationality", "Submitted"),
                        field("10th Mark Sheet", "Submitted"),
                        field("12th / ITI Mark Sheet", "Submitted"),
                        field("Leaving Certificate", "Submitted"),
                        field("Caste Certificate", "Submitted"),
                        field("Non Creamy Layer", "Submitted"),
                        field("Income Certificate", "Submitted"),
                        field("Defence Certificate", "Submitted"),
                        field("Aadhaar Card", "Submitted"),
                        field("Any Other Document", "Submitted"),
                        field("Student Photo", "Submitted"),
                        field("Undertaking / Anti-ragging", "Submitted"))));

        return renderPdf("First Year Diploma Engineering Admission Form", "Official admission form for office submission", admission.getStudentPhotoPath(), sections);
    }

    public byte[] generateDSYAdmissionForm(DSYAdmission admission) {
        validateDSYAdmission(admission);

        List<Section> sections = List.of(
                new Section("Student Details", rows(
                        field("Application No.", admission.getId()),
                        field("Full Name", fullName(admission.getApplicantFirstName(), admission.getApplicantMiddleName(), admission.getApplicantLastName())),
                        field("Gender", admission.getGender()),
                        field("Date of Birth", admission.getDateOfBirth() == null ? null : admission.getDateOfBirth().format(DATE_FORMAT)),
                        field("Blood Group", admission.getBloodGroup()),
                        field("Aadhaar No.", admission.getAadhaarNo()))),
                new Section("Parent / Guardian Details", rows(
                        field("Father Name", fullName(admission.getFatherFirstName(), admission.getFatherMiddleName(), admission.getFatherLastName())),
                        field("Mother Name", fullName(admission.getMotherFirstName(), admission.getMotherMiddleName(), admission.getMotherLastName())),
                        field("Mobile No.", admission.getMobileNo()),
                        field("Email", admission.getStudentEmail()),
                        field("Physically Handicapped", admission.getPhysicallyHandicapped()))),
                new Section("Address Details", rows(
                        field("Local Address", admission.getLocalAddress()),
                        field("Local Taluka", admission.getLocalTal()),
                        field("Local District", admission.getLocalDist()),
                        field("Local Pin Code", admission.getLocalPinCode()),
                        field("Permanent Address", admission.getPermanentAddress()),
                        field("Permanent Taluka", admission.getPermanentTal()),
                        field("Permanent District", admission.getPermanentDist()),
                        field("Permanent Pin Code", admission.getPermanentPinCode()))),
                new Section("Educational Details", rows(
                        field("Qualification", admission.getEducationalQualification()),
                        field("Institute Name", admission.getInstituteName()),
                        field("Previous Program Code", admission.getPreviousProgramCode()),
                        field("Previous CGPA", admission.getPreviousCGPA()),
                        field("Science Marks", admission.getScienceMarks()))),
                new Section("Admission Details", rows(
                        field("Program", admission.getProgram()),
                        field("Admission Type", admission.getAdmissionType()),
                        field("Category", admission.getCategory()),
                        field("Caste", admission.getCaste()),
                        field("Annual Income", admission.getAnnualIncome()),
                        field("Status", admission.getStatus()))),
                new Section("Documents Submitted", rows(
                        field("Domicile / Nationality", "Submitted"),
                        field("SSC Mark Sheet", "Submitted"),
                        field("HSC Mark Sheet", "Submitted"),
                        field("Caste Certificate", "Submitted"),
                        field("Non Creamy Layer", "Submitted"),
                        field("Aadhaar Card", "Submitted"),
                        field("Student Photo", "Submitted"),
                        field("Undertaking / Anti-ragging", "Submitted"))));

        return renderPdf("Direct Second Year Diploma Engineering Admission Form", "Official admission form for office submission", admission.getStudentPhotoPath(), sections);
    }

    private byte[] renderPdf(String title, String subtitle, String photoPath, List<Section> sections) {
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4, 28, 28, 20, 18);
            PdfWriter.getInstance(document, outputStream);
            document.open();

            PdfPTable header = new PdfPTable(new float[] { 4.5f, 1f });
            header.setWidthPercentage(100);
            header.getDefaultCell().setBorder(Rectangle.NO_BORDER);

            PdfPCell titleCell = new PdfPCell();
            titleCell.setBorder(Rectangle.NO_BORDER);
            titleCell.addElement(new Paragraph("JAIHIND POLYTECHNIC, KURAN", TITLE_FONT));
            titleCell.addElement(new Paragraph(title, new Font(Font.HELVETICA, 11, Font.BOLD, Color.BLACK)));
            titleCell.addElement(new Paragraph(subtitle, SUBTITLE_FONT));
            titleCell.addElement(new Paragraph("Generated for print and office verification", SMALL_FONT));
            header.addCell(titleCell);

            PdfPCell photoCell = new PdfPCell();
            photoCell.setFixedHeight(90);
            photoCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            photoCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            photoCell.setBorderColor(LIGHT_BORDER);
            addPhoto(photoCell, photoPath);
            header.addCell(photoCell);
            document.add(header);

            Paragraph spacer = new Paragraph(" ");
            spacer.setSpacingAfter(4);
            document.add(spacer);

            for (Section section : sections) {
                document.add(sectionTitle(section.title()));
                document.add(detailsTable(section.rows()));
            }

            document.add(sectionTitle("Anti-ragging Undertaking"));
            Paragraph antiRagging = new Paragraph(
                    "I hereby undertake that I will not participate in ragging in any form. I will follow all rules and regulations laid down by DTE, MSBTE and the institute. If any incident of ragging by me comes to the notice of the institute authority, disciplinary action may be taken against me.",
                    SMALL_FONT);
            antiRagging.setSpacingAfter(8);
            document.add(antiRagging);

            PdfPTable signatureTable = new PdfPTable(new float[] { 1f, 1f, 1f });
            signatureTable.setWidthPercentage(100);
            signatureTable.setSpacingBefore(10);
            signatureTable.addCell(signatureCell("Student Signature"));
            signatureTable.addCell(signatureCell("Parent / Guardian Signature"));
            signatureTable.addCell(signatureCell("Office Verification"));
            document.add(signatureTable);

            Paragraph footer = new Paragraph("Declaration: I confirm that the information printed above is true and all required documents have been submitted for verification.", SMALL_FONT);
            footer.setSpacingBefore(7);
            document.add(footer);

            document.close();
            return outputStream.toByteArray();
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to generate admission PDF", ex);
        }
    }

    private void addPhoto(PdfPCell photoCell, String photoPath) {
        try {
            Path path = Paths.get(photoPath);
            if (!Files.exists(path)) {
                photoCell.addElement(new Paragraph("Photo submitted", SMALL_FONT));
                return;
            }
            Image image = Image.getInstance(Files.readAllBytes(path));
            image.scaleToFit(62, 76);
            image.setAlignment(Image.ALIGN_CENTER);
            photoCell.addElement(image);
        } catch (Exception ex) {
            photoCell.addElement(new Paragraph("Photo submitted", SMALL_FONT));
        }
    }

    private PdfPTable detailsTable(List<Field> fields) {
        PdfPTable table = new PdfPTable(new float[] { 1.05f, 1.45f, 1.05f, 1.45f });
        table.setWidthPercentage(100);
        table.setSpacingAfter(6);
        for (Field field : fields) {
            table.addCell(labelCell(field.label()));
            table.addCell(valueCell(field.value()));
        }
        if (fields.size() % 2 != 0) {
            table.addCell(labelCell(""));
            table.addCell(valueCell(""));
        }
        return table;
    }

    private PdfPTable sectionTitle(String title) {
        PdfPTable table = new PdfPTable(1);
        table.setWidthPercentage(100);
        PdfPCell cell = new PdfPCell(new Phrase(title, SECTION_FONT));
        cell.setBackgroundColor(HEADER_BLUE);
        cell.setBorderColor(HEADER_BLUE);
        cell.setPadding(5);
        table.addCell(cell);
        return table;
    }

    private PdfPCell labelCell(String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, LABEL_FONT));
        cell.setBorderColor(LIGHT_BORDER);
        cell.setBackgroundColor(new Color(247, 250, 252));
        cell.setPadding(4);
        cell.setMinimumHeight(17);
        return cell;
    }

    private PdfPCell valueCell(String text) {
        PdfPCell cell = new PdfPCell(new Phrase(blankToDash(text), VALUE_FONT));
        cell.setBorderColor(LIGHT_BORDER);
        cell.setPadding(4);
        cell.setMinimumHeight(17);
        return cell;
    }

    private PdfPCell signatureCell(String label) {
        PdfPCell cell = new PdfPCell(new Phrase("\n\n" + label, SMALL_FONT));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setBorderColor(LIGHT_BORDER);
        cell.setMinimumHeight(54);
        return cell;
    }

    private void validateFYAdmission(FYAdmission admission) {
        List<String> missing = new ArrayList<>();
        require(missing, "Applicant first name", admission::getApplicantFirstName);
        require(missing, "Applicant last name", admission::getApplicantLastName);
        require(missing, "Father first name", admission::getFatherFirstName);
        require(missing, "Mother first name", admission::getMotherFirstName);
        require(missing, "Village / City", admission::getVillageCity);
        require(missing, "Taluka", admission::getTal);
        require(missing, "District", admission::getDist);
        require(missing, "Pin Code", admission::getPinCode);
        require(missing, "Mobile No.", admission::getMobileNo);
        require(missing, "Student Email", admission::getStudentEmail);
        require(missing, "Gender", admission::getGender);
        require(missing, "Date of Birth", admission::getDateOfBirth);
        require(missing, "Aadhaar No.", admission::getAadhaarNo);
        require(missing, "School Name", admission::getSchoolName);
        require(missing, "Year of Passing", admission::getYop);
        require(missing, "Marks Obtained", admission::getMarksObtained);
        require(missing, "Total Marks", admission::getTotalMarks);
        require(missing, "Program", admission::getProgram);
        require(missing, "Category", admission::getCategory);
        require(missing, "Admission Type", admission::getAdmissionType);
        require(missing, "Domicile / Nationality Certificate", admission::getDomicileCertificatePath);
        require(missing, "10th Mark Sheet", admission::getTenthMarkSheetPath);
        require(missing, "12th / ITI Mark Sheet", admission::getTwelfthMarkSheetPath);
        require(missing, "Leaving Certificate", admission::getLeavingCertificatePath);
        require(missing, "Caste Certificate", admission::getCasteCertificatePath);
        require(missing, "Non Creamy Layer Certificate", admission::getNonCreamyLayerCertificatePath);
        require(missing, "Income Certificate", admission::getIncomeCertificatePath);
        require(missing, "Defence Certificate", admission::getDefenceCertificatePath);
        require(missing, "Aadhaar Card", admission::getAadhaarCardPath);
        require(missing, "Any Other Document", admission::getAnyOtherDocumentPath);
        require(missing, "Student Photo", admission::getStudentPhotoPath);
        require(missing, "Undertaking / Anti-ragging Form", admission::getUndertakingFormPath);
        rejectIfMissing(missing);
    }

    private void validateDSYAdmission(DSYAdmission admission) {
        List<String> missing = new ArrayList<>();
        require(missing, "Applicant first name", admission::getApplicantFirstName);
        require(missing, "Applicant last name", admission::getApplicantLastName);
        require(missing, "Father first name", admission::getFatherFirstName);
        require(missing, "Mother first name", admission::getMotherFirstName);
        require(missing, "Local Address", admission::getLocalAddress);
        require(missing, "Local Taluka", admission::getLocalTal);
        require(missing, "Local District", admission::getLocalDist);
        require(missing, "Local Pin Code", admission::getLocalPinCode);
        require(missing, "Permanent Address", admission::getPermanentAddress);
        require(missing, "Permanent Taluka", admission::getPermanentTal);
        require(missing, "Permanent District", admission::getPermanentDist);
        require(missing, "Permanent Pin Code", admission::getPermanentPinCode);
        require(missing, "Mobile No.", admission::getMobileNo);
        require(missing, "Student Email", admission::getStudentEmail);
        require(missing, "Gender", admission::getGender);
        require(missing, "Date of Birth", admission::getDateOfBirth);
        require(missing, "Aadhaar No.", admission::getAadhaarNo);
        require(missing, "Educational Qualification", admission::getEducationalQualification);
        require(missing, "Program", admission::getProgram);
        require(missing, "Category", admission::getCategory);
        require(missing, "Admission Type", admission::getAdmissionType);
        require(missing, "Domicile / Nationality Certificate", admission::getDomicileCertificatePath);
        require(missing, "SSC Mark Sheet", admission::getSscMarkSheetPath);
        require(missing, "HSC Mark Sheet", admission::getHscMarkSheetPath);
        require(missing, "Caste Certificate", admission::getCasteCertificatePath);
        require(missing, "Non Creamy Layer Certificate", admission::getNonCreamyLayerCertificatePath);
        require(missing, "Aadhaar Card", admission::getAadhaarCardPath);
        require(missing, "Student Photo", admission::getStudentPhotoPath);
        require(missing, "Undertaking / Anti-ragging Form", admission::getUndertakingFormPath);
        rejectIfMissing(missing);
    }

    private void rejectIfMissing(List<String> missing) {
        if (!missing.isEmpty()) {
            throw new IllegalArgumentException("Admission form PDF can be downloaded only after all information and required attachments are submitted. Missing: " + String.join(", ", missing));
        }
    }

    private void require(List<String> missing, String label, Supplier<?> supplier) {
        Object value = supplier.get();
        if (value == null || (value instanceof String text && text.isBlank())) {
            missing.add(label);
        }
    }

    private List<Field> rows(Field... fields) {
        return List.of(fields);
    }

    private Field field(String label, Object value) {
        return new Field(label, value == null ? "" : String.valueOf(value));
    }

    private String fullName(String firstName, String middleName, String lastName) {
        return java.util.stream.Stream.of(firstName, middleName, lastName)
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .collect(Collectors.joining(" "));
    }

    private String blankToDash(String value) {
        return value == null || value.isBlank() ? "-" : value;
    }

    private record Section(String title, List<Field> rows) {
    }

    private record Field(String label, String value) {
    }
}
