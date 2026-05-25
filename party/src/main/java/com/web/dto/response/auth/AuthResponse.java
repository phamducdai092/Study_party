package com.web.dto.response.auth;

import com.web.dto.user.UserDTO;

public record AuthResponse(String accessToken, String refreshToken, Long refreshTtlSeconds, UserDTO user) {}