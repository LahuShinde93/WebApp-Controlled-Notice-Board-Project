package com.noticeboard.service;

import com.noticeboard.dto.request.CategoryRequest;
import com.noticeboard.model.Category;

import java.util.List;

public interface CategoryService {
    
    Category createCategory(CategoryRequest request);
    
    List<Category> getAllCategories();
    
    Category getCategoryById(String id);
    
    void deleteCategory(String id);
    
    Category updateCategory(String id, CategoryRequest request);
}
