package com.web.study.party.dto.response.user;

import java.time.Instant;

public record UserInformationResponse(
        Long id,
        String email,
        String avatarUrl,
        String bannerUrl,
        String displayName,
        String bio,
        String phoneNumber,
        Instant dateOfBirth
) {
}
