package com.neo4flix.authservice.service;

import com.neo4flix.authservice.dto.AuthResponse;
import com.neo4flix.authservice.dto.LoginRequest;
import com.neo4flix.authservice.dto.RegisterRequest;
import com.neo4flix.authservice.entity.User;
import com.neo4flix.authservice.repository.UserRepository;
import com.neo4flix.authservice.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    public AuthResponse register(RegisterRequest request) {
        try {
            // Vérifier si l'email existe déjà
            if (userRepository.existsByEmail(request.getEmail())) {
                log.warn("Registration failed: Email already exists: {}", request.getEmail());
                return AuthResponse.builder()
                        .message("Email already registered")
                        .build();
            }
            
            // Vérifier si l'username existe déjà
            if (userRepository.existsByUsername(request.getUsername())) {
                log.warn("Registration failed: Username already exists: {}", request.getUsername());
                return AuthResponse.builder()
                        .message("Username already taken")
                        .build();
            }
            
            // Créer le nouvel utilisateur
            User user = User.builder()
                    .email(request.getEmail())
                    .username(request.getUsername())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .build();
            
            User savedUser = userRepository.save(user);
            log.info("User registered successfully: {}", savedUser.getUsername());
            
            // Générer le JWT
            String token = jwtUtil.generateToken(savedUser.getUsername(), savedUser.getId());
            
            return AuthResponse.builder()
                    .token(token)
                    .username(savedUser.getUsername())
                    .email(savedUser.getEmail())
                    .message("Registration successful")
                    .build();
        } catch (Exception e) {
            log.error("Registration error: ", e);
            return AuthResponse.builder()
                    .message("Registration failed: " + e.getMessage())
                    .build();
        }
    }
    
    public AuthResponse login(LoginRequest request) {
        // Rechercher l'utilisateur par email ou username
        var user = userRepository.findByEmail(request.getEmailOrUsername())
                .or(() -> userRepository.findByUsername(request.getEmailOrUsername()));
        
        if (user.isEmpty()) {
            log.warn("Login failed: User not found: {}", request.getEmailOrUsername());
            return AuthResponse.builder()
                    .message("Invalid email/username or password")
                    .build();
        }
        
        // Vérifier le mot de passe
        User foundUser = user.get();
        if (!passwordEncoder.matches(request.getPassword(), foundUser.getPassword())) {
            log.warn("Login failed: Invalid password for user: {}", foundUser.getUsername());
            return AuthResponse.builder()
                    .message("Invalid email/username or password")
                    .build();
        }
        
        // Générer le JWT
        String token = jwtUtil.generateToken(foundUser.getUsername(), foundUser.getId());
        log.info("User logged in successfully: {}", foundUser.getUsername());
        
        return AuthResponse.builder()
                .token(token)
                .username(foundUser.getUsername())
                .email(foundUser.getEmail())
                .message("Login successful")
                .build();
    }
}


