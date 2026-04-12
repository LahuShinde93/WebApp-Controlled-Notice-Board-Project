package com.noticeboard.service.impl;

import com.noticeboard.dao.CategoryDao;
import com.noticeboard.dto.request.CategoryRequest;
import com.noticeboard.exception.ResourceAlreadyExistsException;
import com.noticeboard.exception.ResourceNotFoundException;
import com.noticeboard.model.Category;
import com.noticeboard.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService {
    
    private final CategoryDao categoryDao;
    
    @Override
    public Category createCategory(CategoryRequest request) {
        log.info("Creating category: {}", request.getName());
        
        if (categoryDao.existsByName(request.getName())) {
            throw new ResourceAlreadyExistsException("Category with name " + request.getName() + " already exists");
        }
        
        Category category = new Category();
        category.setName(request.getName());
        category.setIcon(request.getIcon() != null ? request.getIcon() : "fas fa-folder");
        category.setCount(0);
        category.setCreatedAt(LocalDateTime.now());
        category.setUpdatedAt(LocalDateTime.now());
        
        Category savedCategory = categoryDao.save(category);
        log.info("Category created successfully: {}", savedCategory.getName());
        return savedCategory;
    }
    
    @Override
    public List<Category> getAllCategories() {
        log.info("Fetching all categories");
        return categoryDao.findAll();
    }
    
    @Override
    public Category getCategoryById(String id) {
        log.info("Fetching category with ID: {}", id);
        return categoryDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
    }
    
    @Override
    public void deleteCategory(String id) {
        log.info("Deleting category with ID: {}", id);
        
        Category category = categoryDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        
        categoryDao.deleteById(id);
        log.info("Category deleted successfully: {}", category.getName());
    }
    
    @Override
    public Category updateCategory(String id, CategoryRequest request) {
        log.info("Updating category with ID: {}", id);
        
        Category category = categoryDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        
        if (!category.getName().equals(request.getName()) && categoryDao.existsByName(request.getName())) {
            throw new ResourceAlreadyExistsException("Category with name " + request.getName() + " already exists");
        }
        
        category.setName(request.getName());
        if (request.getIcon() != null) {
            category.setIcon(request.getIcon());
        }
        category.setUpdatedAt(LocalDateTime.now());
        
        Category updatedCategory = categoryDao.save(category);
        log.info("Category updated successfully: {}", updatedCategory.getName());
        return updatedCategory;
    }
}
