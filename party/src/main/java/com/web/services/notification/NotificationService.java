package com.web.services.notification;

import com.web.dto.response.notification.NotificationResponse;
import com.web.entities.Users;

public interface NotificationService {

    NotificationResponse sendNotification(Users recipient, String content, String link, String type);

}
