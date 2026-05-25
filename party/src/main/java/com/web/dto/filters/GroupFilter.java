package com.web.dto.filters;

import com.web.entities.enums.group.GroupTopic;

public record GroupFilter(
        String keyword,
        GroupTopic topic
) {
}