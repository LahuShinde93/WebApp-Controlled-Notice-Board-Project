package com.noticeboard.service;

import com.noticeboard.dto.request.LoginRequest;
import com.noticeboard.dto.request.RegisterRequest;
import com.noticeboard.dto.response.AuthResponse;

public interface AuthService {
    
    AuthResponse register(RegisterRequest request);
    
    AuthResponse login(LoginRequest request);
}
