package com.web.dto.response.group;

import com.web.dto.response.user.UserBrief;
import com.web.entities.enums.group.GroupPrivacy;
import com.web.entities.enums.group.GroupTopic;
import com.web.entities.enums.group.JoinPolicy;
import com.web.entities.enums.group.MemberRole;

public record GroupDetailResponse(
        Long id,
        String name,
        String slug,
        String description,
        GroupTopic topic,
        String topicColor,
        Integer maxMembers,
        Integer memberCount,
        GroupPrivacy groupPrivacy,
        JoinPolicy joinPolicy,

        UserBrief owner,

        MemberRole currentUserRole
) {
}