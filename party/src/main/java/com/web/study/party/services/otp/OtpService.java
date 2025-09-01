package com.web.study.party.services.otp;

public interface OtpService {
    String generateAndStore(String key, int ttlSeconds);
    boolean validateAndConsume(String key, String otp);
}
