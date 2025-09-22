package com.web.study.party.dto.user;

import com.web.study.party.entities.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;

    private String email;

    private String avatarUrl;
    private String bannerUrl;
    private String displayName;
    private String bio;
    private String phoneNumber;
    private Instant dateOfBirth;

    private boolean online;
    private boolean verified;
    private boolean locked;

    @Enumerated(EnumType.STRING)
    private Role role;

}
