package com.noticeboard.dao;

import com.noticeboard.model.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryDao {
    
    Category save(Category category);
    
    Optional<Category> findById(String id);
    
    Optional<Category> findByName(String name);
    
    List<Category> findAll();
    
    void deleteById(String id);
    
    boolean existsByName(String name);
    
    Long count();
}
