import { useState } from "react";
import { Loader2, FileX } from "lucide-react";
import { AppPagination } from "@/components/common/AppPagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AttachmentCard } from "./AttachmentCard";
import {useGroupAttachments} from "@/hooks/attachment/useAttachment.ts";
import {cn} from "@/lib/utils.ts";

interface AttachmentListProps {
    groupId: number;
}

export function AttachmentList({ groupId }: AttachmentListProps) {
    // State phân trang
    const [currentPage, setCurrentPage] = useState(0);

    // Gọi Hook
    const { data, isLoading, isPlaceholderData } = useGroupAttachments(groupId, {
        page: currentPage,
        size: 5, // Số lượng file mỗi trang
        sort: "uploadedAt" // Mặc định mới nhất lên đầu
    });

    const attachments = data?.items || [];
    const paging = data?.meta;

    // Loading State
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-sm">Đang tải tài liệu...</span>
            </div>
        );
    }

    // Empty State
    if (attachments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-60 gap-3 border-2 border-dashed rounded-xl bg-muted/20">
                <div className="p-3 rounded-full bg-muted">
                    <FileX className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">Chưa có tài liệu nào được tải lên</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col gap-2 overflow-hidden">
            {/* List Files */}
            <ScrollArea className="flex-1 min-h-0 w-full pr-3 -mr-3">
                <div className={cn(
                    "flex flex-col gap-3 pb-4",
                    isPlaceholderData && "opacity-50 pointer-events-none"
                )}>
                    {attachments.map((file) => (
                        <AttachmentCard key={file.id} attachment={file} />
                    ))}
                </div>
            </ScrollArea>

            {/* Pagination */}
            {paging && paging.totalPages > 1 && (
                <div className="pt-2 border-t mt-auto shrink-0">
                    <AppPagination
                        page={paging.page}
                        totalPages={paging.totalPages}
                        totalItems={paging.totalItems}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
}