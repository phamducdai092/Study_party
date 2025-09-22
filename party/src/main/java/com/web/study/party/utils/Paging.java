package com.web.study.party.utils;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class Paging {
    public static Pageable parsePageable(int page, int size, String sortParam) {
        if (sortParam == null || sortParam.isBlank()) {
            return PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedAt"));
        }
        // "updatedAt,desc" hoặc "name,asc"
        String[] parts = sortParam.split(",", 2);
        String prop = parts[0].trim();
        Sort.Direction dir = (parts.length > 1 && "asc".equalsIgnoreCase(parts[1].trim()))
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        return PageRequest.of(page, size, Sort.by(dir, prop));
    }

    public static String sortString(Sort sort) {
        if (sort == null || sort.isUnsorted()) return "updatedAt: DESC"; // default hiển thị
        StringBuilder sb = new StringBuilder();
        sort.forEach(o -> {
            if (!sb.isEmpty()) sb.append(",");
            sb.append(o.getProperty()).append(": ").append(o.getDirection().name());
        });
        return sb.toString();
    }
}
