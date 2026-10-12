package com.devnest.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);
    private static final String HMAC_SHA256 = "HmacSHA256";

    private final String secretKey;
    private final ObjectMapper objectMapper;

    public JwtService(
            @Value("${devnest.jwt.secret:devnest-labs-super-secure-jwt-secret-token-key-2026-sqlite-mysql}") String secretKey,
            ObjectMapper objectMapper
    ) {
        this.secretKey = secretKey;
        this.objectMapper = objectMapper;
    }

    public String generateToken(Long userId, String email, String name) {
        try {
            Map<String, Object> header = Map.of(
                    "alg", "HS256",
                    "typ", "JWT"
            );

            Instant now = Instant.now();
            Instant expiry = now.plus(7, ChronoUnit.DAYS);

            Map<String, Object> claims = new LinkedHashMap<>();
            claims.put("sub", email);
            claims.put("userId", userId);
            claims.put("name", name);
            claims.put("iat", now.getEpochSecond());
            claims.put("exp", expiry.getEpochSecond());

            String headerEncoded = base64UrlEncode(objectMapper.writeValueAsBytes(header));
            String claimsEncoded = base64UrlEncode(objectMapper.writeValueAsBytes(claims));
            String dataToSign = headerEncoded + "." + claimsEncoded;

            String signature = sign(dataToSign);

            return dataToSign + "." + signature;
        } catch (Exception e) {
            log.error("Failed to generate JWT token: {}", e.getMessage(), e);
            throw new RuntimeException("Could not generate authentication token");
        }
    }

    public boolean validateToken(String token) {
        try {
            if (token == null || token.isBlank()) return false;
            String[] parts = token.split("\\.");
            if (parts.length != 3) return false;

            String dataToSign = parts[0] + "." + parts[1];
            String expectedSignature = sign(dataToSign);

            if (!MessageDigest.isEqual(parts[2].getBytes(StandardCharsets.UTF_8), expectedSignature.getBytes(StandardCharsets.UTF_8))) {
                return false;
            }

            byte[] claimsBytes = base64UrlDecode(parts[1]);
            JsonNode claimsNode = objectMapper.readTree(claimsBytes);
            long exp = claimsNode.path("exp").asLong(0);

            return exp > Instant.now().getEpochSecond();
        } catch (Exception e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    public String extractEmail(String token) {
        try {
            JsonNode claims = getClaims(token);
            return claims != null ? claims.path("sub").asText(null) : null;
        } catch (Exception e) {
            return null;
        }
    }

    public Long extractUserId(String token) {
        try {
            JsonNode claims = getClaims(token);
            if (claims != null && claims.has("userId")) {
                return claims.path("userId").asLong();
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    private JsonNode getClaims(String token) throws Exception {
        if (!validateToken(token)) return null;
        String[] parts = token.split("\\.");
        byte[] claimsBytes = base64UrlDecode(parts[1]);
        return objectMapper.readTree(claimsBytes);
    }

    private String sign(String data) throws Exception {
        Mac mac = Mac.getInstance(HMAC_SHA256);
        SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), HMAC_SHA256);
        mac.init(secretKeySpec);
        byte[] signedBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return base64UrlEncode(signedBytes);
    }

    private String base64UrlEncode(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private byte[] base64UrlDecode(String str) {
        return Base64.getUrlDecoder().decode(str);
    }
}
