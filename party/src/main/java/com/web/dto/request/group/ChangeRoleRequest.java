package com.web.dto.request.group;

import com.web.entities.enums.group.MemberRole;

public record ChangeRoleRequest(
        MemberRole newMemberRole
) {
}
