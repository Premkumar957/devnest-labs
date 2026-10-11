package com.devnest.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(
    boolean success,
    String feature,
    T result,
    String message,
    String error,
    long timestamp
) {
    public static <T> ApiResponse<T> success(String feature, T result) {
        return new ApiResponse<>(true, feature, result, null, null, System.currentTimeMillis());
    }

    public static <T> ApiResponse<T> success(String feature, T result, String message) {
        return new ApiResponse<>(true, feature, result, message, null, System.currentTimeMillis());
    }

    public static <T> ApiResponse<T> error(String feature, String error) {
        return new ApiResponse<>(false, feature, null, null, error, System.currentTimeMillis());
    }
}
