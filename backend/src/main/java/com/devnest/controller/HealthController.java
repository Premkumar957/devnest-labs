package com.devnest.controller;

import com.devnest.dto.HealthResponse;
import com.devnest.service.ClaudeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    private final ClaudeService claudeService;

    public HealthController(ClaudeService claudeService) {
        this.claudeService = claudeService;
    }

    @GetMapping
    public ResponseEntity<HealthResponse> checkHealth() {
        Map<String, Object> details = Map.of(
                "claudeApiConfigured", claudeService.isConfigured(),
                "activeModel", claudeService.getActiveModel(),
                "javaVersion", System.getProperty("java.version"),
                "uptimeMillis", System.currentTimeMillis()
        );

        HealthResponse response = new HealthResponse(
                "UP",
                "DevNest Labs Backend",
                "1.0.0",
                Instant.now(),
                details
        );
        return ResponseEntity.ok(response);
    }
}
