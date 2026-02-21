import { formatDate } from './formatters';
import jsPDF from 'jspdf';

/**
 * Export enquiries to Excel format
 */
export const exportToExcel = (enquiries) => {
  try {
    // Create CSV content
    const headers = ['S.No', 'Name', 'Email', 'Phone', 'Admission For', 'Location', 'Category', 'Status', 'Date'];
    
    const rows = enquiries.map((enquiry, index) => {
      const fullName = `${enquiry.firstName} ${enquiry.middleName ? enquiry.middleName + ' ' : ''}${enquiry.lastName}`.trim();
      return [
        index + 1,
        fullName,
        enquiry.email,
        enquiry.personalMobileNumber,
        enquiry.admissionFor || '-',
        enquiry.location === 'Other' ? enquiry.otherLocation : enquiry.location,
        enquiry.category || '-',
        enquiry.status,
        formatDate(enquiry.enquiryDate)
      ];
    });

    // Convert to CSV string
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(cell => {
        // Escape quotes and wrap in quotes if contains comma
        const escaped = String(cell).replace(/"/g, '""');
        return escaped.includes(',') ? `"${escaped}"` : escaped;
      }).join(',') + '\n';
    });

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `enquiries_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw new Error('Failed to export to Excel');
  }
};

/**
 * Export enquiries to PDF format
 */
export const exportToPDF = (enquiries) => {
  try {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    let yPosition = 20;

    // Add title
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Enquiry Report', margin, yPosition);

    // Add date
    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, yPosition);

    // Add table headers
    yPosition += 12;
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(255);
    doc.setFillColor(37, 99, 235); // Blue background
    
    const colWidths = [12, 30, 35, 25, 20, 25]; // S.No, Name, Email, Phone, Status, Date
    const headers = ['S.No', 'Name', 'Email', 'Phone', 'Status', 'Date'];
    let xPosition = margin;
    
    headers.forEach((header, i) => {
      doc.rect(xPosition, yPosition - 7, colWidths[i], 8, 'F');
      doc.text(header, xPosition + 1, yPosition - 2);
      xPosition += colWidths[i];
    });

    // Add table rows
    yPosition += 8;
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0);
    
    let rowCount = 0;
    enquiries.forEach((enquiry, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = margin;
      }

      const fullName = `${enquiry.firstName} ${enquiry.middleName ? enquiry.middleName + ' ' : ''}${enquiry.lastName}`.trim();
      const rowData = [
        String(index + 1),
        fullName.substring(0, 20),
        enquiry.email.substring(0, 20),
        enquiry.personalMobileNumber.substring(0, 15),
        enquiry.status,
        formatDate(enquiry.enquiryDate)
      ];

      // Alternate row background
      if (rowCount % 2 === 0) {
        doc.setFillColor(245, 247, 250);
        xPosition = margin;
        headers.forEach((_, i) => {
          doc.rect(xPosition, yPosition - 7, colWidths[i], 8, 'F');
          xPosition += colWidths[i];
        });
      }

      // Add row data
      xPosition = margin;
      rowData.forEach((cell, i) => {
        doc.text(String(cell), xPosition + 1, yPosition - 2);
        xPosition += colWidths[i];
      });

      yPosition += 8;
      rowCount++;
    });

    // Add footer with page numbers
    const totalPages = doc.internal.pages.length - 1;
    if (totalPages > 0) {
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Page ${i} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }
    }

    // Save PDF
    doc.save(`enquiries_${new Date().getTime()}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export to PDF: ' + error.message);
  }
};
