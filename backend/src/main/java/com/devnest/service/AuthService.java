package com.devnest.service;

import com.devnest.dto.AuthResponse;
import com.devnest.dto.LoginRequest;
import com.devnest.dto.SignupRequest;
import com.devnest.dto.UserDto;
import com.devnest.entity.User;
import com.devnest.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        String cleanEmail = request.email().trim().toLowerCase();
        String cleanName = request.name().trim();

        if (userRepository.existsByEmailIgnoreCase(cleanEmail)) {
            throw new IllegalArgumentException("An account with email '" + cleanEmail + "' already exists");
        }

        String hashedPassword = passwordEncoder.encode(request.password());
        User user = new User(cleanName, cleanEmail, hashedPassword);
        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getName());
        UserDto userDto = new UserDto(savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getCreatedAt());

        return new AuthResponse(token, userDto);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String cleanEmail = request.email().trim().toLowerCase();

        User user = userRepository.findByEmailIgnoreCase(cleanEmail)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getName());
        UserDto userDto = new UserDto(user.getId(), user.getName(), user.getEmail(), user.getCreatedAt());

        return new AuthResponse(token, userDto);
    }

    @Transactional(readOnly = true)
    public UserDto getMe(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Missing or malformed Authorization header");
        }

        String token = authHeader.substring(7).trim();
        if (!jwtService.validateToken(token)) {
            throw new IllegalArgumentException("Session token has expired or is invalid. Please sign in again.");
        }

        String email = jwtService.extractEmail(token);
        if (email == null) {
            throw new IllegalArgumentException("Invalid token claims");
        }

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("User account not found"));

        return new UserDto(user.getId(), user.getName(), user.getEmail(), user.getCreatedAt());
    }
}
