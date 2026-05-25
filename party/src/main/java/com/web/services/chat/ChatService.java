package com.web.services.chat;

import com.web.dto.kafka.ChatMessagePayload;
import com.web.dto.pagination.CursorResponse;
import com.web.dto.request.chat.SendMessageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public interface ChatService {
    CursorResponse<ChatMessagePayload> getGroupChatMessages(Long groupId, Long cursorId, int limit);
    ChatMessagePayload sendGroupMessage(Long senderId, Long groupId, SendMessageRequest req, List<MultipartFile> files);
}
