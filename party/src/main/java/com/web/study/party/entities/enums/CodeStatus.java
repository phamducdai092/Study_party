package com.web.study.party.entities.enums;

import lombok.Getter;

@Getter
public enum CodeStatus implements EnumMeta {
    SUCCESS(200, "Request was successful"),
    BAD_REQUEST(400, "Bad request"),
    UNAUTHORIZED(401, "Unauthorized access"),
    FORBIDDEN(403, "Forbidden access"),
    NOT_FOUND(404, "Resource not found"),
    INTERNAL_SERVER_ERROR(500, "Internal server error");

    private final int code;       // HTTP code
    private final String message; // default message

    CodeStatus(int code, String message) {
        this.code = code;
        this.message = message;
    }

    // EnumMeta mapping — không đổi constructor cũ
    @Override public String getCode() { return name(); } // FE key ổn định
    public int getHttpCode() { return this.code; } // lấy HTTP code
    @Override public String getLabel() { return name(); }
    @Override public String getDescription() { return "HTTP " + code; }
    @Override public String getColor() {
        int c = this.code;
        if (c >= 200 && c < 300) return "green";
        if (c >= 400 && c < 500) return (c == 404 ? "zinc" : "amber");
        return "red";
    }
    @Override public String getIcon() {
        return switch (this) {
            case SUCCESS -> "CheckCircle2";
            case BAD_REQUEST -> "CircleAlert";
            case UNAUTHORIZED -> "Lock";
            case FORBIDDEN -> "ShieldX";
            case NOT_FOUND -> "SearchX";
            case INTERNAL_SERVER_ERROR -> "ServerCrash";
        };
    }
    @Override public int getOrder() { return this.code; } // sort theo HTTP code
}
