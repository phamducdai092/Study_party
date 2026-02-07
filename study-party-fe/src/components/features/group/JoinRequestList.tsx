import {useState} from "react";
import {Check, X, Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {toast} from "sonner";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {
    joinRequestService
} from "@/services/join_request.service";
import type {JoinRequestResponse} from "@/types/group/join_request.type";
import {fmtDateTime} from "@/utils/date";
import AvatarDisplay from "@/components/shared/AvatarDisplay.tsx";

export function JoinRequestList({groupSlug}: { groupSlug: string }) {
    const [processingId, setProcessingId] = useState<number | null>(null);
    const queryClient = useQueryClient(); // Dùng để thao tác với Cache

    // ✅ THAY THẾ: useEffect + useState bằng useQuery
    const {data: requests = [], isLoading: loading} = useQuery({
        queryKey: ["join-requests", groupSlug], // Key định danh duy nhất cho cache này
        queryFn: async () => {
            const res = await joinRequestService.getJoinRequestsForGroup(groupSlug);
            return res.data || [];
        },
        staleTime: 1000 * 60 * 5, // 👈 QUAN TRỌNG: Trong 5 phút, nếu đổi tab quay lại thì KHÔNG gọi API
        gcTime: 1000 * 60 * 10,   // Giữ cache trong bộ nhớ 10 phút kể cả khi không dùng
    });

    // Xử lý Duyệt
    const handleApprove = async (reqId: number, userName: string) => {
        try {
            setProcessingId(reqId);
            await joinRequestService.approveJoinRequest(reqId);
            toast.success(`Đã duyệt thành viên ${userName}`);

            // ✅ Cập nhật Cache thủ công (Optimistic Update) -> UI update ngay lập tức
            queryClient.setQueryData(["join-requests", groupSlug], (oldData: JoinRequestResponse[] | undefined) => {
                return oldData ? oldData.filter(r => r.requestId !== reqId) : [];
            });
        } catch (error) {
            toast.error("Có lỗi xảy ra khi duyệt.");
        } finally {
            setProcessingId(null);
        }
    };

    // Xử lý Từ chối
    const handleReject = async (reqId: number) => {
        try {
            setProcessingId(reqId);
            await joinRequestService.rejectJoinRequest(reqId);
            toast.info("Đã từ chối yêu cầu");

            // ✅ Cập nhật Cache thủ công
            queryClient.setQueryData(["join-requests", groupSlug], (oldData: JoinRequestResponse[] | undefined) => {
                return oldData ? oldData.filter(r => r.requestId !== reqId) : [];
            });
        } catch (error) {
            toast.error("Có lỗi xảy ra khi từ chối.");
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground"/>
            </div>
        );
    }

    if (requests.length === 0) {
        return <div className="text-center p-4 text-sm text-muted-foreground">Không có yêu cầu nào.</div>;
    }

    return (
        <ScrollArea className="h-full pr-4">
            <div className="space-y-3">
                {requests.map((req) => (
                    <div key={req.requestId}
                         className="flex items-start justify-between gap-2 p-3 rounded-lg border bg-card shadow-sm">
                        <div className="flex items-center justify-center gap-3 min-w-0">
                            <AvatarDisplay
                                src={req.owner.avatarUrl}
                                size={48}
                                fallback={req.owner.displayName}
                                userId={req.owner.id}
                                showStatus={true}
                            />
                            <div className="min-w-0">
                                <p className="text-left text-sm font-bold truncate">{req.user.displayName}</p>
                                <p className="text-xs text-muted-foreground">
                                    {fmtDateTime(req.createdAt)}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-1">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                disabled={processingId === req.requestId}
                                onClick={() => handleApprove(req.requestId, req.user.displayName || "Người dùng")}
                            >
                                {processingId === req.requestId ? <Loader2 className="h-4 w-4 animate-spin"/> :
                                    <Check className="h-4 w-4"/>}
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                disabled={processingId === req.requestId}
                                onClick={() => handleReject(req.requestId)}
                            >
                                <X className="h-4 w-4"/>
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}