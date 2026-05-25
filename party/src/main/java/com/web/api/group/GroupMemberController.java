package com.web.api.group;

import com.web.dto.request.group.ChangeRoleRequest;
import com.web.dto.response.ApiResponse;
import com.web.dto.response.group.MemberResponse;
import com.web.entities.Users;
import com.web.entities.enums.CodeStatus;
import com.web.entities.enums.group.MemberRole;
import com.web.services.group.GroupMemberServiceImp;
import com.web.utils.Paging;
import com.web.utils.ResponseUtil;
import com.web.utils.filters.FilterBuilder;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/groups/members")
@RequiredArgsConstructor
public class GroupMemberController {

    private final GroupMemberServiceImp memberService;

    @GetMapping("/{gid}")
    public ResponseEntity<ApiResponse<List<MemberResponse>>> getGroupMembers(
            @AuthenticationPrincipal(expression = "user") Users user,
            @PathVariable Long gid,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) MemberRole role,
            @RequestParam(required = false) String keyword,
            HttpServletRequest httpRequest
    ) {
        // 1. Prepare Pageable
        Pageable pageable = Paging.parsePageable(page, size, sort);

        // 2. Call Service (Trả về Page<MemberResponse>)
        Page<MemberResponse> membersPage = memberService.getMembers(gid, user, keyword, role, pageable);

        // 3. Build Filter Map (Gọn, đẹp, dễ đọc)
        Map<String, Object> filters = FilterBuilder.create()
                .add("role", role)
                .add("keyword", keyword)
                .build();

        // 4. Return luôn bằng Util mới -> DONE
        return ResponseUtil.success(membersPage, filters, "Fetched group members successfully", httpRequest);
    }

    @DeleteMapping("/{gid}/leave")
    public ResponseEntity<ApiResponse<Void>> leaveGroup(
            @AuthenticationPrincipal(expression = "user") Users user,
            @PathVariable Long gid,
            HttpServletRequest httpRequest
    ) {
        memberService.leave(user.getId(), gid);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(null)
                .message("Left group successfully")
                .path(httpRequest.getRequestURI())
                .build();
        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/{gid}/kick/{userId}")
    public ResponseEntity<ApiResponse<Void>> kickMember(
            @AuthenticationPrincipal(expression = "user") Users user,
            @PathVariable Long gid,
            @PathVariable Long userId,
            HttpServletRequest httpRequest
    ) {
        memberService.kick(user.getId(), gid, userId);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(null)
                .message("Member kicked successfully")
                .path(httpRequest.getRequestURI())
                .build();
        return ResponseEntity.ok(response);
    }


    @PutMapping("/{gid}/role/{memberId}")
    public ResponseEntity<ApiResponse<Void>> setMemberRole(
            @AuthenticationPrincipal(expression = "user") Users user,
            @PathVariable Long gid,
            @PathVariable Long memberId,
            @RequestBody ChangeRoleRequest role,
            HttpServletRequest httpRequest
    ) {
        memberService.setRole(user.getId(), gid, memberId, role.newMemberRole());

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(null)
                .message("Member role updated successfully")
                .path(httpRequest.getRequestURI())
                .build();
        return ResponseEntity.ok(response);
    }


    @PutMapping("/{gid}/transfer-ownership/{newOwnerId}")
    public ResponseEntity<ApiResponse<Void>> transferOwnership(
            @AuthenticationPrincipal(expression = "user") Users user,
            @PathVariable Long gid,
            @PathVariable Long newOwnerId,
            HttpServletRequest httpRequest
    ) {
        memberService.transferOwnership(user.getId(), gid, newOwnerId);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(null)
                .message("Group ownership transferred successfully")
                .path(httpRequest.getRequestURI())
                .build();
        return ResponseEntity.ok(response);
    }

}
