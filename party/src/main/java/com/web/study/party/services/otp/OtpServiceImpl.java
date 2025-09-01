package com.web.study.party.services.otp;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {
    private final StringRedisTemplate redis;
    private static final SecureRandom RND = new SecureRandom();

    private static String otp6() {
        int n = 100000 + RND.nextInt(900000);
        return String.valueOf(n);
    }

    @Override
    public String generateAndStore(String key, int ttlSeconds) {
        String otp = otp6();
        redis.opsForValue().set(key, otp, Duration.ofSeconds(ttlSeconds));
        return otp;
    }

    @Override
    public boolean validateAndConsume(String key, String otp) {
        String val = redis.opsForValue().get(key);
        if (val != null && val.equals(otp)) {
            redis.delete(key);
            return true;
        }
        return false;
    }
}
