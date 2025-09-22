package com.web.study.party.services.user;

import com.web.study.party.dto.mapper.user.UserMapper;
import com.web.study.party.dto.request.user.UserInformationUpdateRequest;
import com.web.study.party.dto.response.user.UserInformationResponse;
import com.web.study.party.entities.Users;
import com.web.study.party.exeption.BusinessException;
import com.web.study.party.repositories.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImp implements UserService {
    private final UserRepo userRepo;
    private final UserMapper mapper;

    public List<Users> getAllUsersByName(String name) {
        return userRepo.getAllByDisplayName(name)
                .filter(list -> !list.isEmpty())
                .orElseThrow(() -> BusinessException.notFound("No users found"));
    }

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


}
