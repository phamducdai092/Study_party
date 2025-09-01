package com.web.study.party.dto.request.verify;

import com.web.study.party.utils.validation.ValidPassword;
import jakarta.validation.constraints.NotBlank;

public record ChangePasswordRequest(
        @NotBlank String oldPassword,
        @NotBlank @ValidPassword String newPassword
) {}