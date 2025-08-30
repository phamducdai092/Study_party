package com.web.study.party.api.user;

import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.CodeStatus;
import com.web.study.party.services.user.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/admin/users")
    public ResponseEntity<ApiResponse<List<Users>>> getAllUsers(HttpServletRequest req,
                                                                @RequestParam String username) {

        List<Users> users = userService.getAllUsersByName(username);

        return ResponseEntity.ok(
                ApiResponse.<List<Users>>builder()
                        .code(CodeStatus.SUCCESS.name())
                        .status(CodeStatus.SUCCESS.getCode())
                        .message("Users retrieved successfully")
                        .path(req.getRequestURI())
                        .data(users)
                        .build()
        );
    }
}
