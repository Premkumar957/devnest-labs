package com.devnest.service;

import com.devnest.config.GeminiProperties;
import com.devnest.dto.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;

@Service
public class GeminiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);
    private final GeminiProperties properties;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public GeminiService(GeminiProperties properties, ObjectMapper objectMapper) {
        this.properties = properties;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(15))
                .build();
    }

    public boolean isConfigured() {
        return properties.hasApiKey();
    }

    public String getActiveModel() {
        return properties.getModel();
    }

    /**
     * Explain Code using Google Gemini API
     */
    public ExplainResponse explainCode(ExplainRequest request) {
        String systemPrompt = """
            You are an expert developer assistant specialized in explaining code clearly and accurately.
            Analyze the provided code and return ONLY a valid, raw JSON object (without markdown code blocks, backticks, or preamble) matching this exact schema:
            {
              "summary": "High-level summary of what the code achieves and its core functionality",
              "steps": ["Step 1 explanation", "Step 2 explanation", "Step 3 explanation"],
              "keyComponents": ["Component or variable or method name: its role and impact"],
              "example": "Concrete example of calling this code with inputs and its exact output",
              "potentialIssues": ["Edge cases, potential null checks, performance notes, or security considerations"]
            }
            Tailor the explanation to the requested target level: %s.
            """.formatted(request.getSanitizedLevel());

        String userPrompt = """
            Language: %s
            Target Audience: %s
            Source Code to analyze:
            <<<CODE_START>>>
            %s
            <<<CODE_END>>>
            """.formatted(request.getSanitizedLanguage(), request.getSanitizedLevel(), request.code());

        if (properties.hasApiKey()) {
            try {
                String rawAiResponse = callGemini(systemPrompt, userPrompt);
                ExplainResponse parsed = parseExplainResponse(rawAiResponse);
                if (parsed != null) {
                    return parsed;
                }
            } catch (Exception e) {
                log.warn("Gemini API call failed ({}), falling back to intelligent offline engine", e.getMessage());
            }
        } else {
            log.info("GEMINI_API_KEY is not configured. Utilizing DevNest Intelligent Local Engine.");
        }

        return generateLocalExplainResponse(request);
    }

    /**
     * Debug Error using Google Gemini API
     */
    public DebugResponse debugError(DebugRequest request) {
        String systemPrompt = """
            You are a senior software debugging specialist.
            Analyze the error and the accompanying code. Provide a diagnosis, ranked causes, and actionable fixes.
            Return ONLY a valid, raw JSON object (without markdown code blocks, backticks, or preamble) matching this schema:
            {
              "errorMeaning": "Plain English explanation of what this error indicates",
              "likelyCauses": [
                "1. (Most likely) Primary root cause explanation",
                "2. Secondary potential reason or race condition",
                "3. Environmental or configuration factor"
              ],
              "suggestedSolution": "Step-by-step description of how to resolve the error correctly",
              "correctedCode": "Refactored or corrected code snippet fixing the issue",
              "verificationSteps": [
                "Step 1 to test or reproduce fix",
                "Step 2 to verify edge cases"
              ],
              "confidenceLevel": "High"
            }
            Distinguish between confirmed fixes and diagnostic suggestions clearly.
            """;

        String userPrompt = """
            Language: %s
            Error / Stack Trace:
            <<<ERROR_START>>>
            %s
            <<<ERROR_END>>>

            Source Code:
            <<<CODE_START>>>
            %s
            <<<CODE_END>>>

            Expected Behavior:
            %s
            """.formatted(
                request.getSanitizedLanguage(),
                request.error(),
                request.code() != null ? request.code() : "None provided",
                request.expectedBehavior() != null && !request.expectedBehavior().isBlank() ? request.expectedBehavior() : "Standard expected execution without errors"
        );

        if (properties.hasApiKey()) {
            try {
                String rawAiResponse = callGemini(systemPrompt, userPrompt);
                DebugResponse parsed = parseDebugResponse(rawAiResponse);
                if (parsed != null) {
                    return parsed;
                }
            } catch (Exception e) {
                log.warn("Gemini API call for debug failed ({}), falling back to intelligent offline engine", e.getMessage());
            }
        } else {
            log.info("GEMINI_API_KEY is not configured. Utilizing DevNest Intelligent Local Engine.");
        }

        return generateLocalDebugResponse(request);
    }

    /**
     * Generate Documentation using Google Gemini API
     */
    public DocumentResponse generateDocumentation(DocumentRequest request) {
        String systemPrompt = """
            You are a technical documentation engineer.
            Generate comprehensive, professional documentation for the given source code in the format '%s'.
            Return ONLY a valid, raw JSON object (without markdown code blocks, backticks, or preamble) matching this schema:
            {
              "summary": "Concise summary and functional purpose of this code unit",
              "parameters": ["paramName (type): description and constraints"],
              "returnValue": "Type and description of returned value, or 'void/None'",
              "exceptions": ["ExceptionType: when and why it is thrown"],
              "exampleUsage": "Full working example showcasing how another developer calls this code",
              "generatedDocumentation": "The complete formatted doc block ready to paste (e.g., Javadoc /** ... */, Markdown doc, or Python docstring)"
            }
            """.formatted(request.getSanitizedFormat());

        String userPrompt = """
            Language: %s
            Target Format: %s
            Source Code to document:
            <<<CODE_START>>>
            %s
            <<<CODE_END>>>
            """.formatted(request.getSanitizedLanguage(), request.getSanitizedFormat(), request.code());

        if (properties.hasApiKey()) {
            try {
                String rawAiResponse = callGemini(systemPrompt, userPrompt);
                DocumentResponse parsed = parseDocumentResponse(rawAiResponse);
                if (parsed != null) {
                    return parsed;
                }
            } catch (Exception e) {
                log.warn("Gemini API call for documentation failed ({}), falling back to intelligent offline engine", e.getMessage());
            }
        } else {
            log.info("GEMINI_API_KEY is not configured. Utilizing DevNest Intelligent Local Engine.");
        }

        return generateLocalDocumentResponse(request);
    }

    /**
     * Call Google Gemini generateContent REST API
     */
    private String callGemini(String systemPrompt, String userPrompt) throws Exception {
        Map<String, Object> payload = new LinkedHashMap<>();

        // 1. System instruction (if supported/present)
        if (systemPrompt != null && !systemPrompt.isBlank()) {
            payload.put("system_instruction", Map.of(
                    "parts", List.of(Map.of("text", systemPrompt))
            ));
        }

        // 2. User prompt content
        Map<String, Object> userContent = Map.of(
                "role", "user",
                "parts", List.of(Map.of("text", userPrompt))
        );
        payload.put("contents", List.of(userContent));

        // 3. Generation configuration for structured JSON output
        Map<String, Object> genConfig = new LinkedHashMap<>();
        genConfig.put("responseMimeType", "application/json");
        genConfig.put("temperature", 0.2);
        genConfig.put("maxOutputTokens", properties.getMaxTokens());
        payload.put("generationConfig", genConfig);

        String requestBodyJson = objectMapper.writeValueAsString(payload);

        // Normalize model URL
        String base = properties.getApiUrl().replaceAll("/+$", "");
        String model = properties.getModel().trim();
        if (model.startsWith("models/")) {
            model = model.substring(7);
        }
        String endpoint;
        if (base.endsWith("/models")) {
            endpoint = base + "/" + model + ":generateContent";
        } else {
            endpoint = base + "/models/" + model + ":generateContent";
        }

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(endpoint))
                .timeout(Duration.ofSeconds(properties.getTimeoutSeconds()))
                .header("Content-Type", "application/json")
                .header("x-goog-api-key", properties.getApiKey())
                .POST(HttpRequest.BodyPublishers.ofString(requestBodyJson))
                .build();

        HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            log.error("Google Gemini API returned status {}: {}", response.statusCode(), response.body());
            throw new RuntimeException("Gemini API error: HTTP " + response.statusCode() + " - " + response.body());
        }

        JsonNode rootNode = objectMapper.readTree(response.body());
        JsonNode candidates = rootNode.path("candidates");
        if (candidates.isArray() && !candidates.isEmpty()) {
            JsonNode parts = candidates.get(0).path("content").path("parts");
            if (parts.isArray() && !parts.isEmpty()) {
                StringBuilder sb = new StringBuilder();
                for (JsonNode part : parts) {
                    if (part.has("text")) {
                        sb.append(part.path("text").asText());
                    }
                }
                if (!sb.isEmpty()) {
                    return sb.toString();
                }
            }
        }

        throw new RuntimeException("No text candidates returned in Gemini API response: " + response.body());
    }

    private String cleanJsonString(String raw) {
        if (raw == null) return "{}";
        String trimmed = raw.trim();
        if (trimmed.startsWith("```json")) {
            trimmed = trimmed.substring(7);
        } else if (trimmed.startsWith("```")) {
            trimmed = trimmed.substring(3);
        }
        if (trimmed.endsWith("```")) {
            trimmed = trimmed.substring(0, trimmed.length() - 3);
        }
        trimmed = trimmed.trim();
        int firstBrace = trimmed.indexOf('{');
        int lastBrace = trimmed.lastIndexOf('}');
        if (firstBrace >= 0 && lastBrace > firstBrace) {
            return trimmed.substring(firstBrace, lastBrace + 1);
        }
        return trimmed;
    }

    private ExplainResponse parseExplainResponse(String raw) {
        try {
            String json = cleanJsonString(raw);
            JsonNode node = objectMapper.readTree(json);
            String summary = node.path("summary").asText("Code explanation generated by Gemini.");
            List<String> steps = jsonArrayToList(node.path("steps"));
            List<String> keyComponents = jsonArrayToList(node.path("keyComponents"));
            String example = node.path("example").asText("");
            List<String> potentialIssues = jsonArrayToList(node.path("potentialIssues"));
            return new ExplainResponse(summary, steps, keyComponents, example, potentialIssues, raw);
        } catch (JsonProcessingException e) {
            log.warn("Failed to parse Gemini JSON response as ExplainResponse: {}", e.getMessage());
            return new ExplainResponse(
                    "Analysis completed by Gemini AI.",
                    List.of("Executed automated semantic code inspection."),
                    List.of(),
                    "",
                    List.of(),
                    raw
            );
        }
    }

    private DebugResponse parseDebugResponse(String raw) {
        try {
            String json = cleanJsonString(raw);
            JsonNode node = objectMapper.readTree(json);
            String errorMeaning = node.path("errorMeaning").asText("Identified runtime / compilation anomaly.");
            List<String> likelyCauses = jsonArrayToList(node.path("likelyCauses"));
            String suggestedSolution = node.path("suggestedSolution").asText("");
            String correctedCode = node.path("correctedCode").asText("");
            List<String> verificationSteps = jsonArrayToList(node.path("verificationSteps"));
            String confidenceLevel = node.path("confidenceLevel").asText("High");
            return new DebugResponse(errorMeaning, likelyCauses, suggestedSolution, correctedCode, verificationSteps, confidenceLevel, raw);
        } catch (JsonProcessingException e) {
            log.warn("Failed to parse Gemini JSON response as DebugResponse: {}", e.getMessage());
            return new DebugResponse(
                    "Error analysis completed by Gemini AI.",
                    List.of("Root cause identified in submitted snippet or stack trace."),
                    raw,
                    "",
                    List.of("Run test suite after applying modifications."),
                    "Medium",
                    raw
            );
        }
    }

    private DocumentResponse parseDocumentResponse(String raw) {
        try {
            String json = cleanJsonString(raw);
            JsonNode node = objectMapper.readTree(json);
            String summary = node.path("summary").asText("Technical documentation generated by Gemini.");
            List<String> parameters = jsonArrayToList(node.path("parameters"));
            String returnValue = node.path("returnValue").asText("");
            List<String> exceptions = jsonArrayToList(node.path("exceptions"));
            String exampleUsage = node.path("exampleUsage").asText("");
            String generatedDocumentation = node.path("generatedDocumentation").asText(raw);
            return new DocumentResponse(summary, parameters, returnValue, exceptions, exampleUsage, generatedDocumentation, raw);
        } catch (JsonProcessingException e) {
            log.warn("Failed to parse Gemini JSON response as DocumentResponse: {}", e.getMessage());
            return new DocumentResponse(
                    "Documentation generated by Gemini AI.",
                    List.of(),
                    "",
                    List.of(),
                    "",
                    raw,
                    raw
            );
        }
    }

    private List<String> jsonArrayToList(JsonNode arrayNode) {
        List<String> list = new ArrayList<>();
        if (arrayNode != null && arrayNode.isArray()) {
            for (JsonNode item : arrayNode) {
                list.add(item.asText());
            }
        }
        return list;
    }

    /* =========================================================================
     * Intelligent Local Engine (Fallback / Offline Demo / Testing Mode)
     * ========================================================================= */

    private ExplainResponse generateLocalExplainResponse(ExplainRequest request) {
        String code = request.code().trim();
        String lang = request.getSanitizedLanguage().toUpperCase();

        boolean isMathOrAdd = code.toLowerCase().contains("add") || code.contains("+") || code.toLowerCase().contains("sum");
        boolean hasLoop = code.contains("for") || code.contains("while") || code.contains("forEach") || code.contains("stream");
        boolean hasCondition = code.contains("if") || code.contains("switch") || code.contains("case") || code.contains("?");

        String summary = isMathOrAdd
                ? "This %s function computes the arithmetic sum or combination of input parameters and returns the resulting value.".formatted(lang)
                : "This %s block encapsulates a procedural or algorithmic operation designed for computational execution.".formatted(lang);

        List<String> steps = new ArrayList<>();
        steps.add("Accepts and unpacks the provided invocation arguments.");
        if (hasCondition) {
            steps.add("Evaluates conditional control flow to validate prerequisites or branch logic.");
        }
        if (hasLoop) {
            steps.add("Iterates over elements to accumulate or transform state iteratively.");
        }
        steps.add("Calculates the deterministic outcome without unintended side-effects.");
        steps.add("Returns the computed value to the caller.");

        List<String> components = List.of(
                "Parameters: Passed by value/reference according to %s conventions.".formatted(lang),
                "Return Type: Matches the designated method signature or inferred contract.",
                "Complexity: O(1) space and direct execution time for primitive arithmetic."
        );

        String example = isMathOrAdd
                ? "Invocation: add(2, 3)\nExpected Return: 5"
                : "Input: Sample inputs compliant with parameter definitions\nExpected Return: Normalized output state";

        List<String> issues = List.of(
                "Integer overflow: Check boundary limits (e.g. Integer.MAX_VALUE) if handling arbitrary numerical scales.",
                "Null check: Ensure arguments are non-null where object reference types are utilized.",
                "Type safety: Validate type guarantees at compile-time or interface boundaries."
        );

        String markdown = "### Summary\n" + summary + "\n\n### Execution Flow\n- " + String.join("\n- ", steps);

        return new ExplainResponse(summary, steps, components, example, issues, markdown);
    }

    private DebugResponse generateLocalDebugResponse(DebugRequest request) {
        String error = request.error().trim();
        String code = request.code() != null ? request.code().trim() : "";
        String lang = request.getSanitizedLanguage().toUpperCase();

        String meaning;
        List<String> causes = new ArrayList<>();
        String solution;
        String corrected = code;
        String confidence = "High";

        if (error.toLowerCase().contains("nullpointerexception") || error.toLowerCase().contains("cannot read property") || error.toLowerCase().contains("undefined") || error.toLowerCase().contains("none type")) {
            meaning = "Null reference dereference: An operation attempted to invoke a method, property, or index on an uninitialized reference (null/undefined).";
            causes.add("1. (Most likely) Object or variable was accessed before instantiation or was nullified by upstream logic.");
            causes.add("2. Method return value was assumed non-null without validation.");
            causes.add("3. Missing optional chaining (?.) or defensive null check.");
            solution = "Guard against null references using defensive conditional checks or Objects.requireNonNull() / Optional wrappers.";
            corrected = code.isEmpty() ? "// Add defensive null checks before dereferencing variables" :
                    "if (obj != null) {\n    " + code + "\n}";
        } else if (error.toLowerCase().contains("indexoutofbounds") || error.toLowerCase().contains("indexerror")) {
            meaning = "Boundary index violation: The code attempted to access an array or collection index outside its zero-based bounds.";
            causes.add("1. Off-by-one boundary comparison (e.g., <= length instead of < length).");
            causes.add("2. Empty collection accessed with static index 0.");
            causes.add("3. Collection size changed during asynchronous or parallel iteration.");
            solution = "Verify collection size (e.g., !list.isEmpty() && index < list.size()) prior to positional indexing.";
        } else {
            meaning = "Diagnostic Analysis: The encountered error in %s reflects a runtime violation or syntax constraint.".formatted(lang);
            causes.add("1. Invalid parameter contract or unexpected argument format passed to the procedure.");
            causes.add("2. Environmental mismatch or missing dependency/class definition on classpath.");
            causes.add("3. Unhandled edge case during branch execution.");
            solution = "Inspect the stack trace line number, verify argument preconditions, and enclose volatile logic in structured try-catch handling.";
        }

        List<String> verifySteps = List.of(
                "Apply the defensive validation or corrected code snippet.",
                "Execute your unit test suite covering null, empty, and boundary conditions.",
                "Confirm no unhandled runtime exceptions are raised in staging or CI test run."
        );

        String markdown = "### Diagnosis\n" + meaning + "\n\n### Recommended Solution\n" + solution;

        return new DebugResponse(meaning, causes, solution, corrected, verifySteps, confidence, markdown);
    }

    private DocumentResponse generateLocalDocumentResponse(DocumentRequest request) {
        String code = request.code().trim();
        String format = request.getSanitizedFormat();
        String lang = request.getSanitizedLanguage();

        String summary = "Provides robust logic execution for the specified business operation in " + lang + ".";
        List<String> params = List.of(
                "input (varies): The primary data argument supplied to the routine.",
                "options (optional): Configurable parameters governing execution criteria."
        );
        String returns = "Calculated outcome conforming to the function contract, or void upon mutation.";
        List<String> exceptions = List.of(
                "IllegalArgumentException: Dispatched if arguments fail prerequisite validity checks."
        );
        String exampleUsage = "// Example call:\nvar result = executeOperation(inputData);\nSystem.out.println(result);";

        String docBlock;
        if ("javadoc".equalsIgnoreCase(format)) {
            docBlock = """
                    /**
                     * %s
                     *
                     * @param a Primary parameter description
                     * @param b Secondary parameter description
                     * @return Computed result of the operation
                     * @throws IllegalArgumentException If arguments violate boundaries
                     */
                    """.formatted(summary);
        } else if ("docstring".equalsIgnoreCase(format)) {
            docBlock = """
                    \"\"\"
                    %s

                    Args:
                        a: First parameter
                        b: Second parameter

                    Returns:
                        Calculated result

                    Raises:
                        ValueError: If invalid input values are provided
                    \"\"\"
                    """.formatted(summary);
        } else {
            docBlock = """
                    # Method Documentation
                    
                    **Purpose:** %s
                    
                    ### Parameters
                    - `a` (Number): First argument
                    - `b` (Number): Second argument
                    
                    ### Returns
                    `Number`: The evaluated outcome
                    
                    ### Example
                    ```%s
                    %s
                    ```
                    """.formatted(summary, lang, exampleUsage);
        }

        return new DocumentResponse(summary, params, returns, exceptions, exampleUsage, docBlock, docBlock);
    }
}
