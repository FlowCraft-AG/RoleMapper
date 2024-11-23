package com.flowcraft.backend.mongodb.service;

import com.flowcraft.backend.mongodb.model.entity.User;
import com.flowcraft.backend.mongodb.exception.UserNotFoundException;
import com.flowcraft.backend.mongodb.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class ReadService {

    private final UserRepository userRepository;
    private final MongoTemplate mongoTemplate;

    public List<User> find(final String type, final String role, final Boolean active, final String orgUnit ) {
        log.debug("Searching users with parameters: type={}, role={}, active={}, orgUnit={}", type, role, active, orgUnit);

        Query query = new Query();
        if (type != null) {
            query.addCriteria(Criteria.where("userType").is(type));
        }
        if (role != null) {
            query.addCriteria(Criteria.where("userRole").is(role));
        }
        if (active != null) {
            query.addCriteria(Criteria.where("active").is(active));
        }
        if (orgUnit != null) {
            query.addCriteria(Criteria.where("orgUnit").is(orgUnit));
        }

        log.debug("Executing query: {}", query);
        return mongoTemplate.find(query, User.class);
    }

    public User findById(String id) {
        log.debug("Fetching user by ID: {}", id);
        return userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + id));
    }
}
