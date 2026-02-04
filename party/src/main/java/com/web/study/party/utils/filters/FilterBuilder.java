package com.web.study.party.utils.filters;

import java.util.LinkedHashMap;
import java.util.Map;

public class FilterBuilder {
    
    // Cách dùng: Map<String, Object> filters = FilterBuilder.create().add("status", status).build();
    public static Builder create() {
        return new Builder();
    }

    public static class Builder {
        private final Map<String, Object> map = new LinkedHashMap<>();

        public Builder add(String key, Object value) {
            // Chỉ thêm vào map nếu value có dữ liệu
            if (value != null && !value.toString().isBlank()) {
                map.put(key, value);
            }
            return this;
        }

        public Map<String, Object> build() {
            return map.isEmpty() ? null : map;
        }
    }
}