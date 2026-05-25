package com.web.dto.request.user;

import com.web.utils.validation.ValidPassword;
import jakarta.validation.constraints.NotBlank;

public record ChangePasswordRequest(@NotBlank @ValidPassword String oldPassword, @NotBlank @ValidPassword String newPassword) {}
