package com.web.dto.request.group;

import com.web.entities.enums.group.GroupPrivacy;
import com.web.entities.enums.group.GroupTopic;
import com.web.entities.enums.group.JoinPolicy;
import jakarta.validation.constraints.*;

public record GroupCreateRequest(
        @NotBlank @Size(max = 60) String name,
        @Size(max = 500) String description,
        @NotNull JoinPolicy joinPolicy,
        @NotNull GroupPrivacy groupPrivacy,
        @NotNull GroupTopic topic,
        @Min(2) @Max(200) Integer maxMembers
) {
}