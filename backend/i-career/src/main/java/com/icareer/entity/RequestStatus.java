package com.icareer.entity;

/**
 * Enum to represent the status of a user request.
 * This directly maps to the 'request_status' ENUM type in the database.
 */
public enum RequestStatus {
    RECEIVED,
    PROCESSING,
    COMPLETED,
    FAILED
}