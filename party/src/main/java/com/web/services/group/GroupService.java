package com.web.services.group;

import com.web.dto.request.group.GroupCreateRequest;
import com.web.dto.filters.GroupFilter;
import com.web.dto.response.group.GroupCardResponse;
import com.web.dto.response.group.GroupDetailResponse;
import com.web.dto.response.group.GroupResponse;
import com.web.entities.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface GroupService {

    Page<GroupResponse> getAllByUserId(Long uid);

    Page<GroupResponse> getAll();

    // group
    GroupResponse create(Long uid, GroupCreateRequest req);

    GroupResponse update(Long uid, String slug, GroupCreateRequest req);

    Page<GroupCardResponse> getJoinedGroups(Long userId, GroupFilter filter, Pageable pageable);

    Page<GroupCardResponse> getOwnedGroups(Long userId, GroupFilter filter, Pageable pageable);

    Page<GroupCardResponse> getDiscoverGroups(Long userId, GroupFilter filter, Pageable pageable);

    GroupDetailResponse getDetailBySlug(String slug, Users currentUser);

    void delete(Long uid, String slug);
}
