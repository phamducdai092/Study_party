package com.web.api.group;

import com.web.dto.request.group.GroupCreateRequest;
import com.web.dto.filters.GroupFilter;
import com.web.dto.response.ApiResponse;
import com.web.dto.response.group.GroupCardResponse;
import com.web.dto.response.group.GroupDetailResponse;
import com.web.dto.response.group.GroupResponse;
import com.web.entities.Users;
import com.web.entities.enums.CodeStatus;
import com.web.services.group.GroupServiceImp;
import com.web.utils.Paging;
import com.web.utils.ResponseUtil;
import com.web.utils.filters.FilterBuilder;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupServiceImp groupService;

    @PostMapping
    public ResponseEntity<ApiResponse<GroupResponse>> create(@AuthenticationPrincipal(expression = "user") Users user, @Valid @RequestBody GroupCreateRequest req, HttpServletRequest httpRequest) {
        GroupResponse group = groupService.create(user.getId(), req);
        ApiResponse<GroupResponse> response = ApiResponse.<GroupResponse>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(group)
                .message("Group created successfully")
                .path(httpRequest.getRequestURI())
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/discover")
    public ResponseEntity<ApiResponse<List<GroupCardResponse>>> getDiscoverGroups(
            @AuthenticationPrincipal(expression = "user") Users user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String sort,
            @ModelAttribute GroupFilter filter,
            HttpServletRequest req
    ) {
        Pageable pageable = Paging.parsePageable(page, size, sort);

        // Gọi service
        Page<GroupCardResponse> result = groupService.getDiscoverGroups(user.getId(), filter, pageable);

        Map<String, Object> filters = FilterBuilder.create()
                .mapOf(filter)
                .build();

        // Dùng lại Filter có sẵn để đóng gói response
        return ResponseUtil.success(result, filters, "Lấy danh sách khám phá phòng học thành công", req);
    }

    @GetMapping("/joined")
    public ResponseEntity<ApiResponse<List<GroupCardResponse>>> getJoinedGroups(
            @AuthenticationPrincipal(expression = "user") Users user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String sort,
            @ModelAttribute GroupFilter filter,
            HttpServletRequest req
    ) {
        Pageable pageable = Paging.parsePageable(page, size, sort);

        Page<GroupCardResponse> result = groupService.getJoinedGroups(user.getId(), filter, pageable);

        Map<String, Object> filters = FilterBuilder.create()
                .mapOf(filter)
                .build();

        return ResponseUtil.success(result, filters, "Lấy danh sách phòng học đã tham gia thành công", req);
    }

    @GetMapping("/owned")
    public ResponseEntity<ApiResponse<List<GroupCardResponse>>> getOwnedGroups(
            @AuthenticationPrincipal(expression = "user") Users user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String sort,
            @ModelAttribute GroupFilter filter,
            HttpServletRequest req
    ) {
        Pageable pageable = Paging.parsePageable(page, size, sort);

        Page<GroupCardResponse> result = groupService.getOwnedGroups(user.getId(), filter, pageable);

        Map<String, Object> filters = FilterBuilder.create()
                .mapOf(filter)
                .build();

        return ResponseUtil.success(result, filters, "Lấy danh sách phòng học đã tạo thành công", req);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<GroupDetailResponse>> getGroupDetails(
            @AuthenticationPrincipal(expression = "user") Users currentUser,
            @PathVariable String slug,
            HttpServletRequest httpRequest
    ) {
        GroupDetailResponse groupDetails = groupService.getDetailBySlug(slug, currentUser);

        ApiResponse<GroupDetailResponse> response = ApiResponse.<GroupDetailResponse>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(groupDetails)
                .path(httpRequest.getRequestURI())
                .message("Lấy thông tin phòng thành công")
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{slug}")
    public ResponseEntity<ApiResponse<GroupResponse>> update(@AuthenticationPrincipal(expression = "user") Users user, @PathVariable String slug, @Valid @RequestBody GroupCreateRequest req, HttpServletRequest httpRequest) {
        GroupResponse group = groupService.update(user.getId(), slug, req);
        ApiResponse<GroupResponse> response = ApiResponse.<GroupResponse>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(group)
                .message("Group updated successfully")
                .path(httpRequest.getRequestURI())
                .build();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{slug}")
    public ResponseEntity<ApiResponse<Void>> deleteGroup(@AuthenticationPrincipal(expression = "user") Users user, @PathVariable String slug, HttpServletRequest httpRequest) {
        groupService.delete(user.getId(), slug);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(CodeStatus.SUCCESS.getHttpCode())
                .code("SUCCESS")
                .data(null)
                .message("Group deleted successfully")
                .path(httpRequest.getRequestURI())
                .build();
        return ResponseEntity.ok(response);
    }
}
