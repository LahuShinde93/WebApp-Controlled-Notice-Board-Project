package com.noticeboard.controller;

import com.noticeboard.dto.request.LoginRequest;
import com.noticeboard.dto.request.RegisterRequest;
import com.noticeboard.dto.response.ApiResponse;
import com.noticeboard.dto.response.AuthResponse;
import com.noticeboard.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final AuthService authService;
    
    /**
     * Register a new user
     * POST /api/auth/register
     * Request Body: { "name": "John Doe", "email": "john@example.com", "password": "password123" }
     * Response: { "status": "SUCCESS", "message": "User registered successfully", "data": { "token": "...", "email": "...", "name": "...", "role": "..." } }
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        log.info("POST /api/auth/register - Register request for email: {}", request.getEmail());
        AuthResponse response = authService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", response));
    }
    
    /**
     * Login user
     * POST /api/auth/login
     * Request Body: { "email": "john@example.com", "password": "password123" }
     * Response: { "status": "SUCCESS", "message": "Login successful", "data": { "token": "...", "email": "...", "name": "...", "role": "..." } }
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        log.info("POST /api/auth/login - Login request for email: {}", request.getEmail());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }
}
