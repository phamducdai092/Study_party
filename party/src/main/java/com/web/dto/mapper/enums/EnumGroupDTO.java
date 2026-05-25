package com.web.dto.mapper.enums;

public record EnumGroupDTO(
        String name,               // "GroupTopic"
        java.util.List<EnumItemDTO> items
) {
}