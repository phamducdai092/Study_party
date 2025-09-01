package com.web.study.party.dto.response.auth;

public record AuthResponse(String accessToken, String refreshToken, Long refreshTtlSeconds, Long userId, String email, String role) {}