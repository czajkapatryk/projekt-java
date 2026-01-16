package com.taskflow.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    public String generateToken(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return generateToken(userDetails.getUsername());
    }

    public String generateToken(String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .subject(email)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public Long getExpirationTime() {
        return jwtExpiration / 1000;
    }

    private SecretKey getSigningKey() {
        try {
            byte[] keyBytes;
            if (jwtSecret.length() >= 32 && jwtSecret.length() <= 64 && !jwtSecret.contains("=")) {
                keyBytes = jwtSecret.getBytes();
            } else {
                keyBytes = Decoders.BASE64.decode(jwtSecret);
            }
            if (keyBytes.length < 32) {
                throw new IllegalArgumentException("JWT secret must be at least 32 bytes long");
            }
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid JWT secret format. Use either a Base64-encoded string or a plain string (min 32 chars)", e);
        }
    }
}
