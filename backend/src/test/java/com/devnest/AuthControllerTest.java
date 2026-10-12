package com.devnest;

import com.devnest.dto.LoginRequest;
import com.devnest.dto.SignupRequest;
import com.devnest.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("POST /api/v1/auth/signup should register user and return token")
    void testSignupSuccess() throws Exception {
        SignupRequest request = new SignupRequest("Jane Doe", "jane@example.com", "secret123");

        mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.result.token").isNotEmpty())
                .andExpect(jsonPath("$.result.user.name").value("Jane Doe"))
                .andExpect(jsonPath("$.result.user.email").value("jane@example.com"));
    }

    @Test
    @DisplayName("POST /api/v1/auth/signup with duplicate email should return 400 Bad Request")
    void testSignupDuplicateEmail() throws Exception {
        SignupRequest request = new SignupRequest("Jane Doe", "jane@example.com", "secret123");

        // First signup
        mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Duplicate signup
        mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error").value("An account with email 'jane@example.com' already exists"));
    }

    @Test
    @DisplayName("POST /api/v1/auth/login should authenticate and return token")
    void testLoginSuccess() throws Exception {
        // Register first
        SignupRequest signup = new SignupRequest("John Coder", "john@example.com", "mypassword123");
        mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signup)))
                .andExpect(status().isCreated());

        // Login
        LoginRequest login = new LoginRequest("john@example.com", "mypassword123");
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.result.token").isNotEmpty())
                .andExpect(jsonPath("$.result.user.email").value("john@example.com"));
    }

    @Test
    @DisplayName("POST /api/v1/auth/login with wrong password should return 400")
    void testLoginWrongPassword() throws Exception {
        SignupRequest signup = new SignupRequest("John Coder", "john@example.com", "mypassword123");
        mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signup)))
                .andExpect(status().isCreated());

        LoginRequest login = new LoginRequest("john@example.com", "wrongpass");
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("GET /api/v1/auth/me should return current user with valid Bearer token")
    void testGetMe() throws Exception {
        SignupRequest signup = new SignupRequest("Alice Tech", "alice@example.com", "strongpass123");
        MvcResult result = mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signup)))
                .andExpect(status().isCreated())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        String token = objectMapper.readTree(responseBody).path("result").path("token").asText();

        mockMvc.perform(get("/api/v1/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.result.name").value("Alice Tech"))
                .andExpect(jsonPath("$.result.email").value("alice@example.com"));
    }
}
