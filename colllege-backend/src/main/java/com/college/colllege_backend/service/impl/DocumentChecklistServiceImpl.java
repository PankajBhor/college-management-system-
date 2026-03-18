package com.college.colllege_backend.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.college.colllege_backend.dto.DocumentChecklistDTO;
import com.college.colllege_backend.entity.DocumentChecklist;
import com.college.colllege_backend.repository.DocumentChecklistRepository;
import com.college.colllege_backend.service.DocumentChecklistServiceInterface;

@Service
@Transactional
public class DocumentChecklistServiceImpl implements DocumentChecklistServiceInterface {

    @Autowired
    private DocumentChecklistRepository documentChecklistRepository;

    @Override
    public List<DocumentChecklistDTO> getDocumentsByAdmissionType(String admissionType) {
        List<DocumentChecklist> checklists = documentChecklistRepository
                .findByAdmissionTypeOrderBySequenceOrder(admissionType);
        return checklists.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void initializeDefaultDocuments() {
        // FY (First Year) Documents - 10 documents
        String[] fyDocuments = {
            "Domicile / Nationality Certificate",
            "10th Mark sheet",
            "12th/ITI Mark sheet",
            "Leaving Certificate",
            "Caste Certificate",
            "Non Creamy Layer certificate",
            "Income Certificate",
            "Defence Certificate",
            "Aadhaar Card",
            "Any Other"
        };

        // DSY (Direct Second Year) Documents - 7 documents
        String[] dsyDocuments = {
            "Domicile / Nationality Certificate",
            "Leaving Certificate from Previous Institute",
            "Caste Certificate",
            "Non Creamy Layer certificate (valid up to 31 March)",
            "Income Certificate",
            "Xerox copy of Aadhaar Card",
            "Mark sheets from previous program"
        };

        // Check if documents already exist
        if (documentChecklistRepository.findByAdmissionTypeOrderBySequenceOrder("FY").isEmpty()) {
            for (int i = 0; i < fyDocuments.length; i++) {
                DocumentChecklist doc = new DocumentChecklist();
                doc.setAdmissionType("FY");
                doc.setDocumentName(fyDocuments[i]);
                doc.setIsRequired(true);
                doc.setSequenceOrder(i + 1);
                documentChecklistRepository.save(doc);
            }
        }

        if (documentChecklistRepository.findByAdmissionTypeOrderBySequenceOrder("DSY").isEmpty()) {
            for (int i = 0; i < dsyDocuments.length; i++) {
                DocumentChecklist doc = new DocumentChecklist();
                doc.setAdmissionType("DSY");
                doc.setDocumentName(dsyDocuments[i]);
                doc.setIsRequired(true);
                doc.setSequenceOrder(i + 1);
                documentChecklistRepository.save(doc);
            }
        }
    }

    private DocumentChecklistDTO mapToDTO(DocumentChecklist entity) {
        return new DocumentChecklistDTO(
                entity.getAdmissionType(),
                entity.getDocumentName(),
                entity.getIsRequired(),
                entity.getSequenceOrder()
        );
    }
}
