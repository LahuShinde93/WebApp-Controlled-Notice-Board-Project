package com.noticeboard.service.impl;

import com.noticeboard.dao.UserDao;
import com.noticeboard.dto.request.LoginRequest;
import com.noticeboard.dto.request.RegisterRequest;
import com.noticeboard.dto.response.AuthResponse;
import com.noticeboard.exception.ResourceAlreadyExistsException;
import com.noticeboard.exception.UnauthorizedException;
import com.noticeboard.model.User;
import com.noticeboard.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {
    
    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);
    
    private final UserDao userDao;
    
    public AuthServiceImpl(UserDao userDao) {
        this.userDao = userDao;
    }
    
    @Override
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering user with email: {}", request.getEmail());
        
        if (userDao.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("User with email " + request.getEmail() + " already exists");
        }
        
        // Validate role
        String role = request.getRole();
        if (role == null || (!role.equals("ADMIN") && !role.equals("STUDENT"))) {
            role = "STUDENT"; // Default to STUDENT if invalid
        }
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // Store password as-is (not recommended for production)
        user.setRole(role);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        User savedUser = userDao.save(user);
        
        log.info("User registered successfully: {} with role: {}", savedUser.getEmail(), savedUser.getRole());
        return new AuthResponse(savedUser.getEmail(), savedUser.getName(), savedUser.getRole());
    }
    
    @Override
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        
        User user = userDao.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
        
        if (!user.getPassword().equals(request.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }
        
        log.info("User logged in successfully: {}", user.getEmail());
        return new AuthResponse(user.getEmail(), user.getName(), user.getRole());
    }
}
