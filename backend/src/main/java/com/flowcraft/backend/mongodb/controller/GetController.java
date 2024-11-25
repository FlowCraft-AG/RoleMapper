package com.flowcraft.backend.mongodb.controller;

import com.flowcraft.backend.mongodb.model.BaseUserModel;
import com.flowcraft.backend.mongodb.model.EmployeeModel;
import com.flowcraft.backend.mongodb.model.StudentModel;
import com.flowcraft.backend.mongodb.model.entity.User;
import com.flowcraft.backend.mongodb.service.ReadService;
import com.flowcraft.backend.mongodb.utils.UriHelper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkRelation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static com.flowcraft.backend.mongodb.controller.GetController.REST_PATH;
import static org.springframework.hateoas.MediaTypes.HAL_JSON_VALUE;

@RestController
@RequestMapping(REST_PATH)
@RequiredArgsConstructor
@Slf4j
public class GetController {
    public static final String REST_PATH = "/rest";

    private final ReadService readService;
    private final UriHelper uriHelper;

    @GetMapping(produces = HAL_JSON_VALUE)
    public ResponseEntity<CollectionModel<BaseUserModel>> getUsers(
        @RequestParam @NonNull final Map<String, String> suchkriterien,
        final HttpServletRequest request
    ) {
        log.debug("getUsers: suchkriterien={}", suchkriterien);
        final var baseUri = uriHelper.getBaseUri(request).toString();

        final var userModels = readService.find(suchkriterien)
            .stream()
            .map(user -> {
                final var model = toModel(user);
                model.add(Link.of(baseUri + '/' + user.getId()));
                return model;
            })
            .toList();

        if (userModels.isEmpty()) {
            log.info("No users found for the given criteria.");
            return ResponseEntity.noContent().build();
        }

        log.info("Found {} users", userModels.size());
        return ResponseEntity.ok(CollectionModel.of(userModels));
    }


    @GetMapping("/{id}")
    public ResponseEntity<BaseUserModel> getById(@PathVariable String id, final HttpServletRequest request) {
        log.info("Fetching user by ID: {}", id);
        User user = readService.findById(id);
        return ResponseEntity.ok(gastToModel(user, request));
    }


    private BaseUserModel toModel(User user) {
        if ("student".equalsIgnoreCase(user.getUserType()) && user.getStudent() != null) {
            return new StudentModel(user, user.getStudent());
        } else if ("employee".equalsIgnoreCase(user.getUserType()) && user.getEmployee() != null) {
            return new EmployeeModel(user, user.getEmployee());
        }
        return new BaseUserModel(user);
    }

    private BaseUserModel gastToModel(final User user, final HttpServletRequest request) {
        final var baseUri = uriHelper.getBaseUri(request).toString();
        final var idUri = baseUri + '/' + user.getId();

        BaseUserModel model = toModel(user);

        final var selfLink = Link.of(idUri);
        final var listLink = Link.of(baseUri, LinkRelation.of("list"));
        final var addLink = Link.of(baseUri, LinkRelation.of("add"));
        final var updateLink = Link.of(idUri, LinkRelation.of("update"));
        final var removeLink = Link.of(idUri, LinkRelation.of("remove"));
        model.add(selfLink, listLink, addLink, updateLink, removeLink);

        return model;
    }

}
