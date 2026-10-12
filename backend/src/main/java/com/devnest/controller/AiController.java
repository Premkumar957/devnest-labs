package com.devnest.controller;

import com.devnest.dto.*;
import com.devnest.service.GeminiService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ai")
public class AiController {

    private final GeminiService geminiService;

    public AiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/explain")
    public ResponseEntity<ApiResponse<ExplainResponse>> explainCode(
            @Valid @RequestBody ExplainRequest request
    ) {
        ExplainResponse response = geminiService.explainCode(request);
        return ResponseEntity.ok(ApiResponse.success("explain", response, "Code explained successfully"));
    }

    @PostMapping("/debug")
    public ResponseEntity<ApiResponse<DebugResponse>> debugError(
            @Valid @RequestBody DebugRequest request
    ) {
        DebugResponse response = geminiService.debugError(request);
        return ResponseEntity.ok(ApiResponse.success("debug", response, "Error analyzed successfully"));
    }

    @PostMapping("/document")
    public ResponseEntity<ApiResponse<DocumentResponse>> generateDocumentation(
            @Valid @RequestBody DocumentRequest request
    ) {
        DocumentResponse response = geminiService.generateDocumentation(request);
        return ResponseEntity.ok(ApiResponse.success("document", response, "Documentation generated successfully"));
    }
}
