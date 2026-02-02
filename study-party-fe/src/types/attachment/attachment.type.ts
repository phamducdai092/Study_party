import type {UserBrief} from "@/types/user.type.ts";

export type AttachmentResponse = {
    id: number;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number; // in bytes
    uploadedAt: string; // ISO date string
    uploadById: number;
}

export type AttachmentDetailResponse = {
    id: number;
    fileName: string;
    filePath: string;
    fileType: string;
    fileSize: number; // in bytes
    uploadedAt: string; // ISO date string
    uploadedBy: UserBrief;
}