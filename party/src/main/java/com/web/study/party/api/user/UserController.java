package com.web.study.party.api.user;

import com.web.study.party.config.CustomUserDetails;
import com.web.study.party.dto.mapper.user.UserMapper;
import com.web.study.party.dto.request.user.UserInformationUpdateRequest;
import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.dto.response.auth.AuthResponse;
import com.web.study.party.dto.response.user.UserInformationResponse;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.enums.CodeStatus;
import com.web.study.party.services.user.UserServiceImp;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserServiceImp userService;
    private final UserMapper userMapper;

    @GetMapping("/admin/users")
    public ResponseEntity<ApiResponse<List<Users>>> getAllUsers(HttpServletRequest req,
                                                                @RequestParam String username) {

        List<Users> users = userService.getAllUsersByName(username);

        return ResponseEntity.ok(
                ApiResponse.<List<Users>>builder()
                        .code(CodeStatus.SUCCESS.name())
                        .status(CodeStatus.SUCCESS.getHttpCode())
                        .message("Users retrieved successfully")
                        .path(req.getRequestURI())
                        .data(users)
                        .build()
        );
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> me(
            @AuthenticationPrincipal(expression = "user")
            Users user,
            HttpServletRequest httpRequest) {

        if (user == null) {
            throw new org.springframework.security.access.AccessDeniedException("Unauthorized");
        }

        var userDTO = userMapper.toDTO(user);
        var authResponse = new AuthResponse(null, null, null, userDTO);

        var response = ApiResponse.<AuthResponse>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .path(httpRequest.getRequestURI())
                .data(authResponse)
                .message("Lấy thông tin người dùng thành công")
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserInformationResponse>> updateUserInformation(@AuthenticationPrincipal(expression = "user")
                                                                                            Users user, @Valid @RequestBody UserInformationUpdateRequest request, HttpServletRequest httpRequest) {

        UserInformationResponse userInformationUpdateResponse = userService.updateUser(user.getId(), request);

        var response = ApiResponse.<UserInformationResponse>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .path(httpRequest.getRequestURI())
                .data(userInformationUpdateResponse)
                .message("Cập nhật thông tin người dùng thành công!")
                .build();
        return ResponseEntity.ok(response);
    }
}
