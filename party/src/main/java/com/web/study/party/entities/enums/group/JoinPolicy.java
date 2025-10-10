package com.web.study.party.entities.enums.group;

import com.web.study.party.entities.enums.EnumMeta;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum JoinPolicy implements EnumMeta {
    OPEN("OPEN", "Open", "Ai cũng có thể tham gia", "green", "DoorOpen", 10, true),
    ASK("ASK", "Ask to Join", "Cần gửi yêu cầu duyệt", "amber", "MailQuestion", 20, true),
    INVITE_ONLY("INVITE_ONLY", "Invite Only", "Chỉ qua lời mời", "violet", "UserPlus2", 30, true);

    private final String code;
    private final String label;
    private final String description;
    private final String color;
    private final String icon;
    private final int order;
    private final boolean active;
}
