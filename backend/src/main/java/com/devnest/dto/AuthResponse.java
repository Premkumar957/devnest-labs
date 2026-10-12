package com.devnest.dto;

public record AuthResponse(
    String token,
    UserDto user
) {}
