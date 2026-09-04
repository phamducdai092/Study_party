package com.web.services.task;

import com.web.dto.mapper.group.task.AttachmentMapper;
import com.web.dto.mapper.group.task.TaskMapper;
import com.web.dto.mapper.user.UserMapper;
import com.web.dto.request.group.task.CreateTaskRequest;
import com.web.dto.request.group.task.ReviewSubmissionRequest;
import com.web.dto.request.group.task.SubmitTaskRequest;
import com.web.dto.request.group.task.UpdateTaskRequest;
import com.web.dto.response.group.task.*;
import com.web.entities.Users;
import com.web.entities.enums.task.TaskStatus;
import com.web.entities.group.StudyGroups;
import com.web.entities.task.Task;
import com.web.entities.task.TaskAssignment;
import com.web.entities.task.TaskSubmission;
import com.web.exception.BusinessException;
import com.web.exception.ResourceNotFoundException;
import com.web.repositories.group.member.GroupMemberRepo;
import com.web.repositories.group.GroupRepo;
import com.web.repositories.task.TaskSpecs;
import com.web.repositories.task.assignment.TaskAssignmentRepository;
import com.web.repositories.task.TaskRepository;
import com.web.repositories.task.submission.TaskSubmissionRepository;
import com.web.repositories.task.submission.TaskSubmissionSpecs;
import com.web.repositories.user.UserRepo;
import com.web.services.attachment.AttachmentService;
import com.web.services.notification.NotificationService;
import com.web.utils.socket.SocketConst;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class TaskServiceImpl implements TaskService {

    // --- REPOSITORIES ---
    private final TaskRepository taskRepo;
    private final TaskAssignmentRepository assignmentRepo;
    private final TaskSubmissionRepository submissionRepo;
    private final UserRepo userRepo;
    private final GroupMemberRepo groupMemberRepo;

    // --- SERVICES & MAPPERS ---
    private final AttachmentService attachmentService;
    private final NotificationService notificationService;
    private final TaskMapper taskMapper;
    private final UserMapper userMapper;
    private final AttachmentMapper attachmentMapper;
    // --- CONSTANTS ---
    private static final int MAX_ASSIGNEES = 5;
    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    //    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("doc", "docx", "xls", "xlsx", "txt", "pdf", "zip", "rar");
    private final GroupRepo groupRepo;

    // ================= 1. CREATE TASK =================
    @Override
    public TaskResponse createTask(Long groupId, CreateTaskRequest request, List<MultipartFile> files, Long creatorId) {
        // 1. Validate Files trước
        validateFiles(files);

        // 2. Map Request -> Entity
        Task task = new Task();
        task.setGroupId(groupId);
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setDeadline(request.deadline());
        task.setSubmissionType(request.submissionType());
        task.setCreatedBy(creatorId);

        task = taskRepo.save(task);

        // 3. Save Attachments
        Users creator = userRepo.findById(creatorId).orElse(null);
        attachmentService.saveAttachments(files, task, null, creator);

        // 4. Assign Users
        List<Long> assigneeIds = request.assigneeIds();

        // 👇 FIX LOGIC: Nếu list rỗng hoặc null -> Hiểu là "Assign All" -> Lấy hết member ID
        if (assigneeIds == null || assigneeIds.isEmpty()) {
            assigneeIds = getAllGroupMemberIds(groupId);
        } else {
            // Nếu có list cụ thể thì validate xem có đúng người trong nhóm ko
            validateAssignees(assigneeIds, groupId);
        }

        if (!assigneeIds.isEmpty()) {
            assignUsersToTaskInternal(task, assigneeIds);
            sendTaskNotification(task, assigneeIds, SocketConst.NOTIFICATION_TYPE_TASK_ASSIGNED);
        }

        return taskMapper.toResponse(task);
    }

    // ================= 2. UPDATE TASK =================
    @Override
    public TaskResponse updateTask(Long taskId, Long groupId, UpdateTaskRequest request, List<MultipartFile> files, Long updaterId) {
        Task task = getTaskOrThrow(taskId, groupId);

        // ... Logic update text fields (Giữ nguyên) ...
        if (request.title() != null) task.setTitle(request.title());
        if (request.description() != null) task.setDescription(request.description());
        if (request.submissionType() != null) task.setSubmissionType(request.submissionType());
        if (request.deadline() != null) {
            if (request.deadline().isBefore(Instant.now())) {
                throw new BusinessException("Deadline phải ở tương lai");
            }
            task.setDeadline(request.deadline());
        }

        task = taskRepo.save(task);

        // ... Logic update files (Giữ nguyên) ...
        if (files != null && !files.isEmpty()) {
            validateFiles(files);
            Users updater = userRepo.findById(updaterId).orElse(null);
            attachmentService.saveAttachments(files, task, null, updater);
        }

        // 3. Update Assignees
        List<Long> newAssigneeIds = request.assigneeIds();
        if (newAssigneeIds != null) {
            // 👇 FIX LOGIC: Nếu gửi mảng rỗng [] -> Hiểu là "Assign All" lại từ đầu
            // (Trường hợp muốn xóa hết người thì phải xóa Task, chứ không ai update task để không giao cho ai cả)
            if (newAssigneeIds.isEmpty()) {
                newAssigneeIds = getAllGroupMemberIds(groupId);
            } else {
                validateAssignees(newAssigneeIds, groupId);
            }
            updateTaskAssignees(task, newAssigneeIds);
        }

        return taskMapper.toResponse(task);
    }

    // ================= 3. SUBMIT TASK =================
    @Override
    public SubmissionResponse submitTask(Long taskId, Long groupId, Long userId, SubmitTaskRequest request, List<MultipartFile> files) {
        Task task = getTaskOrThrow(taskId, groupId);

        TaskSubmission submission = submissionRepo.findByTaskIdAndUserId(taskId, userId)
                .orElseThrow(() -> new BusinessException("Bạn không được giao bài tập này"));

        if (submission.getStatus() == TaskStatus.APPROVED) {
            throw new BusinessException("Bài tập đã duyệt, không thể nộp lại");
        }

        validateFiles(files);

        // Xóa file cũ nếu nộp lại (Clean attachment cũ)
//        attachmentRepo.deleteBySubmissionId(submission.getId());

        // Update Submission Info
        submission.setSubmissionText(request.submissionText());
        submission.setStatus(TaskStatus.SUBMITTED);
        submission.setSubmittedAt(Instant.now());
        submission.setVersion(submission.getVersion() + 1);

        submission = submissionRepo.save(submission);

        boolean isLate = task.getDeadline() != null && Instant.now().isAfter(task.getDeadline());
        submission.setLate(isLate);

        // Save New Attachments (Submission Files)
        Users submitter = userRepo.findById(userId).orElse(null);
        attachmentService.saveAttachments(files, null, submission, submitter);

        return taskMapper.toSubmissionResponse(submission);
    }

    // ================= 4. REVIEW SUBMISSION =================
    @Override
    public SubmissionResponse reviewSubmission(Long submissionId, Long taskId, ReviewSubmissionRequest request, Long reviewerId) {
        TaskSubmission submission = submissionRepo.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));

        if (!submission.getTask().getId().equals(taskId)) {
            throw new BusinessException("Mismatch Task ID");
        }

        // Update Status & Grade
        submission.setStatus(request.status());
        submission.setReviewNotes(request.reviewNotes());
        submission.setGrade(request.grade());
        submission.setReviewedBy(reviewerId);
        submission.setReviewedAt(Instant.now());

        submission = submissionRepo.save(submission);

        // Notification logic
        String notifType = request.status() == TaskStatus.REQUEST_CHANGE
                ? SocketConst.NOTIFICATION_TYPE_TASK_RETURNED
                : "TASK_APPROVED"; // Tự define thêm nếu muốn

        // Gửi thông báo cho học sinh
        Users student = userRepo.findById(submission.getUserId()).orElse(null);
        if (student != null) {
            String content = "Bài tập [" + submission.getTask().getTitle() + "] đã được cập nhật trạng thái: " + request.status().getLabel();
            String link = "/groups/" + submission.getTask().getGroupId() + "/tasks/" + taskId;
            notificationService.sendNotification(student, content, link, notifType);
        }

        return taskMapper.toSubmissionResponse(submission);
    }

    // ================= 5. GET DETAILS & LISTS =================
    @Override
    public TaskDetailResponse getTaskDetails(Long taskId, Long groupId, Long userId) {
        Task task = getTaskOrThrow(taskId, groupId);

        // Dùng Mapper map các field cơ bản
        TaskDetailResponse response = taskMapper.toDetailResponse(task);

        // Fill các field tính toán (Mapper khó làm hoặc ko làm dc)
        TaskSubmission mySub = submissionRepo.findByTaskIdAndUserId(taskId, userId).orElse(null);
        if (mySub != null) {
            response = TaskDetailResponse.builder()
                    .id(response.id()).groupId(response.groupId()).title(response.title())
                    .description(response.description()).deadline(response.deadline())
                    .submissionType(response.submissionType()).createdBy(response.createdBy())
                    .createdAt(response.createdAt()).updatedAt(response.updatedAt())
                    .attachments(response.attachments()).assignees(response.assignees())
                    // Set thêm:
                    .mySubmission(taskMapper.toSubmissionResponse(mySub))
                    .totalSubmissions((int) assignmentRepo.countByTaskId(taskId))
                    .approvedSubmissions((int) submissionRepo.countByTaskIdAndStatus(taskId, TaskStatus.APPROVED))
                    .build();
        } else {
            // Handle case user chưa có submission (hiếm nếu đã assign)
        }

        return response;
    }

    @Override
    public Page<TaskSummaryResponse> listTasks(Long groupId, String keyword, Pageable pageable) {
        // Query tasks
        Specification<Task> spec = Specification.allOf(
                TaskSpecs.hasGroupId(groupId),
                TaskSpecs.isNotDeleted(),
                TaskSpecs.titleContains(keyword)
        );

        return taskRepo.findAll(spec, pageable)
                .map(taskMapper::toSummaryResponse);
    }

    @Override
    public Page<SubmissionResponse> getSubmissionStatuses(Long taskId, Long groupId, Long userId, Pageable pageable) {
        Specification<TaskSubmission> spec = Specification.allOf(
                TaskSubmissionSpecs.hasTaskId(taskId)
        );

        Page<TaskSubmission> submissions = submissionRepo.findAll(spec, pageable);

        return submissions.map(sub -> {
            Users u = userRepo.findById(sub.getUserId()).orElse(new Users());

            // Map attachments thủ công hoặc dùng mapper
            List<AttachmentResponse> attachmentResponses = sub.getAttachments().stream()
                    .map(attachmentMapper::toResponse)
                    .toList();

            return SubmissionResponse.builder()
                    .id(sub.getId()) // QUAN TRỌNG: Phải trả về ID
                    .taskId(sub.getTask().getId())
                    .user(userMapper.toUserBrief(u)) // Map User info
                    .submissionText(sub.getSubmissionText()) // Trả về nội dung bài làm
                    .status(sub.getStatus())
                    .submittedAt(sub.getSubmittedAt())
                    .grade(sub.getGrade())
                    .reviewNotes(sub.getReviewNotes())
                    .version(sub.getVersion())
                    .attachments(attachmentResponses) // Trả về file
                    .build();
        });
    }

    @Override
    public void deleteTask(Long taskId, Long groupId) {
        Task task = getTaskOrThrow(taskId, groupId);
        task.setIsDeleted(true);
        taskRepo.save(task);
    }

    // ================= PRIVATE HELPER METHODS =================

    private Task getTaskOrThrow(Long taskId, Long groupId) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        if (!task.getGroupId().equals(groupId)) throw new BusinessException("Task invalid group");
        if (task.getIsDeleted()) throw new ResourceNotFoundException("Task deleted");
        return task;
    }

    private void validateAssignees(List<Long> userIds, Long groupId) {
        if (userIds == null || userIds.isEmpty()) return;
        if (userIds.size() > MAX_ASSIGNEES) throw new BusinessException("Max " + MAX_ASSIGNEES + " users");
        if (userIds.stream().distinct().count() != userIds.size()) throw new BusinessException("Duplicate users");

        // Validate user in a group
        long count = groupMemberRepo.countByGroupIdAndUserIdIn(groupId, userIds);
        if (count != userIds.size()) throw new BusinessException("Some users not in group");
    }

    private void validateFiles(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) return;
        if (files.size() > 5) throw new BusinessException("Max 5 files");

        for (MultipartFile f : files) {
            if (f.getSize() > MAX_FILE_SIZE) throw new BusinessException("File too large > 50MB");
        }
    }

    private List<Long> getAllGroupMemberIds(Long groupId) {
        // Giả sử GroupMemberRepo có hàm tìm tất cả theo groupId
        // Nếu dùng Entity thì map ra ID
        return groupMemberRepo.findAllByGroupId(groupId)
                .stream()
                .map(gm -> gm.getUser().getId())
                .toList();
    }

    private void assignUsersToTaskInternal(Task task, List<Long> userIds) {
        List<TaskAssignment> assignments = new ArrayList<>();
        List<TaskSubmission> submissions = new ArrayList<>();

        for (Long uid : userIds) {
            // 1. Assignment Record
            TaskAssignment ta = new TaskAssignment();
            ta.setTask(task);
            ta.setUserId(uid);
            ta.setAssignedAt(Instant.now());
            assignments.add(ta);

            // 2. Pre-create Submission Record (Status = ASSIGNED)
            TaskSubmission ts = new TaskSubmission();
            ts.setTask(task);
            ts.setUserId(uid);
            ts.setStatus(TaskStatus.ASSIGNED);
            ts.setVersion(1);
            submissions.add(ts);
        }
        assignmentRepo.saveAll(assignments);
        submissionRepo.saveAll(submissions);
    }

    private void sendTaskNotification(Task task, List<Long> userIds, String type) {
        List<Users> users = userRepo.findByIdIn(userIds);
        StudyGroups g = groupRepo.findStudyGroupById(task.getGroupId()).orElseThrow(
                () -> new ResourceNotFoundException("Group not found")
        );
        for (Users u : users) {
            String content = "Bạn được giao bài tập mới: " + task.getTitle();
            String link = "/rooms/" + g.getSlug() + "?tab=tasks";
            notificationService.sendNotification(u, content, link, type);
        }
    }


    private void updateTaskAssignees(Task task, List<Long> newIds) {
        // Lấy list ID hiện tại
        List<Long> currentIds = assignmentRepo.findByTaskId(task.getId())
                .stream().map(TaskAssignment::getUserId).toList();

        // 1. Tìm người cần thêm (Có trong New nhưng không có trong Current)
        List<Long> toAdd = newIds.stream()
                .filter(id -> !currentIds.contains(id))
                .toList();

        // 2. Tìm người cần xóa (Có trong Current nhưng không có trong New)
        List<Long> toRemove = currentIds.stream()
                .filter(id -> !newIds.contains(id))
                .toList();

        // Thực hiện thêm mới
        if (!toAdd.isEmpty()) {
            assignUsersToTaskInternal(task, toAdd); // Tái sử dụng hàm cũ
            // Có thể gửi notif cho người mới được thêm ở đây nếu muốn
        }

        // Thực hiện xóa (Xóa Assignment & Submission chưa nộp)
        if (!toRemove.isEmpty()) {
            // Xóa Assignment
            assignmentRepo.deleteByTaskIdAndUserIdIn(task.getId(), toRemove);

            // Xóa Submission (Chỉ xóa nếu chưa nộp bài - Status = ASSIGNED)
            // Nếu đã nộp rồi thì giữ lại hoặc xử lý tùy nghiệp vụ (ở đây t giữ lại cho an toàn data)
            submissionRepo.deleteByTaskIdAndUserIdInAndStatus(task.getId(), toRemove, TaskStatus.ASSIGNED);
        }
    }
}