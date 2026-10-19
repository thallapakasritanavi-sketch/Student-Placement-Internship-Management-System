package com.sritanavi.placement.exception;

/**
 * Thrown when an authenticated user attempts to access a resource they are not authorised to see.
 * Results in HTTP 403 Forbidden via GlobalExceptionHandler.
 */
public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message) {
        super(message);
    }
}
