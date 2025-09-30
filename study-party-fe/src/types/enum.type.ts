
export type EnumItem = {
    code: string;
    label: string;
    description?: string;
    color: string;
    icon: string;
    order: number;
    active: boolean;
};

export type EnumGroup = {
    name: string;        // ví dụ: "AccountStatus"
    items: EnumItem[];
};

export type EnumDict = Record<string, EnumItem[]>;

export type EnumState = {
    enums: EnumDict;
    version?: string;
    setEnums: (groups: EnumGroup[], version?: string) => void;
    get: (name: string) => EnumItem[];
};

// ApiResponse wrapper từ BE
export type ApiResponse<T> = {
    timestamp: string;
    path: string;
    status: number;
    code: string;       // ví dụ: "Request was successful"
    message: string;    // ví dụ: "Lấy dữ liệu thành công"
    data: T;
    meta: unknown | null;
};