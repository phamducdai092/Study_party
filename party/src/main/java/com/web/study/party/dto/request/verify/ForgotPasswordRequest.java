package com.web.study.party.dto.request.verify;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequest(
        @NotBlank @Email String email
) {}