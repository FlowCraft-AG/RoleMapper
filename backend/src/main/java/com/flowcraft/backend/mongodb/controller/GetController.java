package com.flowcraft.backend.mongodb.controller;

import com.flowcraft.backend.mongodb.model.entity.User;
import com.flowcraft.backend.mongodb.service.ReadService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(GetController.REST_PATH)
@RequiredArgsConstructor
@Slf4j
public class GetController {
    public static final String REST_PATH = "/rest";

    private final ReadService readService;

    @GetMapping(produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<List<User>> getUsers(
        @RequestParam(required = false) String type,
        @RequestParam(required = false) String role,
        @RequestParam(required = false) Boolean active,
        @RequestParam(required = false) String orgUnit
    ) {
        log.debug("Fetching users with parameters: type={}, role={}, active={}, orgUnit={}", type, role, active, orgUnit);
        List<User> users = readService.find(type, role, active, orgUnit);

        if (users.isEmpty()) {
            log.info("No users found for the given criteria.");
            return ResponseEntity.noContent().build();
        }

        log.info("Found {} users", users.size());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable final String id) {
        log.info("Fetching user by ID: {}", id);
        User user = readService.findById(id);
        return ResponseEntity.ok(user);
    }



}
