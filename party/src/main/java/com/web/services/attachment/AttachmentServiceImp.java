package com.web.services.attachment;

import com.web.dto.mapper.group.task.AttachmentMapper;
import com.web.dto.response.group.task.AttachmentDetailResponse;
import com.web.entities.Users;
import com.web.entities.task.Attachment;
import com.web.entities.task.Task;
import com.web.entities.task.TaskSubmission;
import com.web.repositories.attachment.AttachmentRepository;
import com.web.repositories.attachment.AttachmentSpecs;
import com.web.services.fileStorage.FileStorageService;
import com.web.utils.Helper;
import com.web.utils.PermissionChecker;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
        // 1. Query DB lấy Page<Entity>
        Specification<Attachment> spec = Specification.allOf(
                AttachmentSpecs.isNotDeleted(),
                AttachmentSpecs.uploadedBy(userId)
        );
        Page<Attachment> pageResult = attachmentRepository.findAll(spec, pageable);

        // 2. Map sang Page<DTO> và trả về luôn (Spring lo phần còn lại)
        return pageResult.map(attachmentMapper::toDetailResponse);
    }

    @Override
    public Page<AttachmentDetailResponse> getAttachmentsByGroup(Long groupId, Long userId, Pageable pageable) {
        // 1. Check quyền
        permissionChecker.requireMember(userId, groupId);

        // 2. Query DB
        Specification<Attachment> spec = Specification.allOf(
                AttachmentSpecs.isNotDeleted(),
                AttachmentSpecs.belongsToGroup(groupId)
        );
        Page<Attachment> pageResult = attachmentRepository.findAll(spec, pageable);

        // 3. Map sang Page<DTO> và trả về
        return pageResult.map(attachmentMapper::toDetailResponse);
    }
}
