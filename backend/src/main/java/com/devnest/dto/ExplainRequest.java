package com.devnest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ExplainRequest(
    @NotBlank(message = "Source code cannot be empty")
    @Size(max = 12000, message = "Source code exceeds maximum allowed length of 12,000 characters")
    String code,

    String language,

    String level
) {
    public String getSanitizedLanguage() {
        return (language == null || language.isBlank()) ? "text" : language.trim().toLowerCase();
    }

    public String getSanitizedLevel() {
        if (level == null || level.isBlank()) {
            return "intermediate";
        }
        String normalized = level.trim().toLowerCase();
        return switch (normalized) {
            case "beginner", "intermediate", "advanced" -> normalized;
            default -> "intermediate";
        };
    }
}
