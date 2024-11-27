package com.flowcraft.backend.mongodb.service;

import com.flowcraft.backend.mongodb.model.entity.User;
import com.flowcraft.backend.mongodb.exception.UserNotFoundException;
import com.flowcraft.backend.mongodb.repository.FunctionRepository;
import com.flowcraft.backend.mongodb.repository.OrgUnitRepository;
import com.flowcraft.backend.mongodb.repository.UserRepository;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.Collection;
import java.util.Map;
import java.util.Objects;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class ReadService {

    private final UserRepository userRepository;
    private final FunctionRepository functionRepository;
    private final OrgUnitRepository orgUnitRepository;
    private final MongoTemplate mongoTemplate;

    public @NonNull Collection<User> find(@NonNull final Map<String, String> suchkriterien) {
        log.debug("find: suchkriterien={}", suchkriterien);

        Query query = new Query();
        if (suchkriterien.get("type") != null) {
            query.addCriteria(Criteria.where("userType").is(suchkriterien.get("type")));
        }
        if (suchkriterien.get("role") != null) {
            query.addCriteria(Criteria.where("userRole").is(suchkriterien.get("role")));
        }
        if (suchkriterien.get("active") != null) {
            query.addCriteria(Criteria.where("active").is(suchkriterien.get("active")));
        }
        if (suchkriterien.get("orgUnit") != null) {
            query.addCriteria(Criteria.where("orgUnit").is(suchkriterien.get("orgUnit")));
        }

        log.debug("Executing query: {}", query);
        return mongoTemplate.find(query, User.class);
    }

    public User findById(String id) {
        log.debug("Fetching user by ID: {}", id);
        return userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));
    }

    public User findLeiterByUserId (final String userId) {
        log.debug("findLeiterByUserId: userId={}", userId);
        final var userAntragsteller = userRepository.findByUserId(userId).orElseThrow();
        log.debug("findLeiterByUserId: userAntragsteller={}", userAntragsteller);
        return findLeiter(userAntragsteller);
//        final var userFunction = userAntragsteller.getUserRole();

//        final var leiter = switch (userFunction) {
//            case "lecturer", "adminTechnicalStaff" -> findLeiter(userAntragsteller);
//            case "academicStaff" -> findLeiter(userAntragsteller);
//            case "professor" -> findLeiterVonProfessor(userAntragsteller);
//            default -> throw new IllegalStateException(String.format("Unexpected value: %s", userFunction));
//        };
//        log.debug("findLeiterByUserId: leiter={}", leiter);
//        return leiter;
    }

    private User findLeiter(final User antragsteller) {
        log.debug("findDekan: antragsteller={}", antragsteller);
        final var userOrgUnit = antragsteller.getOrgUnit();
        if (Objects.equals(userOrgUnit, "A0029")) {
            return antragsteller;
        }

        final var orgUnit = orgUnitRepository.findByOrgId(userOrgUnit).orElseThrow();
        final var leiterId = orgUnit.getLeiterId();
        log.debug("findLeiterByUserId: leiterId={}", leiterId);
        final var userLeiter = userRepository.findByUserId(leiterId).orElseThrow();
        log.debug("findLeiterByUserId: userLeiter={}", userLeiter);
        return userLeiter;
    }
}
