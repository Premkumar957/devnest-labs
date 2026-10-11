package com.devnest.dto;

import java.util.List;

public record DebugResponse(
    String errorMeaning,
    List<String> likelyCauses,
    String suggestedSolution,
    String correctedCode,
    List<String> verificationSteps,
    String confidenceLevel,
    String markdownContent
) {}
