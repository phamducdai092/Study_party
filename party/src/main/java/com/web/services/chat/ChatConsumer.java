package com.web.services.chat;

import com.web.config.KafkaConfig;
import com.web.dto.kafka.ChatMessagePayload;
import com.web.dto.response.group.task.AttachmentResponse;
import com.web.entities.Users;
import com.web.entities.enums.group.MemberState;
import com.web.entities.enums.group.MessageType;
import com.web.entities.group.GroupMembers;
import com.web.entities.group.StudyGroups;
import com.web.entities.message.GroupMessages;
import com.web.entities.task.Attachment;
import com.web.repositories.user.UserRepo;
import com.web.repositories.chat.GroupMessageRepo;
import com.web.repositories.group.member.GroupMemberRepo;
import com.web.repositories.group.GroupRepo;
import com.web.socket.SocketMessage;
import com.web.utils.socket.SocketConst;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatConsumer {

    private final SimpMessagingTemplate messagingTemplate;
    private final GroupMessageRepo groupMessageRepository;
    private final UserRepo userRepository;
    private final GroupRepo groupRepo;
    private final GroupMemberRepo groupMemberRepo;

    @KafkaListener(
            topics = {KafkaConfig.GROUP_CHAT_TOPIC},
            groupId = "${spring.kafka.consumer.group-id}"
    )
    @Transactional
    public void consumeBatch(List<ChatMessagePayload> payloads) {
        if (payloads.isEmpty()) return;

        List<GroupMessages> entitiesToSave = new ArrayList<>();

        // 1. Convert DTO -> Entity
        for (ChatMessagePayload payload : payloads) {
            Users senderProxy = userRepository.getReferenceById(Math.toIntExact(payload.sender().id()));
            StudyGroups groupProxy = groupRepo.getReferenceById(payload.targetId());

            GroupMessages entity = GroupMessages.builder()
                    .group(groupProxy)
                    .build();
            entity.setSender(senderProxy);
            entity.setContent(payload.content());
            entity.setType(payload.type());
            entity.setCreatedAt(payload.createdAt());

            // 👇 Xử lý Attachment
            if (payload.attachments() != null && !payload.attachments().isEmpty()) {
                List<Attachment> attachments = new ArrayList<>();
                for (AttachmentResponse attDto : payload.attachments()) {
                    Attachment att = new Attachment();
                    att.setFileName(attDto.fileName());
                    att.setFilePath(attDto.fileUrl());
                    att.setFileType(attDto.fileType());
                    att.setFileSize(attDto.fileSize() != null ? attDto.fileSize() : 0L);
                    att.setUploadedAt(Instant.now());
                    att.setDeleted(false);
                    att.setGroupMessage(entity);

                    attachments.add(att);
                }
                entity.setAttachments(attachments);
            }

            entitiesToSave.add(entity);
        }

        // 2. BATCH INSERT
        List<GroupMessages> savedEntities = groupMessageRepository.saveAll(entitiesToSave);
        log.info("✅ Batch saved {} messages to DB", savedEntities.size());

        // 3. Broadcast Socket & Notification
        for (int i = 0; i < savedEntities.size(); i++) {
            GroupMessages savedMsg = savedEntities.get(i);
            GroupMessages originalEntity = entitiesToSave.get(i);
            ChatMessagePayload originalPayload = payloads.get(i);

            // A. Map lại Attachment để gửi Socket Chat Room
            List<AttachmentResponse> savedAtts = new ArrayList<>();
            if (originalEntity.getAttachments() != null) {
                savedAtts = originalEntity.getAttachments().stream()
                        .map(att -> new AttachmentResponse(
                                att.getId(),
                                att.getFileName(),
                                att.getFilePath(),
                                att.getFileType(),
                                att.getFileSize(),
                                att.getUploadedAt(),
                                originalPayload.sender().id()
                        ))
                        .toList();
            }

            ChatMessagePayload responsePayload = new ChatMessagePayload(
                    savedMsg.getId(),
                    originalPayload.sender(),
                    originalPayload.senderRole(),
                    originalPayload.targetId(),
                    savedMsg.getContent(),
                    savedMsg.getType(),
                    savedMsg.getCreatedAt(),
                    true,
                    savedAtts
            );

            // B. Gửi Socket vào Chat Room (Cho người đang chat)
            String chatDestination = SocketConst.PREFIX_TOPIC_CHAT_ROOM + originalPayload.targetId();
            SocketMessage socketMessage = SocketMessage.builder()
                    .type(SocketConst.EVENT_NEW_GROUP_MESSAGE)
                    .payload(responsePayload)
                    .build();

            messagingTemplate.convertAndSend(chatDestination, socketMessage);

            // C. 👇 LOGIC MỚI: Bắn thông báo Video Call (Cho người đang ở ngoài)
            if (MessageType.VIDEO_CALL.equals(savedMsg.getType())) {
                try {
                    Long groupId = originalPayload.targetId();
                    Long senderId = originalPayload.sender().id();
                    String groupName = savedMsg.getGroup().getName();
                    String groupSlug = savedMsg.getGroup().getSlug();

                    // Lấy danh sách thành viên trong nhóm
                    // Lưu ý: Đảm bảo GroupMemberRepo có hàm findByGroupId hoặc tương tự
                    List<GroupMembers> members = groupMemberRepo.findByGroupIdAndState(groupId, MemberState.APPROVED);

                    for (GroupMembers member : members) {
                        Long userId = member.getUser().getId();

                        // Không gửi thông báo cho chính người gọi
                        if (userId.equals(senderId)) continue;

                        // Tạo payload thông báo
                        Map<String, Object> notifPayload = new HashMap<>();
                        notifPayload.put("content", "📞 Nhóm " + groupName + " đang có cuộc gọi video!");
                        notifPayload.put("link", "/rooms/" + groupSlug);
                        notifPayload.put("type", "VIDEO_CALL_STARTED"); // Type này khớp với FE
                        notifPayload.put("senderAvatar", originalPayload.sender().avatarUrl());

                        // Bắn vào kênh riêng tư của User
                        SocketMessage notifSocket = SocketMessage.builder()
                                .type(SocketConst.EVENT_NEW_NOTIFICATION)
                                .payload(notifPayload)
                                .build();

                        messagingTemplate.convertAndSend("/topic/user/" + userId + "/notifications", notifSocket);
                    }
                    log.info("🔔 Sent video call notifications to group members");
                } catch (Exception e) {
                    log.error("❌ Failed to send video call notifications: ", e);
                }
            }
        }
    }
}