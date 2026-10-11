package com.devnest.dto;

import java.time.Instant;
import java.util.Map;

public record HealthResponse(
    String status,
    String application,
    String version,
    Instant timestamp,
    Map<String, Object> details
) {}
