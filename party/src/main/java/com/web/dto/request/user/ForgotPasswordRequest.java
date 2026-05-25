package com.web.dto.request.user;

import jakarta.validation.constraints.Email;

public record ForgotPasswordRequest(@Email String email) {}