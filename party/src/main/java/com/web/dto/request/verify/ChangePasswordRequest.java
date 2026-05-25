package com.web.dto.request.verify;

import com.web.utils.validation.ValidPassword;
import jakarta.validation.constraints.NotBlank;

public record ChangePasswordRequest(
        @NotBlank String oldPassword,
        @NotBlank @ValidPassword String newPassword
) {}