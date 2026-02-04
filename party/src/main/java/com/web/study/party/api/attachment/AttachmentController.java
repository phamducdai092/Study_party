package com.web.study.party.api.attachment;

import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.dto.response.group.task.AttachmentDetailResponse;
import com.web.study.party.entities.Users;
import com.web.study.party.services.attachment.AttachmentService;
import com.web.study.party.utils.Paging;
import com.web.study.party.utils.ResponseUtil;
import com.web.study.party.utils.filters.FilterBuilder;
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
@RequestMapping("/attachments")
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;

    @GetMapping("/{groupId}")
    public ResponseEntity<ApiResponse<List<AttachmentDetailResponse>>> getGroupAttachments(
            @PathVariable Long groupId,
            @AuthenticationPrincipal(expression = "user") Users user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "uploadedAt") String sort,
            HttpServletRequest req
    ) {
        Pageable pageable = Paging.parsePageable(page, size, sort);

        // 1. Gọi Service (Nhận về cục đã đóng gói sẵn)
        Page<AttachmentDetailResponse> pageResult = attachmentService.getAttachmentsByGroup(groupId, user.getId(), pageable);

        // 2. Build Filter Map (Logic hiển thị)
        Map<String, Object> filters = FilterBuilder.create()
                .build();

        // 3. ResponseUtil tự động bóc tách PageMeta từ pageResult
        return ResponseUtil.success(pageResult, filters, "Lấy danh sách tài liệu thành công", req);
    }
}