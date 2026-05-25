package com.web.dto.mapper.user;


import com.web.dto.request.user.UserInformationUpdateRequest;
import com.web.dto.response.admin.AdminUserResponse;
import com.web.dto.response.user.UserBrief;
import com.web.dto.response.user.UserInformationResponse;
import com.web.dto.response.user.UserSearchResponse;
import com.web.dto.user.UserDTO;
import com.web.entities.Users;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toDTO(Users user);
    Users toEntity(UserDTO userDTO);
    UserInformationResponse toUserInformationResponse(Users user);
    AdminUserResponse toAdminUserResponse(Users user);
    UserBrief toUserBrief(Users user);
    UserSearchResponse toUserSearchResponse(Users user);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void update(@MappingTarget Users user, UserInformationUpdateRequest request);
}
