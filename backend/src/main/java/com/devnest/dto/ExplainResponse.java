package com.devnest.dto;

import java.util.List;

public record ExplainResponse(
    String summary,
    List<String> steps,
    List<String> keyComponents,
    String example,
    List<String> potentialIssues,
    String markdownContent
) {}
