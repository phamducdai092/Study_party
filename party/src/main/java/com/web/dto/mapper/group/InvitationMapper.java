package com.web.dto.mapper.group;

import com.web.dto.response.group.InvitationResponse;
import com.web.entities.group.GroupInvite;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InvitationMapper {
    @Mapping(target = "inviter.id", source = "inviter.id")
    @Mapping(target = "inviter.displayName", source = "inviter.displayName")
    @Mapping(target = "inviter.avatarUrl", source = "inviter.avatarUrl")
    @Mapping(target = "invitee.id", source = "invitee.id")
    @Mapping(target = "invitee.displayName", source = "invitee.displayName")
    @Mapping(target = "invitee.avatarUrl", source = "invitee.avatarUrl")
    @Mapping(target = "groupId", source = "group.id")
    @Mapping(target = "groupName", source = "group.name")
    @Mapping(target = "groupSlug", source = "group.slug")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "expiresAt", source = "expiresAt")
    InvitationResponse toResponse(GroupInvite entity);
}