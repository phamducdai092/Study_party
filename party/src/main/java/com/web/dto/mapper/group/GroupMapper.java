package com.web.dto.mapper.group;

import com.web.dto.request.group.GroupCreateRequest;
import com.web.dto.response.admin.AdminGroupResponse;
import com.web.dto.response.group.GroupCardResponse;
import com.web.dto.response.group.GroupResponse;
import com.web.entities.group.StudyGroups;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface GroupMapper {
    StudyGroups toEntity(GroupCreateRequest req);

    GroupResponse toResponse(StudyGroups g, Integer memberCount);

    @Mapping(target = "ownerId", source = "owner.id")
    GroupResponse toResponse(StudyGroups g);

    GroupCardResponse toCardResponse(StudyGroups g);

    AdminGroupResponse toAdminGroupResponse(StudyGroups g);

    // update partial
    void update(@MappingTarget StudyGroups g, GroupCreateRequest req);
}