package com.college.colllege_backend.service;

import java.util.List;
import java.util.Map;

public interface HomePageService {
    Map<String, Object> getHomePage();

    Map<String, Object> updateHomePage(Map<String, Object> request);

    List<Map<String, Object>> getEditableContent();
}
