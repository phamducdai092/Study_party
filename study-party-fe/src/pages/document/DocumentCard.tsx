import type {AttachmentDetailResponse} from "@/types/attachment/attachment.type";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {
    BookOpen, ListFilter, File as FileIcon, Eye, Download, Trash2,
    FileCode, FileImage, FileArchive
} from "lucide-react";
import {fmtDateTime} from "@/utils/date.ts";

interface DocumentCardProps {
    file: AttachmentDetailResponse;
    onPreview?: (file: AttachmentDetailResponse) => void;
}

// Helper format dung lượng
const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper chọn icon
const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase();
    if (['pdf'].includes(type)) return <BookOpen className="h-4 w-4 text-red-500"/>;
    if (['csv', 'xls', 'xlsx'].includes(type)) return <ListFilter className="h-4 w-4 text-green-600"/>;
    if (['jpg', 'jpeg', 'png', 'webp'].includes(type)) return <FileImage className="h-4 w-4 text-purple-500"/>;
    if (['zip', 'rar'].includes(type)) return <FileArchive className="h-4 w-4 text-orange-500"/>;
    if (['html', 'css', 'js', 'java', 'py'].includes(type)) return <FileCode className="h-4 w-4 text-blue-500"/>;

    // Default Icon
    return <FileIcon className="h-4 w-4 text-muted-foreground"/>;
};

export function DocumentCard({file, onPreview}: DocumentCardProps) {
    return (
        <Card className="group relative overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 truncate" title={file.fileName}>
                    {getFileIcon(file.fileType)}
                    <span className="truncate">{file.fileName}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
                <div className="flex justify-between">
                    <span>Kích thước:</span>
                    <span className="font-medium text-foreground">{formatBytes(file.fileSize)}</span>
                </div>
                <div className="flex justify-between mt-1">
                    <span>Cập nhật:</span>
                    <span>{fmtDateTime(file.uploadedAt)}</span>
                </div>

                {/* Actions */}
                <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 px-2 flex-1 gap-1 text-[10px]"
                        onClick={() => onPreview?.(file)}
                    >
                        <Eye className="h-3 w-3"/> Xem
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 px-2 flex-1 gap-1 text-[10px]"
                        asChild
                    >
                        <a href={file.filePath} target="_blank" rel="noreferrer" download>
                            <Download className="h-3 w-3"/> Tải
                        </a>
                    </Button>
                    <Button size="sm" variant="ghost"
                            className="h-8 w-8 px-0 text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-3 w-3"/>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}