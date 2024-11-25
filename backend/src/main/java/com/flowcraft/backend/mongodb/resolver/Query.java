package com.flowcraft.backend.mongodb.resolver;

import com.flowcraft.backend.mongodb.model.dto.SuchkriterienDTO;
import com.flowcraft.backend.mongodb.model.entity.User;
import com.flowcraft.backend.mongodb.service.ReadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.Collection;
import java.util.Optional;

import static java.util.Collections.emptyMap;

@Controller
@RequiredArgsConstructor
@Slf4j
public class Query {

    private final ReadService readService;

    @QueryMapping("users")
    Collection<User> getUsers(@Argument final Optional<SuchkriterienDTO> suchkriterien) {
        log.debug("find: input={}", suchkriterien);
        final var suchkriterienMap = suchkriterien.map(SuchkriterienDTO::toMap).orElse(emptyMap());
        return readService.find(suchkriterienMap);
    }

    @QueryMapping("user")
    User userById(@Argument String id) {
        return readService.findById(id);
    }

}
