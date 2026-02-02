package com.web.study.party.repositories.group.task;

import com.web.study.party.dto.response.admin.AdminFileResponse;
import com.web.study.party.entities.task.Attachment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    // 1. Lấy file đính kèm của Đề bài (Task)
    // Lưu ý: task.id map vào field 'task' trong Entity Attachment
    List<Attachment> findByTaskId(Long taskId);

    // 2. Lấy file đính kèm của Bài nộp (Submission)
    // Lưu ý: submission.id map vào field 'submission' trong Entity Attachment
    List<Attachment> findBySubmissionId(Long submissionId);

    // 3. Xóa tất cả file của 1 bài nộp (Dùng khi user nộp lại bài mới)
    @Modifying
    @Query("DELETE FROM Attachment a WHERE a.submission.id = :submissionId")
    void deleteBySubmissionId(@Param("submissionId") Long submissionId);

    @Query("""
        SELECT a FROM Attachment a
        LEFT JOIN a.task t
        LEFT JOIN a.submission s
        LEFT JOIN s.task st
        LEFT JOIN a.groupMessage gm
        WHERE (t.groupId = :groupId OR st.groupId = :groupId OR gm.group.id = :groupId)
        AND a.isDeleted = false
    """)
    Page<Attachment> findAllByGroupId(@Param("groupId") Long groupId, Pageable pageable);

    Page<Attachment> findAllByUploadedByIdAndIsDeletedFalse(Long uploaderId, Pageable pageable);

    Page<AdminFileResponse> findByFileNameContainingIgnoreCase(String keyword, Pageable pageable);
}