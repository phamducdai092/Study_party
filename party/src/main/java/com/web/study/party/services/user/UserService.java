package com.web.study.party.services.user;

import com.web.study.party.dto.request.user.UserInformationUpdateRequest;
import com.web.study.party.dto.response.user.UserInformationResponse;
import com.web.study.party.entities.Users;

import java.util.List;

public interface UserService {
    List<Users> getAllUsersByName(String name);
    UserInformationResponse updateUser(Long id, UserInformationUpdateRequest request);
}
