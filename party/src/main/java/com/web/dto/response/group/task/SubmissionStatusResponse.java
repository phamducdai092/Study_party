package com.web.dto.response.group.task;

import com.web.dto.response.user.UserBrief;
import com.web.entities.enums.task.TaskStatus;
import lombok.Builder;

import java.time.Instant;

@Builder
public record SubmissionStatusResponse(
        UserBrief userBrief,
        TaskStatus status,
        Instant submittedAt,
        Instant assignedAt,
        Integer grade,
        Integer version
) {
}