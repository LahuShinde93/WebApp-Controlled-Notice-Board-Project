package com.noticeboard.controller;

import com.noticeboard.dto.request.CategoryRequest;
import com.noticeboard.dto.response.ApiResponse;
import com.noticeboard.model.Category;
import com.noticeboard.service.CategoryService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {
    
    private static final Logger log = LoggerFactory.getLogger(CategoryController.class);
    
    private final CategoryService categoryService;
    
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }
    
    /**
     * Create a new category
     * POST /api/categories
     * Request Body: { "name": "Academic", "icon": "fas fa-graduation-cap" }
     * Response: { "status": "SUCCESS", "message": "Category created successfully", "data": {...} }
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Category>> createCategory(@Valid @RequestBody CategoryRequest request) {
        log.info("POST /api/categories - Creating category: {}", request.getName());
        Category category = categoryService.createCategory(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Category created successfully", category));
    }
    
    /**
     * Get all categories
     * GET /api/categories
     * Response: { "status": "SUCCESS", "message": "Categories retrieved successfully", "data": [...] }
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        log.info("GET /api/categories - Fetching all categories");
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved successfully", categories));
    }
    
    /**
     * Get category by ID
     * GET /api/categories/{id}
     * Response: { "status": "SUCCESS", "message": "Category retrieved successfully", "data": {...} }
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> getCategoryById(@PathVariable String id) {
        log.info("GET /api/categories/{} - Fetching category", id);
        Category category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.success("Category retrieved successfully", category));
    }
    
    /**
     * Update a category
     * PUT /api/categories/{id}
     * Request Body: { "name": "Updated Name", "icon": "fas fa-folder" }
     * Response: { "status": "SUCCESS", "message": "Category updated successfully", "data": {...} }
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> updateCategory(
            @PathVariable String id,
            @Valid @RequestBody CategoryRequest request) {
        log.info("PUT /api/categories/{} - Updating category", id);
        Category category = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(ApiResponse.success("Category updated successfully", category));
    }
    
    /**
     * Delete a category
     * DELETE /api/categories/{id}
     * Response: { "status": "SUCCESS", "message": "Category deleted successfully", "data": null }
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable String id) {
        log.info("DELETE /api/categories/{} - Deleting category", id);
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully", null));
    }
}
