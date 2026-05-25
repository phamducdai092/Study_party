package com.web.repositories.group.joinRequest;

import com.web.entities.Users;
import com.web.entities.enums.group.RequestStatus;
import com.web.entities.group.JoinGroupRequest;
import com.web.entities.group.StudyGroups;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JoinGroupRequestRepo extends JpaRepository<JoinGroupRequest, Long>, JpaSpecificationExecutor<JoinGroupRequest> {

    Optional<JoinGroupRequest> findByGroupAndUserAndStatus(StudyGroups group, Users user, RequestStatus status);

    boolean existsByGroupAndUserAndStatus(StudyGroups group, Users user, RequestStatus status);
}
