package com.neo4flix.authservice.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.expiration}")
    private long jwtExpirationMs;
    
    public String generateToken(String username, Long userId) {
        return Jwts.builder()
                .setSubject(username)
                .claim("userId", userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), SignatureAlgorithm.HS512.getJcaName()), SignatureAlgorithm.HS512)
                .compact();
    }
    
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }
    
    public Long extractUserId(String token) {
        return getClaims(token).get("userId", Long.class);
    }
    
    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), SignatureAlgorithm.HS512.getJcaName()))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}


