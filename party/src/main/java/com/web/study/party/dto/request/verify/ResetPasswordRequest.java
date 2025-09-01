package com.web.study.party.dto.request.verify;

import com.web.study.party.utils.validation.ValidPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ResetPasswordRequest(
        @NotBlank @Email String email,
        @NotBlank String otp,
        @NotBlank @ValidPassword String newPassword
) {}