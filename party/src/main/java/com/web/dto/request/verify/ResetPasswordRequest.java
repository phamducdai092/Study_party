package com.web.dto.request.verify;

import com.web.utils.validation.ValidPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ResetPasswordRequest(
        @NotBlank @Email String email,
        @NotBlank String otp,
        @NotBlank @ValidPassword String newPassword
) {}