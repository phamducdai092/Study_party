package com.web.dto.request.chat;

import com.web.entities.enums.group.MessageType;

public record SendMessageRequest(
    String content,
    MessageType type
) {}