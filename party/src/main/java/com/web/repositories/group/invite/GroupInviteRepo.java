package com.web.repositories.group.invite;

import com.web.entities.Users;
import com.web.entities.enums.group.RequestStatus;
import com.web.entities.group.GroupInvite;
import com.web.entities.group.StudyGroups;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GroupInviteRepo extends JpaRepository<GroupInvite, Long>, JpaSpecificationExecutor<GroupInvite> {

    Optional<GroupInvite> findByToken(String token);

    boolean existsByGroupAndInviteeAndStatus(StudyGroups group, Users invitee, RequestStatus status);

}