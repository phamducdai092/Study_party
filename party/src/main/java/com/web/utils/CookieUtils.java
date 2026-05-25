package com.web.utils;

import com.web.jwt.JwtProperties;
import org.springframework.http.ResponseCookie;

import java.time.Duration;

public final class CookieUtils {
    private CookieUtils() {}

    public static ResponseCookie buildRefreshCookie(JwtProperties props, String refreshJwt, long ttlSeconds) {
        ResponseCookie.ResponseCookieBuilder b = ResponseCookie.from(props.getRefreshCookieName(), refreshJwt)
                .httpOnly(true)
                .secure(props.isRefreshCookieSecure())
                .path(props.getRefreshCookiePath())
                .maxAge(Duration.ofSeconds(ttlSeconds));

        // SameSite
        b.sameSite(props.getRefreshCookieSameSite());
        // Domain (optional)
        if (props.getRefreshCookieDomain() != null && !props.getRefreshCookieDomain().isBlank()) {
            b.domain(props.getRefreshCookieDomain());
        }
        return b.build();
    }

    public static ResponseCookie clearRefreshCookie(JwtProperties props) {
        ResponseCookie.ResponseCookieBuilder b = ResponseCookie.from(props.getRefreshCookieName(), "")
                .httpOnly(true)
                .secure(props.isRefreshCookieSecure())
                .path(props.getRefreshCookiePath())
                .maxAge(0);
        b.sameSite(props.getRefreshCookieSameSite());
        if (props.getRefreshCookieDomain() != null && !props.getRefreshCookieDomain().isBlank()) {
            b.domain(props.getRefreshCookieDomain());
        }
        return b.build();
    }
}
