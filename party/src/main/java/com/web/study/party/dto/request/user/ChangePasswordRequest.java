package com.web.study.party.dto.request.user;

import com.web.study.party.utils.validation.ValidPassword;
import jakarta.validation.constraints.NotBlank;

public record ChangePasswordRequest(@NotBlank @ValidPassword String oldPassword, @NotBlank @ValidPassword String newPassword) {}
