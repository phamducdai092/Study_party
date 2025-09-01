package com.web.study.party.dto;

public record TokenPair(String accessToken, String refreshToken, long refreshTtlSeconds) {}