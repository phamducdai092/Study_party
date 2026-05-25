package com.web.services.user;

import com.web.dto.request.user.UserInformationUpdateRequest;
import com.web.dto.response.user.UserInformationResponse;
import com.web.dto.response.user.UserSearchResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    UserInformationResponse updateUser(Long id, UserInformationUpdateRequest request);
    UserInformationResponse getUserById(Long userId);
    Page<UserSearchResponse> searchUsers(String keyword, Pageable pageable);
}
