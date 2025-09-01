package com.web.study.party.entities;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
public class RefreshToken {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="user_id")
    private Users user;

    @Column(unique=true, nullable=false)
    private String token;

    private Instant expiresAt;
    private boolean revoked = false;
    private Instant createdAt = Instant.now();
}
