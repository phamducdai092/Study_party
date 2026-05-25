package com.web.dto.response.user;

public record UserBrief(
        Long id,
        String displayName,
        String email,
        String avatarUrl
) {
}
