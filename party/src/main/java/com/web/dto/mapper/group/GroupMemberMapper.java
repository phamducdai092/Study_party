package com.web.dto.mapper.group;

import com.web.dto.response.group.MemberResponse;
import com.web.entities.group.GroupMembers;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface GroupMemberMapper {

    @Mapping(target = "member.id", source = "gm.user.id")
    @Mapping(target = "member.displayName", source = "gm.user.displayName")
    @Mapping(target = "member.avatarUrl", source = "gm.user.avatarUrl")
    @Mapping(target = "role", source = "gm.role")
    @Mapping(target = "joinedAt", source = "gm.joinedAt")
    MemberResponse toMemberResponse(GroupMembers gm);
}
