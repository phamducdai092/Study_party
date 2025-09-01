package com.web.study.party.dto.request.user;

import jakarta.validation.constraints.NotBlank;

public record ResetPasswordRequest(@NotBlank String token, @NotBlank String newPassword) {}