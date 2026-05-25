package com.web.dto.mapper.notification;

import com.web.dto.response.notification.NotificationResponse;
import com.web.entities.Notification;
import com.web.dto.mapper.user.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface NotificationMapper {

    @Mapping(target = "recipient", source = "recipient")
    NotificationResponse toResponse(Notification entity);
}