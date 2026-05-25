package com.web.dto;

public record TokenPair(String accessToken, String refreshToken, long refreshTtlSeconds) {}