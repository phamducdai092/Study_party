package com.web.services.otp;

public interface OtpService {
    String generateAndStore(String key, int ttlSeconds);
    boolean validateAndConsume(String key, String otp);
}
