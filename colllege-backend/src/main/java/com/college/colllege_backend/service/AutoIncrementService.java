package com.college.colllege_backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
public class AutoIncrementService {
    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public void resetNextId(String tableName) {
        if (!"users".equals(tableName) && !"courses".equals(tableName)) {
            throw new IllegalArgumentException("Unsupported table for auto-increment reset");
        }
        Number maxId = (Number) entityManager.createNativeQuery("SELECT COALESCE(MAX(id), 0) FROM " + tableName).getSingleResult();
        long nextId = maxId.longValue() + 1;
        entityManager.createNativeQuery("ALTER TABLE " + tableName + " AUTO_INCREMENT = " + nextId).executeUpdate();
    }
}
