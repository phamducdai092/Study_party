package com.web.services.user;

import com.web.dto.mapper.user.UserMapper;
import com.web.dto.request.user.UserInformationUpdateRequest;
import com.web.dto.response.user.UserInformationResponse;
import com.web.dto.response.user.UserSearchResponse;
import com.web.entities.Users;
import com.web.exception.BusinessException;
import com.web.exception.ResourceNotFoundException;
import com.web.repositories.user.UserRepo;
import com.web.repositories.user.UserSpecs;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class UserServiceImp implements UserService {
    private final UserRepo userRepo;
    private final UserMapper mapper;

    @Transactional
    @Override
    public UserInformationResponse updateUser(Long id, UserInformationUpdateRequest request) {

        request = new UserInformationUpdateRequest(
                request.avatarUrl() != null ? request.avatarUrl().trim() : null,
                request.bannerUrl() != null ? request.bannerUrl().trim() : null,
                request.displayName() != null ? request.displayName().trim() : null,
                request.bio() != null ? request.bio().trim() : null,
                request.phoneNumber() != null ? request.phoneNumber().trim() : null,
                request.dateOfBirth()
        );

        Users u = userRepo.findById(id)
                .orElseThrow(() -> BusinessException.notFound("No users found"));
        mapper.update(u, request);
        u.setUpdatedAt(Instant.now());
        return mapper.toUserInformationResponse(u);
    }

    @Override
    public UserInformationResponse getUserById(Long userId) {
        Users user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + userId));

        return mapper.toUserInformationResponse(user);
    }

    @Override
    public Page<UserSearchResponse> searchUsers(String keyword, Pageable pageable) {
        Specification<Users> spec = Specification.allOf(
                UserSpecs.containsKeyword(keyword),
                UserSpecs.isVerified()
        );

        Page<Users> usersPage = userRepo.findAll(spec, pageable);

        return usersPage.map(mapper::toUserSearchResponse);
    }
}
