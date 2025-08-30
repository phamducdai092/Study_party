package com.web.study.party.services.user;

import com.web.study.party.entities.Users;
import com.web.study.party.exeption.BusinessException;
import com.web.study.party.repositories.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepo userRepo;

    public List<Users> getAllUsersByName(String name) {
        return userRepo.getAllByDisplayName(name)
                .filter(list -> !list.isEmpty())
                .orElseThrow(() -> BusinessException.notFound("No users found"));
    }


}
