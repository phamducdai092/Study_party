package com.web.services.notification;

import com.web.dto.mapper.notification.NotificationMapper;
import com.web.dto.response.notification.NotificationResponse;
import com.web.entities.Notification;
import com.web.entities.Users;
import com.web.repositories.NotificationRepo;
import com.web.utils.socket.SocketConst;
import com.web.utils.socket.SocketNotify;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationServiceImp implements NotificationService {

    private final NotificationRepo notificationRepo;
    private final NotificationMapper notificationMapper;

    @Override
    @Transactional
    @SocketNotify(
            topic = "'" + SocketConst.PREFIX_TOPIC_USER + "' + #result.recipient.id + '/notifications'",
            type = SocketConst.EVENT_NEW_NOTIFICATION
    )
    public NotificationResponse sendNotification(Users recipient, String content, String link, String type) {
        // 1. Lưu vào DB
        Notification notif = Notification.builder()
                .recipient(recipient)
                .content(content)
                .link(link)
                .type(type)
                .build();

        Notification savedNotif = notificationRepo.save(notif);
        // 2. Convert sang DTO (Để fix lỗi Hibernate Proxy)
        return notificationMapper.toResponse(savedNotif);
    }


}
