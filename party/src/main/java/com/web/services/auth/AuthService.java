package com.web.services.auth;

import com.web.dto.TokenPair;
import com.web.dto.request.user.LoginRequest;
import com.web.dto.request.user.RegisterRequest;
import com.web.study.party.dto.request.user.*;
import com.web.dto.response.TokenResponse;
import com.web.dto.response.auth.AuthResponse;

public interface AuthService {
    void register(RegisterRequest req);
    AuthResponse login(LoginRequest req, String ip, String ua);
    TokenResponse googleLogin(String idToken);
    TokenPair refresh(String refreshToken, String ip, String ua);
    void logout(String refreshToken);
}
