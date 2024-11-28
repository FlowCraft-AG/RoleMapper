package com.flowcraft.backend.mongodb.service;

import com.flowcraft.backend.mongodb.exception.UserNotFoundException;
import com.flowcraft.backend.mongodb.model.entity.User;
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

    /**
     * Findet Benutzer basierend auf den angegebenen Suchkriterien.
     *
     * @param suchkriterien Kriterien als Map.
     * @return Eine Sammlung von Benutzern, die den Kriterien entsprechen.
     */
    public @NonNull Collection<User> find(@NonNull final Map<String, String> suchkriterien) {
        log.debug("find: suchkriterien={}", suchkriterien);

        Query query = new Query();
        suchkriterien.forEach((key, value) -> {
            if (value != null) {
                query.addCriteria(Criteria.where(key).is(value));
            }
        });

        log.debug("Executing query: {}", query);
        return mongoTemplate.find(query, User.class);
    }

    /**
     * Findet einen Benutzer anhand seiner ID.
     *
     * @param id Benutzer-ID.
     * @return Der Benutzer, falls gefunden.
     * @throws UserNotFoundException Wenn kein Benutzer mit der ID existiert.
     */
    public User findById(String id) {
        log.debug("Fetching user by ID: {}", id);
        return userRepository.findByUserId(id)
            .orElseThrow(() -> new UserNotFoundException(String.format("Benutzer mit ID %s nicht gefunden", id)));
    }

    /**
     * Findet den Leiter eines Benutzers basierend auf seiner Benutzer-ID.
     *
     * @param userId Benutzer-ID.
     * @return Der Leiter, falls vorhanden.
     */
    public User findLeiterByUserId2(final String userId) {
        log.debug("findLeiterByUserId: userId={}", userId);
        final var userAntragsteller = userRepository.findByUserId(userId)
            .orElseThrow(() -> new UserNotFoundException(String.format("Benutzer mit ID %s nicht gefunden", userId)));
        log.debug("findLeiterByUserId: userAntragsteller={}", userAntragsteller);
        return findLeiter(userAntragsteller);
    }

    /**
     * Findet den Leiter für einen gegebenen Benutzer.
     *
     * @param antragsteller Der Benutzer, dessen Leiter gefunden werden soll.
     * @return Der Leiter, falls vorhanden.
     * @throws UserNotFoundException Wenn kein Leiter gefunden wurde.
     */
    private User findLeiter(final User antragsteller) {
        log.debug("findLeiter: antragsteller={}", antragsteller.getId());
        final var userOrgUnit = antragsteller.getOrgUnit();

        if (Objects.equals(userOrgUnit, "A0029")) {
            return antragsteller; // Der Benutzer ist selbst der Leiter
        }

        final var orgUnit = orgUnitRepository.findById(userOrgUnit)
            .orElseThrow(() -> new UserNotFoundException(
                String.format("Organisationseinheit mit ID %s nicht gefunden", userOrgUnit)
            ));

        final var leiterFunctionId = orgUnit.getSupervisor();
        log.debug("findLeiter: leiterId={}", leiterFunctionId);

        final var leiterFunction = functionRepository.findById(leiterFunctionId);
        log.debug("findLeiter: leiterFunction={}", leiterFunction);

        final var leiterId = leiterFunction.get().getUser().getFirst();
        log.debug("findLeiter: leiterId={}", leiterId);

        return userRepository.findByUserId(leiterId)
            .orElseThrow(() -> new UserNotFoundException(
                String.format("Leiter mit ID %s nicht gefunden", leiterFunction)
            ));
    }

    public User findLeiterByUserId(final String userKennung) {
        final var userFunction = functionRepository.findByUserKennung(userKennung);
        log.debug("findLeiterByUserId: userFunction={}", userFunction);

        final var userOrgUnit = userFunction.get().getOrgUnit();
        log.debug("findLeiterByUserId: UserOrgUnit={}", userOrgUnit);

        if (Objects.equals(userOrgUnit, "6745da29a586857aa17d76d0")) {
            return userRepository.findByUserId(userKennung).orElseThrow();
        }

        final var orgUnit = orgUnitRepository.findById(userOrgUnit);
        log.debug("findLeiterByUserId: orgUnit={}", orgUnit);

        final var orgUnitSupervisor = orgUnit.get().getSupervisor();
        log.debug("findLeiterByUserId: orgUnitSupervisor={}", orgUnitSupervisor);

        final var leiterFunction = functionRepository.findById(orgUnitSupervisor);
        log.debug("findLeiterByUserId: leiterFunction={}", leiterFunction);

        final var leiterId = leiterFunction.get().getUser().getFirst();
        log.debug("findLeiterByUserId: leiterId={}", leiterId);

        final var userLeiter = userRepository.findByUserId(leiterId).orElseThrow();
        log.debug("findLeiterByUserId: userLeiter={}", userLeiter);

        return userLeiter;
    }
}
