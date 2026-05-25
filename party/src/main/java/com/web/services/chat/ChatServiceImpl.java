package com.web.services.chat;

import com.web.dto.kafka.ChatMessagePayload;
import com.web.dto.mapper.group.task.AttachmentMapper;
import com.web.dto.mapper.user.UserMapper;
import com.web.dto.pagination.CursorMeta;
import com.web.dto.pagination.CursorResponse;
import com.web.dto.request.chat.SendMessageRequest;
import com.web.dto.response.group.task.AttachmentResponse;
import com.web.dto.response.user.UserBrief;
import com.web.entities.group.GroupMembers;
import com.web.entities.message.GroupMessages;
import com.web.exception.ResourceNotFoundException;
import com.web.repositories.chat.GroupMessageRepo;
import com.web.repositories.group.member.GroupMemberRepo;
import com.web.repositories.group.GroupRepo;
import com.web.services.fileStorage.FileStorageService;
import com.web.utils.Helper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final GroupRepo groupRepo;
    private final GroupMemberRepo groupMemberRepo;
    private final GroupMessageRepo groupMessageRepo;

    private final ChatProducer chatProducer;
    private final FileStorageService fileStorageService;

    private final UserMapper userMapper;
    private final AttachmentMapper attachmentMapper;

    @Override
    public CursorResponse<ChatMessagePayload> getGroupChatMessages(Long groupId, Long cursorId, int limit) {
        List<GroupMessages> messages;

        if (cursorId == null) {
            messages = groupMessageRepo.findTop20ByGroupIdOrderByCreatedAtDesc(groupId);
        } else {
            messages = groupMessageRepo.findTop20ByGroupIdAndIdLessThanOrderByCreatedAtDesc(groupId, cursorId);
        }

        // 2. Map Entity -> DTO (ChatMessagePayload)
        List<ChatMessagePayload> payloadList = messages.stream().map(msg -> {
            // [CẢNH BÁO] Đoạn này vẫn đang query N+1 để lấy Role.
            // Nếu muốn tối ưu triệt để thì nên join bảng Member ngay từ Repository.
            // Nhưng tạm thời để code chạy được đã nhé.
            GroupMembers member = groupMemberRepo.findByGroupIdAndUserId(groupId, msg.getSender().getId())
                    .orElse(null);

            UserBrief senderBrief = (member != null)
                    ? userMapper.toUserBrief(member.getUser())
                    : userMapper.toUserBrief(msg.getSender());

            // Map Attachments (Lúc này đã được fetch sẵn nhờ @EntityGraph, không sợ Lazy load nữa)
            List<AttachmentResponse> attResponses = (msg.getAttachments() != null)
                    ? msg.getAttachments().stream().map(attachmentMapper::toResponse).toList()
                    : new ArrayList<>();

            return new ChatMessagePayload(
                    msg.getId(),
                    senderBrief,
                    (member != null) ? member.getRole() : null, // Role
                    groupId,
                    msg.getContent(),
                    msg.getType(),
                    msg.getCreatedAt(),
                    true, // isGroup
                    attResponses
            );
        }).toList();

        String nextCursor = null;
        if (!messages.isEmpty()) {
            nextCursor = messages.get(messages.size() - 1).getId().toString();
        }

        // 3. Tạo Meta
        CursorMeta meta = CursorMeta.builder()
                .limit(limit)
                .nextCursor(nextCursor)
                .build();

        // 4. Return Wrapper
        return CursorResponse.<ChatMessagePayload>builder()
                .data(payloadList)
                .meta(meta)
                .build();
    }

    @Override
    @Transactional
    public ChatMessagePayload sendGroupMessage(Long senderId, Long groupId, SendMessageRequest req, List<MultipartFile> files) {

        // ... (Logic Validate Group & Member giữ nguyên) ...
        groupRepo.findById(groupId).orElseThrow(() -> new ResourceNotFoundException("Group not found"));
        GroupMembers member = groupMemberRepo.findByGroupIdAndUserId(groupId, senderId)
                .orElseThrow(() -> new AccessDeniedException("Not a member"));
        UserBrief senderBrief = userMapper.toUserBrief(member.getUser());

        // --- XỬ LÝ FILE ---
        List<AttachmentResponse> attachmentPayloads = new ArrayList<>();
        if (files != null && !files.isEmpty()) {
            for (MultipartFile f : files) {
                // Upload file (Lưu vào folder chat/group/...)
                String folder = "chat/groups/" + groupId;
                String fileUrl = fileStorageService.uploadFile(f, folder);

                // Tạo DTO Attachment (ID null vì chưa lưu DB)
                // Lưu ý: Constructor AttachmentResponse phải khớp
                attachmentPayloads.add(
                        new AttachmentResponse(
                                null,
                                f.getOriginalFilename(),
                                fileUrl,
                                Helper.getExtension(f.getOriginalFilename()),
                                f.getSize(),
                                Instant.now(),
                                senderBrief.id()
                        ));
            }
        }

        // --- TẠO PAYLOAD ---
        ChatMessagePayload payload = new ChatMessagePayload(
                null,
                senderBrief,
                member.getRole(),
                groupId,
                req.content(),
                req.type(),
                Instant.now(),
                true,
                attachmentPayloads // 👇 Nhét list file đã upload vào payload
        );

        // --- BẮN KAFKA ---
        chatProducer.sendMessage(payload);

        return payload;
    }
}