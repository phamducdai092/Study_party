package com.web.study.party.exeption;

import org.springframework.security.core.AuthenticationException;

public class UnverifiedAccountException extends AuthenticationException {
    public UnverifiedAccountException(String msg) { super(msg); }
    public UnverifiedAccountException(String msg, Throwable cause) { super(msg, cause); }
}
