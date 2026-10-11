package com.devnest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DocumentRequest(
    @NotBlank(message = "Source code cannot be empty")
    @Size(max = 12000, message = "Source code exceeds maximum allowed length of 12,000 characters")
    String code,

    String language,

    String format
) {
    public String getSanitizedLanguage() {
        return (language == null || language.isBlank()) ? "text" : language.trim().toLowerCase();
    }

    public String getSanitizedFormat() {
        if (format == null || format.isBlank()) {
            return "markdown";
        }
        String normalized = format.trim().toLowerCase();
        return switch (normalized) {
            case "javadoc", "markdown", "docstring", "jsdoc", "standard" -> normalized;
            default -> "markdown";
        };
    }
}
