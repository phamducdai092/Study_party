package com.web.dto.response.group;

import com.web.dto.response.user.UserBrief;
import com.web.entities.enums.group.RequestStatus;
import lombok.Data;

import java.time.Instant;

@Data
public class InvitationResponse {
    private Long id;
    private String token;
    private Long groupId;
    private String groupName;
    private String groupSlug;
    private UserBrief inviter;
    private UserBrief invitee;
    private RequestStatus status;
    private Instant createdAt;
    private Instant expiresAt;
}