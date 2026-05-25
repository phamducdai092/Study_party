package com.web.entities.group;

import com.web.entities.Users;
import com.web.entities.enums.group.RequestStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "join_group_requests")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JoinGroupRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private StudyGroups group;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(length = 50)
    private RequestStatus status = RequestStatus.PENDING;

    @Builder.Default
    private Instant createdAt = Instant.now();
    private Instant resolvedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolved_by")
    private Users resolver;
}
