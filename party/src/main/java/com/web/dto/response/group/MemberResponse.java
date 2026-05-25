package com.web.dto.response.group;

import com.web.dto.response.user.UserBrief;
import com.web.entities.enums.group.MemberRole;

import java.time.Instant;

public record MemberResponse(
        Integer id,
        UserBrief member,
        Instant joinedAt,
        MemberRole role
) {
}