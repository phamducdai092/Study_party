package com.web.study.party.entities.enums.group;

import com.web.study.party.entities.enums.EnumMeta;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum GroupPrivacy implements EnumMeta {
    PUBLIC("PUBLIC", "Công khai", "Mở công khai cho tất cả mọi người", "green", "LockOpen", 10, true),
    PRIVATE("PRIVATE", "Riêng tư", "Mở riêng tư", "black", "Lock", 20, true);

    private final String code;
    private final String label;
    private final String description;
    private final String color;
    private final String icon;
    private final int order;
    private final boolean active;
}
