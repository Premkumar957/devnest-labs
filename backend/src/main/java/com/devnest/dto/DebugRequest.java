package com.devnest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DebugRequest(
    @NotBlank(message = "Error message or stack trace cannot be empty")
    @Size(max = 6000, message = "Error message exceeds maximum allowed length of 6,000 characters")
    String error,

    @Size(max = 12000, message = "Source code exceeds maximum allowed length of 12,000 characters")
    String code,

    String language,

    @Size(max = 2000, message = "Expected behavior exceeds maximum length of 2,000 characters")
    String expectedBehavior
) {
    public String getSanitizedLanguage() {
        return (language == null || language.isBlank()) ? "text" : language.trim().toLowerCase();
    }
}
