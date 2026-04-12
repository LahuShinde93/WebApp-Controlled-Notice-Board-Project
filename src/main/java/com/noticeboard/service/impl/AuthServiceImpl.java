package com.noticeboard.service.impl;

import com.noticeboard.dao.UserDao;
import com.noticeboard.dto.request.LoginRequest;
import com.noticeboard.dto.request.RegisterRequest;
import com.noticeboard.dto.response.AuthResponse;
import com.noticeboard.exception.ResourceAlreadyExistsException;
import com.noticeboard.exception.UnauthorizedException;
import com.noticeboard.model.User;
import com.noticeboard.service.AuthService;
import com.noticeboard.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
    
    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    @Override
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering user with email: {}", request.getEmail());
        
        if (userDao.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("User with email " + request.getEmail() + " already exists");
        }
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("ADMIN");
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        User savedUser = userDao.save(user);
        String token = jwtUtil.generateToken(savedUser.getEmail());
        
        log.info("User registered successfully: {}", savedUser.getEmail());
        return new AuthResponse(token, savedUser.getEmail(), savedUser.getName(), savedUser.getRole());
    }
    
    @Override
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        
        User user = userDao.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }
        
        String token = jwtUtil.generateToken(user.getEmail());
        
        log.info("User logged in successfully: {}", user.getEmail());
        return new AuthResponse(token, user.getEmail(), user.getName(), user.getRole());
    }
}
