package com.web.study.party.dto.request.user;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public record UserInformationUpdateRequest(
        @Pattern(regexp="^https?://.*$", message="avatarUrl must be URL") String avatarUrl,
        @Pattern(regexp="^https?://.*$", message="bannerUrl must be URL") String bannerUrl,
        @Size(max = 60) String displayName,
        @Size(max = 200) String bio,
        String phoneNumber,
        Instant dateOfBirth
) {}
