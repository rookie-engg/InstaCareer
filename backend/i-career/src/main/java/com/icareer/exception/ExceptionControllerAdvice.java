package com.icareer.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import io.jsonwebtoken.JwtException;

@RestControllerAdvice
public class ExceptionControllerAdvice {
	// HttpStatus.BAD_REQUEST (400), HttpStatus.NOT_FOUND (404),
	// or HttpStatus.INTERNAL_SERVER_ERROR (500) are more appropriate
	
    // 1. Most specific handlers first
    @ExceptionHandler(InstaCareerException.class)
    public ResponseEntity<ErrorMessage> instaCareerExceptionHandler(InstaCareerException ex) {
        ErrorMessage error = ex.getErrorMessage();
        if (error == null) {
            error = new ErrorMessage(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "An unexpected internal error occurred.");
        }
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
    
    // Spring Security exceptions
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorMessage> badCredentialsExceptionHandler(BadCredentialsException ex) {
        return new ResponseEntity<>(new ErrorMessage(HttpStatus.UNAUTHORIZED.value(), "Invalid username or password"), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorMessage> authenticationExceptionHandler(AuthenticationException ex) {
        // This will handle other authentication exceptions that are not BadCredentialsException
        return new ResponseEntity<>(new ErrorMessage(HttpStatus.UNAUTHORIZED.value(), "Authentication failed"), HttpStatus.UNAUTHORIZED);
    }
    
    // JWT-specific exception
    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ErrorMessage> jwtExceptionHandler(JwtException ex) {
        return new ResponseEntity<>(new ErrorMessage(HttpStatus.UNAUTHORIZED.value(), "Invalid JWT token"), HttpStatus.UNAUTHORIZED);
    }
    
    // Data access and other specific exceptions
    @ExceptionHandler(ObjectOptimisticLockingFailureException.class)
    public ResponseEntity<String> handleObjectOptimisticLockingFailureException(ObjectOptimisticLockingFailureException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.CONFLICT);
    }

    // 2. Generic handlers for RuntimeException, Exception, and Throwable at the end
    // Note: The String return type might not be what you want for a REST API. 
    // It's better to return a ResponseEntity<ErrorMessage> for consistency.
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorMessage> runtimeExceptionHandler(RuntimeException ex) {
        ErrorMessage error = new ErrorMessage();
        error.setErrorCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        error.setMessage("A runtime exception occurred: " + ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorMessage> handleGenericException(Exception ex) {
        ErrorMessage error = new ErrorMessage();
        error.setErrorCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        error.setMessage("An unexpected server error occurred: " + ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Throwable.class)
    public ResponseEntity<ErrorMessage> throwableHandler(Throwable ex) {
        ErrorMessage error = new ErrorMessage();
        error.setErrorCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        error.setMessage("An unrecoverable error occurred: " + ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}