package com.web.study.party.entities.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AccountStatus implements EnumMeta {

    ACTIVE("ACTIVE", "Active", "Tài khoản đang hoạt động", "green", "ShieldCheck", 10, true),
    BANNED("BANNED", "Banned", "Bị khoá do vi phạm", "red", "OctagonAlert", 20, true),
    DEACTIVATED("DEACTIVATED", "Deactivated", "Người dùng tự vô hiệu", "zinc", "UserX", 30, true);

    private final String code;
    private final String label;
    private final String description;
    private final String color;
    private final String icon;
    private final int order;
    private final boolean active;
}
