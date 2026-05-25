package com.web.dto.request.user;

import com.web.utils.validation.ValidPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
  @NotBlank @Email String email,
  @NotBlank @ValidPassword String password
) {}