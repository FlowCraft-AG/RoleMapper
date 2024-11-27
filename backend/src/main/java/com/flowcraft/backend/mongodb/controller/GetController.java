package com.flowcraft.backend.mongodb.controller;

import com.flowcraft.backend.mongodb.exception.UserNotFoundException;
import com.flowcraft.backend.mongodb.model.BaseUserModel;
import com.flowcraft.backend.mongodb.model.EmployeeModel;
import com.flowcraft.backend.mongodb.model.StudentModel;
import com.flowcraft.backend.mongodb.model.dto.SuchkriterienDTO;
import com.flowcraft.backend.mongodb.model.entity.User;
import com.flowcraft.backend.mongodb.model.enums.ProblemType;
import com.flowcraft.backend.mongodb.security.JwtService;
import com.flowcraft.backend.mongodb.service.ReadService;
import com.flowcraft.backend.mongodb.utils.UriHelper;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.LinkRelation;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

import static com.flowcraft.backend.mongodb.controller.GetController.REST_PATH;
import static org.springframework.hateoas.MediaTypes.HAL_JSON_VALUE;
import static org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY;

@RestController
@RequestMapping(REST_PATH)
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Benutzeroperationen", description = "APIs zum Verwalten und Abrufen von Benutzerdaten")
@OpenAPIDefinition(
    info = @Info(
        title = "FlowCraft Backend API",
        version = "1.0.0",
        description = "Dies ist die API-Dokumentation für das FlowCraft Backend, das auf MongoDB basiert. Die API bietet Funktionen zum Verwalten von Benutzern, einschließlich Studenten und Mitarbeitern.",
        contact = @Contact(
            name = "FlowCraft Support",
            email = "support@flowcraft.com",
            url = "https://flowcraft.com"
        ),
        license = @License(
            name = "Apache 2.0",
            url = "http://www.apache.org/licenses/LICENSE-2.0"
        )
    ),
    servers = {
        @Server(url = "https://localhost:8080", description = "Lokale Entwicklungsumgebung"),
        @Server(url = "https://api.flowcraft.com", description = "Produktivumgebung")
    },
    security = {
    @SecurityRequirement(name = "bearerAuth")
}
)
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT"
)
public class GetController {
    public static final String REST_PATH = "/rest";
    public static final String PROBLEM_PATH = "/problem/";

    private final ReadService readService;
    private final UriHelper uriHelper;
    private final JwtService jwtService;

    /**
     * Ruft eine Sammlung von Benutzern basierend auf Suchkriterien ab.
     *
     * @param suchkriterienDTO Die Suchkriterien als Schlüssel-Wert-Paare.
     * @param request Die HTTP-Anfrage.
     * @param jwt Das authentifizierte JWT-Token des aktuellen Benutzers.
     * @return Eine Sammlung von Benutzermodellen, die den Kriterien entsprechen.
     */
    @Operation(
        summary = "Benutzer abrufen",
        description = "Ruft eine Liste von Benutzern basierend auf den angegebenen Suchkriterien ab.",
        security = @SecurityRequirement(name = "bearerAuth"),
        responses = {
            @ApiResponse(responseCode = "200", description = "Benutzer erfolgreich abgerufen",
                content = @Content(mediaType = HAL_JSON_VALUE, schema = @Schema(implementation = CollectionModel.class))),
            @ApiResponse(responseCode = "204", description = "Keine Benutzer für die angegebenen Kriterien gefunden"),
            @ApiResponse(responseCode = "401", description = "Nicht autorisierter Zugriff")
        }
    )
    @GetMapping(produces = HAL_JSON_VALUE)
    public ResponseEntity<CollectionModel<BaseUserModel>> getUsers(
        @ModelAttribute SuchkriterienDTO suchkriterienDTO,
        final HttpServletRequest request,
        @AuthenticationPrincipal final Jwt jwt
    ) {
        final var username = jwtService.getUsername(jwt);
        log.debug("getById: username={}", username);
        log.debug("getById: username={}****", username.substring(0, 3));


        final var rollen = jwtService.getRollen(jwt);
        log.trace("getById: rollen={}", rollen);

        log.debug("getUsers: suchkriterien={}", suchkriterienDTO);
        // Validierung der Suchkriterien
        suchkriterienDTO.validate();

        // Konvertiere SuchkriterienDTO in Map<String, String>
        final var suchkriterienMap = suchkriterienDTO.toMap();
        final var baseUri = uriHelper.getBaseUri(request).toString();

        final var userModels = readService.find(suchkriterienMap)
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


    /**
     * Ruft einen Benutzer anhand seiner eindeutigen ID ab.
     *
     * @param id Die ID des Benutzers.
     * @param request Die HTTP-Anfrage.
     * @return Das Benutzermodell für die angegebene ID.
     */
    @Operation(
        summary = "Benutzer anhand der ID abrufen",
        description = "Ruft einen einzelnen Benutzer anhand seiner eindeutigen ID ab."
    )
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponse(
        responseCode = "404",
        description = "Benutzer nicht gefunden"
    )
    @ApiResponse(
        responseCode = "202",
        description = "Benutzer erfolgreich abgerufen",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = BaseUserModel.class),
            examples = {
                @ExampleObject(
                    name = "Beispiel gyca1011",
                    value = "{\n" +
                        "            \"id\": \"673ed989e1746bf8e6aa19e4\",\n" +
                        "            \"userId\": \"gyca1011\",\n" +
                        "            \"userType\": \"student\",\n" +
                        "            \"userRole\": \"-\",\n" +
                        "            \"orgUnit\": \"IWI\",\n" +
                        "            \"active\": true,\n" +
                        "            \"validFrom\": \"2024-01-04T01:21:03.176\",\n" +
                        "            \"validUntil\": \"2100-12-31T01:00\",\n" +
                        "            \"student\": {\n" +
                        "                \"id\": \"65c501afa3cc6ccbde337542\",\n" +
                        "                \"courseOfStudy\": \"WIB\",\n" +
                        "                \"courseOfStudyUnique\": \"58|WIB|-|-|H|6|-|S|V|1|\",\n" +
                        "                \"courseOfStudyShort\": \"WIIB\",\n" +
                        "                \"courseOfStudyName\": \"Wirtschaftsinformatik\",\n" +
                        "                \"level\": \"Bachelor\",\n" +
                        "                \"examRegulation\": \"6\"\n" +
                        "            }\n" +
                        "        }",
                    summary = "Beispiel für einen Studenten"
                ),
                @ExampleObject(
                    name = "Beispiel nera0001",
                    value = "{\n" +
                        "            \"id\": \"673ede38e1746bf8e6aa1b3e\",\n" +
                        "            \"userId\": \"nera0001\",\n" +
                        "            \"userType\": \"employee\",\n" +
                        "            \"userRole\": \"professor\",\n" +
                        "            \"orgUnit\": \"A0029\",\n" +
                        "            \"active\": true,\n" +
                        "            \"validFrom\": \"2008-03-17T01:00\",\n" +
                        "            \"validUntil\": \"2100-12-31T01:00\",\n" +
                        "            \"employee\": {\n" +
                        "                \"costCenter\": \"A0029\",\n" +
                        "                \"department\": \"Rektorat\"\n" +
                        "            }\n" +
                        "        }",
                    summary = "Beispiel für einen Mitarbeiter"
                )
            }
        )
    )
    @GetMapping("/{id}")
    public ResponseEntity<BaseUserModel> getById(
        @Parameter(
            description = "Die eindeutige Benutzer-Kennung",
            required = true,
            examples = {
                @io.swagger.v3.oas.annotations.media.ExampleObject(
                    summary = "Die eindeutige Benutzer-ID",
                    name = "Beispiel gyca1011",
                    value = "gyca1011"
                ),
                @ExampleObject(
                    summary = "Beispiel für einen Mitarbeiter",
                    name = "Beispiel nefr0002",
                    value = "nefr0002"

                )
            }
        )
        @PathVariable String id,
        final HttpServletRequest request) {
        log.debug("Fetching user by ID: {}", id);
        User user = readService.findById(id);
        return ResponseEntity.ok(gastToModel(user, request));
    }

    /**
     * Ruft den Leiter (Leiter) ab, der mit einer bestimmten Benutzer-ID verknüpft ist.
     *
     * @param id Die ID des Benutzers, für den der Leiter abgerufen werden soll.
     * @param request Die HTTP-Anfrage.
     * @return Das Benutzermodell des Leiters.
     */
    @Operation(
        summary = "Leiter anhand der Benutzer-ID abrufen",
        description = "Ruft den Leiter ab, der mit der angegebenen Benutzer-ID verknüpft ist.",
        security = @SecurityRequirement(name = "bearerAuth"),
        responses = {
            @ApiResponse(responseCode = "200", description = "Leiter erfolgreich abgerufen",
                content = @Content(mediaType = HAL_JSON_VALUE, schema = @Schema(implementation = BaseUserModel.class))),
            @ApiResponse(responseCode = "404", description = "Leiter für die angegebene Benutzer-ID nicht gefunden")
        }
    )
    @GetMapping("/leiter/{id}")
    public ResponseEntity<BaseUserModel> getLeiterById(@PathVariable String id, final HttpServletRequest request) {
        log.debug("getLeiterById: antragsteller={}", id);
        User user = readService.findLeiterByUserId(id);
        return ResponseEntity.ok(gastToModel(user, request));
    }

    private BaseUserModel toModel(User user) {
        if ("student".equalsIgnoreCase(String.valueOf(user.getUserType())) && user.getStudent() != null) {
            return new StudentModel(user, user.getStudent());
        } else if ("employee".equalsIgnoreCase(String.valueOf(user.getUserType())) && user.getEmployee() != null) {
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

    @ExceptionHandler
    ProblemDetail onUserNotFound(final UserNotFoundException ex, final HttpServletRequest request) {
        log.debug("onUserNotFound: {}", ex.getMessage());
        final var problemDetail = ProblemDetail.forStatusAndDetail(UNPROCESSABLE_ENTITY, ex.getMessage());
        problemDetail.setType(URI.create(PROBLEM_PATH + ProblemType.CONSTRAINTS.getValue()));
        problemDetail.setInstance(URI.create(request.getRequestURL().toString()));
        return problemDetail;
    }

}
