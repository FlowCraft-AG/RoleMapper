package com.flowcraft.backend.mongodb.model.dto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.util.CollectionUtils.toMultiValueMap;

public record SuchkriterienDTO(
    String userType,
    String userRole,
    Boolean active,
    String orgUnit
) {
    public Map<String, String> toMap() {
        final Map<String, String> map = new HashMap<>();
        if (userType != null) {
            map.put("type", userType);
        }
        if (userRole != null) {
            map.put("role", userRole);
        }
        if (active != null) {
            map.put("active", active.toString());
        }
        if (orgUnit != null) {
            map.put("orgUnit", orgUnit);
        }

        return map;
    }
}
