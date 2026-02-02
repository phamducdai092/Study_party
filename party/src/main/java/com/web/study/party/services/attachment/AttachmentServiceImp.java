package com.web.study.party.services.attachment;

import com.web.study.party.dto.mapper.group.task.AttachmentMapper;
import com.web.study.party.dto.response.group.task.AttachmentDetailResponse;
import com.web.study.party.entities.Users;
import com.web.study.party.entities.task.Attachment;
import com.web.study.party.entities.task.Task;
import com.web.study.party.entities.task.TaskSubmission;
import com.web.study.party.repositories.group.task.AttachmentRepository;
import com.web.study.party.services.fileStorage.FileStorageService;
import com.web.study.party.utils.Helper;
import com.web.study.party.utils.PermissionChecker;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttachmentServiceImp implements AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final AttachmentMapper attachmentMapper;
    private final PermissionChecker permissionChecker;

    private final FileStorageService fileStorageService;

    @Override
    public void saveAttachments(List<MultipartFile> files, Task task, TaskSubmission submission, Users uploader) {
        if (files == null || files.isEmpty()) return;

        List<Attachment> list = new ArrayList<>();
        for (MultipartFile f : files) {
            String folder = (task != null) ? "tasks/" + task.getId() : "submissions/" + submission.getId();
            String url = fileStorageService.uploadFile(f, folder);

            Attachment att = new Attachment();
            att.setFileName(f.getOriginalFilename());
            att.setFilePath(url);
            att.setFileType(Helper.getExtension(f.getOriginalFilename()));
            att.setFileSize(f.getSize());
            att.setUploadedAt(Instant.now());
            att.setTask(task);
            att.setSubmission(submission);
            att.setUploadedBy(uploader);

            list.add(att);
        }
        attachmentRepository.saveAll(list);
    }

    @Override
    public Page<AttachmentDetailResponse> getMyAttachments(Long userId, Pageable pageable) {
        Page<Attachment> attachments = attachmentRepository.findAllByUploadedByIdAndIsDeletedFalse(userId, pageable);

        // Map sang DTO
        return attachments.map(attachmentMapper::toDetailResponse);
    }

    @Override
    public Page<AttachmentDetailResponse> getAttachmentsByGroup(Long groupId, Long userId, Pageable pageable) {
        // 1. Kiểm tra quyền thành viên (phải là member mới xem được file)
        permissionChecker.requireMember(userId, groupId);

        // 2. Query DB lấy Page<Entity>
        Page<Attachment> attachments = attachmentRepository.findAllByGroupId(groupId, pageable);

        // 3. Map Entity -> DTO (UserBrief đã được xử lý trong Mapper)
        return attachments.map(attachmentMapper::toDetailResponse);
    }
}
