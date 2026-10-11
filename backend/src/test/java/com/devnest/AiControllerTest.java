package com.devnest;

import com.devnest.dto.DebugRequest;
import com.devnest.dto.DocumentRequest;
import com.devnest.dto.ExplainRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/v1/health should return UP status")
    void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/api/v1/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.application").value("DevNest Labs Backend"));
    }

    @Test
    @DisplayName("POST /api/v1/ai/explain should return explanation structure")
    void testExplainEndpoint() throws Exception {
        ExplainRequest request = new ExplainRequest(
                "public int add(int a, int b) { return a + b; }",
                "java",
                "beginner"
        );

        mockMvc.perform(post("/api/v1/ai/explain")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.feature").value("explain"))
                .andExpect(jsonPath("$.result.summary").isNotEmpty())
                .andExpect(jsonPath("$.result.steps").isArray());
    }

    @Test
    @DisplayName("POST /api/v1/ai/explain with blank code should return 400 Bad Request")
    void testExplainValidation() throws Exception {
        ExplainRequest request = new ExplainRequest("", "java", "beginner");

        mockMvc.perform(post("/api/v1/ai/explain")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error").isNotEmpty());
    }

    @Test
    @DisplayName("POST /api/v1/ai/debug should return debug analysis")
    void testDebugEndpoint() throws Exception {
        DebugRequest request = new DebugRequest(
                "java.lang.NullPointerException: Cannot invoke \"String.length()\" because \"str\" is null",
                "public int getLength(String str) { return str.length(); }",
                "java",
                "Should return 0 for null strings"
        );

        mockMvc.perform(post("/api/v1/ai/debug")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.feature").value("debug"))
                .andExpect(jsonPath("$.result.likelyCauses").isArray())
                .andExpect(jsonPath("$.result.suggestedSolution").isNotEmpty());
    }

    @Test
    @DisplayName("POST /api/v1/ai/document should return documentation")
    void testDocumentEndpoint() throws Exception {
        DocumentRequest request = new DocumentRequest(
                "public int multiply(int a, int b) { return a * b; }",
                "java",
                "javadoc"
        );

        mockMvc.perform(post("/api/v1/ai/document")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.feature").value("document"))
                .andExpect(jsonPath("$.result.generatedDocumentation").isNotEmpty());
    }
}
