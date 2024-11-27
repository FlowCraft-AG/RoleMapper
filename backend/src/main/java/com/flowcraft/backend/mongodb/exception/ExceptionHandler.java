package com.flowcraft.backend.mongodb.exception;

import graphql.GraphQLError;
import org.springframework.graphql.data.method.annotation.GraphQlExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;

import static org.springframework.graphql.execution.ErrorType.NOT_FOUND;


@ControllerAdvice
final class ExceptionHandler {
    @GraphQlExceptionHandler
    GraphQLError onNotFound(final UserNotFoundException ex) {
        final var id = ex.getUserId();
        final var message = String.format("Kein Kunde mit der ID %s gefunden", id);
        return GraphQLError.newError()
            .errorType(NOT_FOUND)
            .message(message)
            .build();
    }
}
