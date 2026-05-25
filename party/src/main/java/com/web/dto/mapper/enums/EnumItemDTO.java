package com.web.dto.mapper.enums;

public record EnumItemDTO(
        String code,
        String label,
        String description,
        String color,
        String icon,
        int order,
        boolean active
) {
}
