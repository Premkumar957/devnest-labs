package com.devnest.controller;

import com.devnest.dto.ApiResponse;
import com.devnest.dto.AuthResponse;
import com.devnest.dto.LoginRequest;
import com.devnest.dto.SignupRequest;
import com.devnest.dto.UserDto;
import com.devnest.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(@Valid @RequestBody SignupRequest request) {
        AuthResponse response = authService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("auth", response, "Account created successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("auth", response, "Signed in successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getMe(
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        UserDto userDto = authService.getMe(authHeader);
        return ResponseEntity.ok(ApiResponse.success("auth", userDto, "User profile retrieved"));
    }
}
