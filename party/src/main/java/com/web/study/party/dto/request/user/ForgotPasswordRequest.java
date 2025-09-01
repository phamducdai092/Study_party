package com.web.study.party.dto.request.user;

import jakarta.validation.constraints.Email;

public record ForgotPasswordRequest(@Email String email) {}