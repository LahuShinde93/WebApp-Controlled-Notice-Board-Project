package com.noticeboard.dao.impl;

import com.noticeboard.dao.UserDao;
import com.noticeboard.model.User;
import com.noticeboard.repository.UserRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UserDaoImpl implements UserDao {
    
    private final UserRepository userRepository;
    
    public UserDaoImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Override
    public User save(User user) {
        return userRepository.save(user);
    }
    
    @Override
    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }
    
    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
