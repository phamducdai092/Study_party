package com.web.utils.filters;



import lombok.extern.slf4j.Slf4j;

import java.lang.reflect.Field;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
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

        public Builder mapOf(Object object) {

            if (object == null) return this;

            Class<?> clazz = object.getClass();

            // Duyệt qua tất cả các field của object
            // Nếu object có kế thừa từ class cha (BaseFilter) thì cần dùng vòng lặp while(clazz != null) để lấy cả field cha
            while (clazz != null && clazz != Object.class) {
                Field[] fields = clazz.getDeclaredFields();
                for (Field field : fields) {
                    try {
                        field.setAccessible(true); // Cho phép đọc private field
                        Object value = field.get(object);
                        String key = field.getName();

                        // Bỏ qua field log, static hoặc các field không mong muốn (tuỳ chọn)
                        if (key.equals("serialVersionUID") || key.equals("log")) continue;

                        // Tận dụng lại hàm add để check null/blank
                        this.add(key, value);
                    } catch (IllegalAccessException e) {
                        log.error("Error mapping field in FilterBuilder: {}", e.getMessage(), e);
                    }
                }
                clazz = clazz.getSuperclass(); // Leo lên class cha để lấy tiếp field (nếu có)
            }
            return this;
        }

        public Map<String, Object> build() {
            return map.isEmpty() ? null : map;
        }
    }
}