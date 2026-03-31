package com.neo4flix.authservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email"),
        @UniqueConstraint(columnNames = "username")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false, unique = true)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private Long createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = System.currentTimeMillis();
    }
}

