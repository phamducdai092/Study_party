import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FolderOpen, Upload, Search, Filter, Download, X, Loader2, FileX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AppPagination } from "@/components/common/AppPagination";
import type {AttachmentDetailResponse} from "@/types/attachment/attachment.type";
import {useMyAttachments} from "@/hooks/attachment/useAttachment.ts";
import {DocumentCard} from "@/pages/document/DocumentCard.tsx";

export default function DocumentsPage() {
    // State
    const [preview, setPreview] = useState<null | AttachmentDetailResponse>(null);
    const [page, setPage] = useState(0);
    const [sort, setSort] = useState("uploadedAt");
    const [query, setQuery] = useState("");

    // Fetch Data
    const { data, isLoading } = useMyAttachments(page, 12, sort);

    // Filter client-side tạm thời (nếu API chưa hỗ trợ keyword)
    // Lưu ý: Filter này chỉ có tác dụng trên page hiện tại nếu backend ko hỗ trợ search
    const filteredFiles = data?.items.filter(f =>
        f.fileName.toLowerCase().includes(query.toLowerCase())
    ) || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
            <div className="space-y-8 p-6 max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <div className="text-xl font-semibold">Tài liệu cá nhân</div>
                        <div className="text-sm text-muted-foreground">Quản lý tất cả file bạn đã tải lên hệ thống</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2"><FolderOpen className="h-4 w-4"/>Thư mục</Button>
                        <Button className="gap-2"><Upload className="h-4 w-4"/>Upload</Button>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input
                            placeholder="Tìm tài liệu..."
                            className="pl-9"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                    </div>
                    <Select value={sort} onValueChange={setSort}>
                        <SelectTrigger className="w-44">
                            <SelectValue placeholder="Sắp xếp"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="uploadedAt:desc">Mới nhất</SelectItem>
                            <SelectItem value="uploadedAt:asc">Cũ nhất</SelectItem>
                            <SelectItem value="fileName:asc">Tên A-Z</SelectItem>
                            <SelectItem value="fileSize:desc">Dung lượng giảm</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="gap-2"><Filter className="h-4 w-4"/>Bộ lọc</Button>
                </div>

                {/* Content Area */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : filteredFiles.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredFiles.map(f => (
                            <DocumentCard
                                key={f.id}
                                file={f}
                                onPreview={setPreview}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl bg-muted/20">
                        <div className="p-4 rounded-full bg-muted mb-3">
                            <FileX className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground font-medium">Không tìm thấy tài liệu nào</p>
                    </div>
                )}

                {/* Pagination */}
                {data?.meta && data.meta.totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                        <AppPagination
                            page={data.meta.page}
                            totalPages={data.meta.totalPages}
                            totalItems={data.meta.totalItems}
                            onPageChange={(p) => {
                                setPage(p);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        />
                    </div>
                )}

                {/* Preview Dialog */}
                {/* Preview Dialog */}
                <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
                    <DialogContent className="max-w-6xl w-[95vw] flex flex-col p-0 gap-0">
                        <DialogHeader className="p-6 pb-2 shrink-0">
                            <DialogTitle className="flex items-center gap-2 truncate pr-8 text-xl">
                                {preview?.fileName}
                                <Badge variant="secondary" className="uppercase">{preview?.fileType}</Badge>
                            </DialogTitle>
                        </DialogHeader>

                        {/* Body: Chiếm hết khoảng trống còn lại (flex-1) */}
                        <div className="flex-1 w-full min-h-0 p-6 pt-2 pb-2">
                            <div className="w-full h-full rounded-md border bg-muted/40 flex items-center justify-center relative overflow-hidden">
                                {preview?.fileType === 'pdf' ? (
                                    <iframe src={preview.filePath} className="w-full h-full" title="PDF Preview"/>
                                ) : ['jpg', 'jpeg', 'png', 'webp'].includes(preview?.fileType || '') ? (
                                    <img
                                        src={preview?.filePath}
                                        alt="Preview"
                                        className="max-w-full max-h-full object-contain shadow-lg" // Ảnh tự co lại cho vừa khung
                                    />
                                ) : (
                                    <div className="text-center p-4">
                                        <p className="text-muted-foreground mb-2 text-lg">Không hỗ trợ xem trước định dạng này.</p>
                                        <Button variant="outline" asChild size="lg">
                                            <a href={preview?.filePath} target="_blank" rel="noreferrer">Mở trong tab mới</a>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 pt-2 shrink-0 flex items-center justify-end gap-2 border-t mt-auto">
                            <Button variant="outline" onClick={() => setPreview(null)}>
                                <X className="h-4 w-4 mr-1"/>Đóng
                            </Button>
                            <Button asChild>
                                <a href={preview?.filePath} download target="_blank" rel="noreferrer">
                                    <Download className="h-4 w-4 mr-1"/>Tải xuống
                                </a>
                            </Button>
                        </div>

                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}