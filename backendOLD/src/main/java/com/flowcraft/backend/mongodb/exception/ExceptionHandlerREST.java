package com.flowcraft.backend.mongodb.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;


@ControllerAdvice

@Slf4j
final class ExceptionHandlerREST {

    @ExceptionHandler
    @ResponseStatus(HttpStatus.NOT_FOUND)
    void onNotFound(final UserNotFoundException ex) {
        log.debug("onNotFound: {}", ex.getMessage());
    }

//        @ExceptionHandler
//        @ResponseStatus(FORBIDDEN)
//        void onAccessForbidden(final AccessForbiddenException ex) {
//            log.debug("onAccessForbidden: {}", ex.getMessage());
//        }
}
