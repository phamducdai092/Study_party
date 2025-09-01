package com.web.study.party.dto.request.user;

import com.web.study.party.utils.validation.ValidPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank @ValidPassword  String password
) {
}