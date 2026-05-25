package com.web.dto.response.group.task;

import com.web.dto.response.user.UserBrief;

import java.time.Instant;

public record AttachmentDetailResponse(
        Long id,
        String fileName,
        String filePath, // Hoặc presigned URL nếu dùng S3/Cloudinary
        String fileType,
        Long fileSize,
        Instant uploadedAt,
        UserBrief uploadedBy
) {
}
