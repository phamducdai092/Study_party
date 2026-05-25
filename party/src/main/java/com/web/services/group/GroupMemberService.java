package com.web.services.group;

import com.web.dto.response.group.MemberResponse;
import com.web.entities.Users;
import com.web.entities.enums.group.MemberRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface GroupMemberService {
    Page<MemberResponse> getMembers(Long groupId, Users user, String keyword, MemberRole role, Pageable pageable);

    void addMember(Long groupId, Long userId);

    void leave(Long uid, Long gid);

    void kick(Long modId, Long gid, Long userId);

    Long setRole(Long ownerId, Long gid, Long userId, MemberRole role);

    void transferOwnership(Long ownerId, Long gid, Long newOwnerId);
}
