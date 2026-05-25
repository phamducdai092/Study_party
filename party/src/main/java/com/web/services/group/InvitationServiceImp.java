package com.web.services.group;

import com.web.dto.mapper.group.InvitationMapper;
import com.web.dto.response.group.InvitationResponse;
import com.web.entities.Users;
import com.web.entities.enums.group.MemberRole;
import com.web.entities.enums.group.RequestStatus;
import com.web.entities.group.GroupInvite;
import com.web.entities.group.StudyGroups;
import com.web.exception.BadRequestException;
import com.web.exception.ResourceNotFoundException;
import com.web.repositories.user.UserRepo;
import com.web.repositories.group.invite.GroupInviteRepo;
import com.web.repositories.group.member.GroupMemberRepo;
import com.web.repositories.group.GroupRepo;
import com.web.repositories.group.invite.GroupInviteSpecs;
import com.web.services.mail.MailService;
import com.web.services.notification.NotificationService;
import com.web.utils.socket.SocketConst;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InvitationServiceImp implements InvitationService {

    private final GroupInviteRepo groupInviteRepo;
    private final UserRepo userRepo;
    private final GroupRepo groupRepo;
    private final GroupMemberRepo groupMemberRepo;
    private final GroupMemberService groupMemberService;
    private final InvitationMapper invitationMapper;
    private final MailService mailService;

    // 2. Inject NotificationService
    private final NotificationService notificationService;

    @Value("${app.base-url.frontend}")
    private String frontendBaseUrl;

    @Override
    @Transactional
    public void createInvitation(String slug, Long inviterId, String inviteeEmail) {
        // ... (Giữ nguyên logic kiểm tra group, user, quyền hạn) ...
        StudyGroups group = groupRepo.findStudyGroupBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhóm với ID: " + slug));

        Users inviter = userRepo.findById(inviterId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng (người mời) với ID: " + inviterId));

        Users invitee = userRepo.findByEmail(inviteeEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng được mời với email: " + inviteeEmail));

        // ... (Giữ nguyên logic check permission & exist) ...
        boolean hasPermission = group.getOwner().getId().equals(inviterId) ||
                                groupMemberRepo.findByGroupAndUserId(group, inviterId)
                                        .map(member -> member.getRole() == MemberRole.MOD || member.getRole() == MemberRole.OWNER)
                                        .orElse(false);

        if (!hasPermission) {
            throw new AccessDeniedException("Bạn không có quyền mời thành viên vào nhóm này.");
        }

        if (groupMemberRepo.existsByGroupIdAndUserId(group.getId(), invitee.getId())) {
            throw new BadRequestException("Người dùng này đã là thành viên của nhóm.");
        }
        if (groupInviteRepo.existsByGroupAndInviteeAndStatus(group, invitee, RequestStatus.PENDING)) {
            throw new BadRequestException("Bạn đã mời người dùng này vào nhóm rồi, vui lòng đợi họ phản hồi.");
        }

        // Tạo lời mời
        String token = UUID.randomUUID().toString();
        GroupInvite invitation = GroupInvite.builder()
                .group(group)
                .inviter(inviter)
                .invitee(invitee)
                .token(token)
                .status(RequestStatus.PENDING)
                .expiresAt(Instant.now().plus(7, ChronoUnit.DAYS))
                .build();

        groupInviteRepo.save(invitation);

        // Gửi email (Giữ nguyên)
        String invitationLink = frontendBaseUrl + "/invites/" + invitation.getToken();
        mailService.sendInvitation(inviteeEmail, inviter.getDisplayName(), group.getName(), invitationLink);

        // 👇 3. Gửi Thông báo Realtime cho người được mời (Invitee)
        String notifContent = String.format("%s đã mời bạn tham gia nhóm '%s'", inviter.getDisplayName(), group.getName());
        // Link dẫn đến trang danh sách lời mời của User
        String notifLink = "/notifications";

        notificationService.sendNotification(
                invitee,
                notifContent,
                notifLink,
                SocketConst.EVENT_INVITATION_RECEIVED
        );
    }

    @Override
    @Transactional
    public void acceptInvitation(String token, Long userId) {
        // ... (Giữ nguyên logic validate token) ...
        GroupInvite invite = groupInviteRepo.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Lời mời không hợp lệ hoặc đã bị xóa."));

        if (invite.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException("Lời mời này đã được xử lý trước đó.");
        }
        if (invite.getExpiresAt() != null && invite.getExpiresAt().isBefore(Instant.now())) {
            invite.setStatus(RequestStatus.EXPIRED);
            groupInviteRepo.save(invite);
            throw new BadRequestException("Lời mời này đã hết hạn.");
        }
        if (!invite.getInvitee().getId().equals(userId)) {
            throw new AccessDeniedException("Bạn không phải là người nhận được lời mời này.");
        }

        // Thêm thành viên
        groupMemberService.addMember(invite.getGroup().getId(), invite.getInvitee().getId());

        // Cập nhật trạng thái
        invite.setStatus(RequestStatus.ACCEPTED);
        groupInviteRepo.save(invite);

        // 👇 4. Gửi Thông báo Realtime cho người mời (Inviter)
        Users invitee = invite.getInvitee();
        Users inviter = invite.getInviter();
        StudyGroups group = invite.getGroup();

        String notifContent = String.format("%s đã chấp nhận lời mời tham gia nhóm '%s'", invitee.getDisplayName(), group.getName());
        String notifLink = "/rooms/" + group.getSlug(); // Bấm vào là về lại nhóm

        notificationService.sendNotification(
                inviter,
                notifContent,
                notifLink,
                SocketConst.EVENT_INVITATION_ACCEPTED
        );
    }

    @Override
    @Transactional
    public void declineInvitation(String token) {
        // ... (Logic cũ) ...
        GroupInvite invite = groupInviteRepo.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Lời mời không hợp lệ hoặc đã bị xóa."));

        if (invite.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException("Lời mời này đã được xử lý trước đó.");
        }

        invite.setStatus(RequestStatus.DECLINED);
        groupInviteRepo.save(invite);

        // 👇 5. (Optional) Gửi thông báo cho người mời biết là bị từ chối
        Users invitee = invite.getInvitee();
        Users inviter = invite.getInviter();
        StudyGroups group = invite.getGroup();

        String notifContent = String.format("%s đã từ chối lời mời tham gia nhóm '%s'", invitee.getDisplayName(), group.getName());

        notificationService.sendNotification(
                inviter,
                notifContent,
                "", // Không cần link cụ thể
                SocketConst.EVENT_INVITATION_DECLINED
        );
    }

    // ... (Các hàm revoke, getPendingInvitations giữ nguyên) ...
    @Override
    @Transactional
    public void revokeInvitation(Long invitationId, Long ownerId) {
        // Code cũ giữ nguyên
        GroupInvite invite = groupInviteRepo.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lời mời với ID: " + invitationId));

        boolean hasPermission = invite.getInviter().getId().equals(ownerId) ||
                                invite.getGroup().getOwner().getId().equals(ownerId) ||
                                groupMemberRepo.findByGroupAndUserId(invite.getGroup(), ownerId)
                                        .map(member -> member.getRole() == MemberRole.MOD)
                                        .orElse(false);

        if (!hasPermission) {
            throw new AccessDeniedException("Bạn không có quyền thu hồi lời mời này.");
        }

        if (invite.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException("Chỉ có thể thu hồi lời mời đang chờ.");
        }
        invite.setStatus(RequestStatus.CANCELED);
        groupInviteRepo.save(invite);
    }

    @Override
    public Page<InvitationResponse> getPendingInvitationsForGroup(String slug, Long ownerId, RequestStatus status, String keyword, Pageable pageable) {
        // Code cũ giữ nguyên
        StudyGroups group = groupRepo.findStudyGroupBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhóm với ID: " + slug));

        boolean hasPermission = group.getOwner().getId().equals(ownerId) ||
                                groupMemberRepo.findByGroupAndUserId(group, ownerId)
                                        .map(member -> member.getRole() == MemberRole.MOD)
                                        .orElse(false);

        if (!hasPermission) {
            throw new AccessDeniedException("Bạn không có quyền xem danh sách lời mời của nhóm này.");
        }

        Specification<GroupInvite> spec = Specification.allOf(
                GroupInviteSpecs.hasGroupId(group.getId()),
                GroupInviteSpecs.hasStatus(status),
                GroupInviteSpecs.searchForGroup(keyword)
        );

        return groupInviteRepo.findAll(spec, pageable)
                .map(invitationMapper::toResponse);
    }

    @Override
    public Page<InvitationResponse> getPendingInvitationsForUser(
            @AuthenticationPrincipal(expression = "user") Users invitee,
            RequestStatus status, String keyword, Pageable pageable
    ) {

        Specification<GroupInvite> spec = Specification.allOf(
                GroupInviteSpecs.hasInviteeId(invitee.getId()),
                GroupInviteSpecs.hasStatus(status),
                GroupInviteSpecs.searchForUser(keyword)
        );

        return groupInviteRepo.findAll(spec, pageable)
                .map(invitationMapper::toResponse);
    }
}