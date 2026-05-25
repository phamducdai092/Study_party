package com.web.entities.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Role implements EnumMeta {
    USER("USER", "User", "Người dùng thường", "zinc", "User", 10, true),
    ADMIN("ADMIN", "Admin", "Quản trị hệ thống", "red", "ShieldAlert", 20, true);

    private final String code;
    private final String label;
    private final String description;
    private final String color;
    private final String icon;
    private final int order;
    private final boolean active;
}
