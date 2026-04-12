package com.noticeboard.dao;

import com.noticeboard.model.User;

import java.util.Optional;

public interface UserDao {
    
    User save(User user);
    
    Optional<User> findById(String id);
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
}
