package com.web.study.party.session;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.util.Set;

@Repository
@RequiredArgsConstructor
public class RedisRefreshTokenStore implements RefreshTokenStore {
    private final StringRedisTemplate redis;
    private static final String KEY = "refresh:"; // refresh:{jti}
    private static final String IDX = "refresh_idx:"; // refresh_idx:{userId} -> Set<jti>

    @Override
    public void save(String jti, Long userId, long ttlSeconds) {
        redis.opsForValue().set(KEY + jti, String.valueOf(userId), Duration.ofSeconds(ttlSeconds));
        redis.opsForSet().add(IDX + userId, jti);
        redis.expire(IDX + userId, Duration.ofSeconds(ttlSeconds));
    }

    @Override
    public boolean exists(String jti) {
        return redis.hasKey(KEY + jti);
    }

    @Override
    public void delete(String jti) {
        // lấy userId để xoá index
        String userId = redis.opsForValue().get(KEY + jti);
        if (userId != null) {
            redis.opsForSet().remove(IDX + userId, jti);
        }
        redis.delete(KEY + jti);
    }

    @Override
    public void deleteAllByUser(Long userId) {
        String idxKey = IDX + userId;
        Set<String> all = redis.opsForSet().members(idxKey);
        if (all != null) {
            all.forEach(jti -> redis.delete(KEY + jti));
        }
        redis.delete(idxKey);
    }
}