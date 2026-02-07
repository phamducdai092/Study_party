import http from "@/lib/http.ts";
import type {ApiResponse, UnwrappedResponse} from "@/types/api.type.ts";
import type {
    CreateTaskRequest,
    UpdateTaskRequest,
    SubmitTaskRequest,
    ReviewSubmissionRequest,
    TaskResponse,
    TaskDetailResponse,
    TaskSummaryResponse,
    SubmissionResponse,
} from "@/types/task/task.type.ts";
import type {TableParams} from "@/types/paging.type.ts";

// --- HELPER: Đóng gói FormData chuẩn Spring Boot ---
// Lý do: BE dùng @RequestPart("data") và @RequestPart("files")
// Nên JSON phải được ép kiểu Blob 'application/json' thì BE mới hiểu.
const buildFormData = (jsonData: any, files?: File[]) => {
    const formData = new FormData();

    // 1. Ép JSON thành Blob
    const jsonBlob = new Blob([JSON.stringify(jsonData)], {
        type: "application/json",
    });
    formData.append("data", jsonBlob);

    // 2. Nhét file vào (nếu có)
    if (files && files.length > 0) {
        files.forEach((file) => {
            formData.append("files", file);
        });
    }

    return formData;
};

export const taskService = {
    // 1. Create Task (Có upload file đề bài)
    createTask: async (groupId: number, data: CreateTaskRequest, files?: File[]) => {
        const formData = buildFormData(data, files);

        // Lưu ý: Content-Type: multipart/form-data thường được browser tự set khi thấy FormData
        const res = await http.post<ApiResponse<TaskResponse>>(
            `/groups/${groupId}/tasks`,
            formData
        );
        return res.data;
    },

// 2. Update Task (Chỉ update info, ko update file ở đây theo logic BE cũ)
    updateTask: async (
        groupId: number,
        taskId: number,
        data: UpdateTaskRequest,
        files?: File[]
    ) => {
        const formData = buildFormData(data, files);

        const res = await http.post<ApiResponse<TaskResponse>>(
            `/groups/${groupId}/tasks/${taskId}`,
            formData
        );
        return res.data;
    },

// 3. Get Task Details
    getTaskDetail: async (groupId: number, taskId: number) => {
        const res = await http.get<TaskDetailResponse>(
            `/groups/${groupId}/tasks/${taskId}`
        );
        return res.data;
    },

// 4. List Tasks (Có phân trang & Filter)
    getTasks: async (
        groupId: number,
        params: TableParams
    ) => {

        const {filters, ...rest} = params;
        const finalParams = {...rest, ...filters};

        const res = await http.get<TaskSummaryResponse[]>(`/groups/${groupId}/tasks`, {
            params: finalParams,
        });
        return res as UnwrappedResponse<TaskSummaryResponse[]>;
    },

// 5. Submit Task (Nộp bài + File)
    submitTask: async (
        groupId: number,
        taskId: number,
        data: SubmitTaskRequest,
        files?: File[]
    ) => {
        const formData = buildFormData(data, files);

        const res = await http.post<ApiResponse<SubmissionResponse>>(
            `/groups/${groupId}/tasks/${taskId}/submissions`,
            formData
        );
        return res.data;
    },

// 6. Review Submission (Chấm bài)
    reviewSubmission: async (
        groupId: number,
        taskId: number,
        submissionId: number,
        data: ReviewSubmissionRequest
    ) => {
        const res = await http.put<ApiResponse<SubmissionResponse>>(
            `/groups/${groupId}/tasks/${taskId}/submissions/${submissionId}/review`,
            data
        );
        return res.data;
    },

// 7. Get Submissions List (Cho Mod xem ds nộp)
    getSubmissions: async (
        groupId: number,
        taskId: number,
        params: TableParams
    ) => {

        const {filters, ...rest} = params;
        const finalParams = {...rest, ...filters};

        const res = await http.get<SubmissionResponse[]>(
            `/groups/${groupId}/tasks/${taskId}/submissions`,
            {
                params: finalParams,
            }
        );
        return res as UnwrappedResponse<SubmissionResponse[]>;
    },

// 8. Delete Task
    deleteTask: async (groupId: number, taskId: number) => {
        const res = await http.delete<ApiResponse<void>>(
            `/groups/${groupId}/tasks/${taskId}`
        );
        return res.data;
    },
}