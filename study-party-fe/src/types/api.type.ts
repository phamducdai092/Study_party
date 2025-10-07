
export type FieldError = {
    field?: string;
    message: string;
    rejectedValue?: object;
}

export type ApiResponse<T> = {
    timestamp: string;
    path: string;
    status: number;
    code: string;       // ví dụ: "Request was successful"
    message: string;    // ví dụ: "Lấy dữ liệu thành công"
    data: T;
    meta: unknown | null;
};

export type ApiError<T> = {
    timestamp: string;
    path: string;
    status: number;
    code: string;
    message: string;
    fieldErrors: FieldError[]
}