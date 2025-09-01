package com.web.study.party.session;

public interface RefreshTokenStore {
    void save(String jti, Long userId, long ttlSeconds);
    boolean exists(String jti);
    void delete(String jti);
    void deleteAllByUser(Long userId); // dùng khi change password/logout all
}