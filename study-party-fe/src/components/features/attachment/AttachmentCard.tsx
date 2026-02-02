import { FileText, FileImage, FileCode, FileArchive, File, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import AvatarDisplay from "@/components/shared/AvatarDisplay";
import type { AttachmentDetailResponse } from "@/types/attachment/attachment.type.ts";
import {fmtDateTime} from "@/utils/date.ts"; // Đảm bảo type này khớp với JSON

interface AttachmentCardProps {
    attachment: AttachmentDetailResponse;
}

// Helper: Format dung lượng file
const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// Helper: Chọn icon dựa trên extension
const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(type)) return <FileImage className="h-8 w-8 text-purple-500" />;
    if (['doc', 'docx', 'pdf', 'txt'].includes(type)) return <FileText className="h-8 w-8 text-blue-500" />;
    if (['zip', 'rar', '7z'].includes(type)) return <FileArchive className="h-8 w-8 text-orange-500" />;
    if (['java', 'js', 'ts', 'html', 'css', 'py'].includes(type)) return <FileCode className="h-8 w-8 text-green-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
};

export function AttachmentCard({ attachment }: AttachmentCardProps) {
    const { fileName, fileSize, fileType, uploadedAt, uploadedBy, filePath } = attachment;

    return (
        <div className="group flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm hover:bg-accent/50 transition-all duration-200 hover:shadow-md">
            {/* Phần Icon và Thông tin File */}
            <div className="flex items-center gap-4 overflow-hidden">
                <div className="shrink-0 rounded-md bg-muted/30 p-2">
                    {getFileIcon(fileType)}
                </div>

                <div className="flex flex-col min-w-0">
                    <a
                        href={filePath}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate text-sm font-medium items-start justify-start text-foreground hover:text-primary transition-colors hover:underline"
                        title={fileName}
                    >
                        {fileName}
                    </a>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>{formatBytes(fileSize)}</span>
                        <span>•</span>
                        <span>{fmtDateTime(uploadedAt)}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 ml-4 shrink-0">
                <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="hidden md:inline">Đăng bởi</span>
                    <div className="flex items-center gap-1.5 rounded-full bg-background border px-2 py-1">
                        <AvatarDisplay
                            src={uploadedBy?.avatarUrl || ''}
                            fallback={uploadedBy?.displayName || 'Ẩn danh'}
                            size={20}
                            userId={uploadedBy?.id}
                        />
                        <span className="font-medium text-foreground truncate max-w-[80px]">
                            {uploadedBy?.displayName || 'Ẩn danh'}
                        </span>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    asChild
                >
                    <a href={filePath} target="_blank" rel="noreferrer" download>
                        <Download className="h-4 w-4"/>
                    </a>
                </Button>
            </div>
        </div>
    );
}