package com.web.dto.mapper.group.task;

import com.web.dto.response.admin.AdminFileResponse;
import com.web.dto.response.group.task.AttachmentDetailResponse;
import com.web.dto.response.group.task.AttachmentResponse;
import com.web.entities.task.Attachment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AttachmentMapper {
    Attachment toEntity(AttachmentResponse resp);

    @Mapping(target = "fileUrl", source = "att.filePath")
    @Mapping(target = "uploadedById", source = "att.uploadedBy.id")
    AttachmentResponse toResponse(Attachment att);

    @Mapping(target = "fileUrl", source = "att.filePath")
    @Mapping(target = "uploadedById", source = "att.uploadedBy.id")
    AdminFileResponse toAdminFileResponse(Attachment att);

    @Mapping(target = "uploadedBy.id", source = "att.uploadedBy.id")
    @Mapping(target = "uploadedBy.displayName", source = "att.uploadedBy.displayName")
    @Mapping(target = "uploadedBy.avatarUrl", source = "att.uploadedBy.avatarUrl")
    AttachmentDetailResponse toDetailResponse(Attachment att);
}
