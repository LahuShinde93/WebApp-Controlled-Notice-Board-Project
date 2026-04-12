package com.noticeboard.dao.impl;

import com.noticeboard.dao.CategoryDao;
import com.noticeboard.model.Category;
import com.noticeboard.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CategoryDaoImpl implements CategoryDao {
    
    private final CategoryRepository categoryRepository;
    
    @Override
    public Category save(Category category) {
        return categoryRepository.save(category);
    }
    
    @Override
    public Optional<Category> findById(String id) {
        return categoryRepository.findById(id);
    }
    
    @Override
    public Optional<Category> findByName(String name) {
        return categoryRepository.findByName(name);
    }
    
    @Override
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }
    
    @Override
    public void deleteById(String id) {
        categoryRepository.deleteById(id);
    }
    
    @Override
    public boolean existsByName(String name) {
        return categoryRepository.existsByName(name);
    }
    
    @Override
    public Long count() {
        return categoryRepository.count();
    }
}
