package com.web.dto.response.user;

import com.web.dto.response.group.GroupResponse;
import com.web.dto.response.group.JoinRequestResponse;

public record UserJoinRequestResponse(
        JoinRequestResponse joinRequestResponse,
        GroupResponse groupResponse
) {
}
