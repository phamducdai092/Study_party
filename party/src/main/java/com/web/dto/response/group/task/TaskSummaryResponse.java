package com.web.dto.response.group.task;

import com.web.entities.enums.task.SubmissionType;
import com.web.entities.enums.task.TaskStatus;
import lombok.Builder;
import java.time.Instant;

@Builder
public record TaskSummaryResponse(
    Long id,
    String title,
    Instant deadline,
    SubmissionType submissionType,
    Integer assigneeCount,
    TaskStatus mySubmissionStatus, // Trạng thái bài của user (ASSIGNED, SUBMITTED...)
    Boolean isOverdue,              // Đã quá hạn chưa
    Boolean isDeleted
) {}