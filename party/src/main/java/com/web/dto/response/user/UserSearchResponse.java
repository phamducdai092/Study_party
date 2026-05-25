package com.web.dto.response.user;

public record   UserSearchResponse(
        Long id,
        String email,
        String displayName,
        String avatarUrl
) {
}
