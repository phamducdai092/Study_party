package com.web.repositories.group.member;

import com.web.entities.enums.group.MemberState;
import com.web.entities.group.GroupMembers;
import com.web.entities.group.StudyGroups;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupMemberRepo extends JpaRepository<GroupMembers, Long>, JpaSpecificationExecutor<GroupMembers> {

    boolean existsByGroupIdAndUserId(Long groupId, Long userId);

    Optional<GroupMembers> findByGroupIdAndUserId(Long gid, Long uid);

    int countByGroupIdAndState(Long gid, MemberState state);

    Optional<GroupMembers> findByGroupAndUserId(StudyGroups group, Long userId);

    List<GroupMembers> findByGroupIdAndState(Long gid, MemberState state);

    List<GroupMembers> findAllByGroupId(Long groupId);

    long countByGroupIdAndUserIdIn(Long groupId, List<Long> userIds);

}