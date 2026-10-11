package com.devnest.dto;

import java.util.List;

public record DocumentResponse(
    String summary,
    List<String> parameters,
    String returnValue,
    List<String> exceptions,
    String exampleUsage,
    String generatedDocumentation,
    String markdownContent
) {}
