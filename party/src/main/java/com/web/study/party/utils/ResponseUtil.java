package com.web.study.party.utils;

import com.web.study.party.dto.response.ApiResponse;
import com.web.study.party.dto.pagination.CursorMeta;
import com.web.study.party.dto.pagination.PageMeta;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public class ResponseUtil {

    public static <T> ResponseEntity<ApiResponse<List<T>>> page(
            List<T> items, PageMeta meta, String message, HttpServletRequest req) {
        var body = ApiResponse.<List<T>>builder()
                .status(200).code("SUCCESS").message(message)
                .path(req.getRequestURI())
                .data(items)
                .meta(meta)
                .build();
        return ResponseEntity.ok(body);
    }

    public static <T> ResponseEntity<ApiResponse<List<T>>> cursor(
            List<T> items, CursorMeta meta, String message, HttpServletRequest req) {
        var body = ApiResponse.<List<T>>builder()
                .status(200).code("SUCCESS").message(message)
                .path(req.getRequestURI())
                .data(items)
                .meta(meta)
                .build();
        return ResponseEntity.ok(body);
    }

    /**
     * Dùng cái này cho mọi Controller trả về phân trang.
     * @param pageResult: Kết quả Page trả về từ Service/Repository
     * @param filters: Map filters lấy từ FilterBuilder
     */
    public static <T> ResponseEntity<ApiResponse<List<T>>> success(
            Page<T> pageResult,
            Map<String, Object> filters,
            String message,
            HttpServletRequest httpRequest
    ) {
        // 1. Tự động build PageMeta từ Page<T>
        PageMeta meta = PageMeta.builder()
                .page(pageResult.getNumber())
                .size(pageResult.getSize())
                .totalItems(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .sort(pageResult.getSort().isSorted() ? Paging.sortString(pageResult.getSort()) : null)
                .filters(filters)
                .build();

        // 2. Gọi lại method gốc để trả về
        return page(pageResult.getContent(), meta, message, httpRequest);
    }
}
