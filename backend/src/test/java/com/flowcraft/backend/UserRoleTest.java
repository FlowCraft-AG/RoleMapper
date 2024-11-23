package com.flowcraft.backend;

import com.flowcraft.backend.mongodb.model.entity.UserRole;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class UserRoleTest {

    @Test
    void testOfValidValue() {
        assertEquals(UserRole.LECTURER, UserRole.of("lecturer"));
        assertEquals(UserRole.EMPTY, UserRole.of("-"));
    }

    @Test
    void testOfInvalidValue() {
        assertThrows(IllegalArgumentException.class, () -> UserRole.of("invalid"));
    }
}
