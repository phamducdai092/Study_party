import {useParams, useNavigate} from "react-router-dom";
import {useGroups, type GroupListType} from "@/hooks/useGroups";

import {AppPagination} from "@/components/common/AppPagination";
import RoomCard from "@/components/features/group/RoomCard";
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {ArrowLeft, LaptopMinimalCheck, Star, Globe2, Search} from "lucide-react";
import {useEnumStore} from "@/store/enum.store";
import {getEnumItem} from "@/utils/enumItemExtract";
import {useTableParams} from "@/hooks/filters/useTableParams.ts";
import type {EnumItem} from "@/types/enum.type.ts";
import {useDebounce} from "@/hooks/common/useDebounce.ts";

export default function GroupListPage() {
    const {type} = useParams<{ type: string }>();
    const navigate = useNavigate();
    const groupEnum = useEnumStore().get("GroupTopic");

    // 1. Validate Type (Logic cũ giữ nguyên)
    let listType: GroupListType = 'joined';
    if (type === 'owned') listType = 'owned';
    if (type === 'discover') listType = 'discover';

    // 2. Setup Hook TableParams (Quản lý Search, Page, Filter)
    // Giả sử m muốn filter theo Topic (enum)
    const {
        params,
        handlePageChange,
        handleSearch,
        handleFilterChange
    } = useTableParams({
        size: 12, // Grid view thì để 12 đẹp hơn
        sort: 'createdAt,desc' // Mặc định mới nhất lên đầu
    });

    // 3. Debounce Keyword (Tránh spam API)
    const debouncedKeyword = useDebounce(params.keyword, 500);

    // 4. Gọi API (Truyền params + debouncedKeyword vào)
    const {data, isLoading} = useGroups(listType, {
        ...params,
        keyword: debouncedKeyword // Override keyword gốc bằng cái đã debounce
    });

    // Config UI (Icon/Title)
    const viewConfig = {
        joined: {
            title: "Phòng đã tham gia",
            icon: LaptopMinimalCheck,
            desc: "Danh sách tất cả các nhóm học tập bạn đang tham gia."
        },
        owned: {title: "Phòng của tôi", icon: Star, desc: "Quản lý các nhóm học tập do bạn tạo ra."},
        discover: {title: "Khám phá phòng học", icon: Globe2, desc: "Tìm kiếm và tham gia các nhóm học tập thú vị."}
    };
    const currentView = viewConfig[listType];
    const Icon = currentView.icon;

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                            <ArrowLeft className="h-5 w-5"/>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <Icon className="h-6 w-6 text-primary"/>
                                {currentView.title}
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                {currentView.desc}
                            </p>
                        </div>
                    </div>

                    {/* --- TOOLBAR (Search & Filter) --- */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {/* Ô tìm kiếm */}
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <Input
                                placeholder="Tìm tên nhóm..."
                                className="pl-9"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        {/* Filter Topic (Nếu cần) */}
                        <Select onValueChange={(val) => handleFilterChange({topic: val === 'ALL' ? undefined : val})}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Chủ đề"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Tất cả chủ đề</SelectItem>
                                {groupEnum?.map((item: EnumItem) => (
                                    <SelectItem key={item.code} value={item.code}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* --- CONTENT GRID --- */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <Skeleton key={i} className="h-[200px] rounded-xl"/>
                        ))}
                    </div>
                ) : (data?.items?.length ?? 0) === 0 ? (
                    <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                        <p className="text-muted-foreground">Không tìm thấy nhóm nào phù hợp.</p>

                        {/* Nút điều hướng khi data trống */}
                        {params.keyword || params.filters?.topic ? (
                            <Button variant="link" onClick={() => {
                                handleSearch("");
                                handleFilterChange({topic: undefined});
                            }} className="mt-2">
                                Xóa bộ lọc
                            </Button>
                        ) : (
                            listType === 'discover' && (
                                <p className="text-sm mt-2">Hãy thử quay lại sau nhé!</p>
                            )
                        )}
                    </div>
                ) : (
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {data?.items.map((room) => (
                            <RoomCard
                                key={room.id}
                                room={room}
                                enumItem={getEnumItem(groupEnum, room.topic)}
                                onClick={() => navigate(`/rooms/${room.slug}`)}
                            />
                        ))}
                    </div>
                )}

                {/* --- PAGINATION --- */}
                {data?.meta && data.meta.totalPages > 1 && (
                    <div className="mt-8 flex justify-center border-t pt-4">
                        <AppPagination
                            page={data.meta.page} // Dùng data từ API
                            totalPages={data.meta.totalPages}
                            totalItems={data.meta.totalItems}
                            onPageChange={(p) => {
                                handlePageChange(p); // Gọi hàm của hook
                                window.scrollTo({top: 0, behavior: 'smooth'});
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}