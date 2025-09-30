import {useMemo, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {BookOpen, Download, Eye, Filter, FolderOpen, ListFilter, Search, Star, Trash2, Upload, X} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Badge} from "@/components/ui/badge.tsx";


const mockFiles = [
    {id: "f1", name: "DSA-cheatsheet.pdf", type: "pdf", size: "480KB", updatedAt: "2025-08-01", starred: true},
    {id: "f2", name: "cnpm-sequence-diagram.puml", type: "puml", size: "12KB", updatedAt: "2025-08-09", starred: false},
    {id: "f3", name: "erd-v2.drawio", type: "drawio", size: "76KB", updatedAt: "2025-08-15", starred: false},
    {id: "f4", name: "ielts-vocab.csv", type: "csv", size: "33KB", updatedAt: "2025-08-21", starred: true},
];

export function DocumentsPage() {
    const [preview, setPreview] = useState<null | { id: string, name: string, type: string }>(null);
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState("recent");

    const files = useMemo(() => {
        const f = mockFiles.filter(x => x.name.toLowerCase().includes(query.toLowerCase()));
        if (sort === "name") return [...f].sort((a, b) => a.name.localeCompare(b.name));
        if (sort === "star") return [...f].sort((a, b) => Number(b.starred) - Number(a.starred));
        return f; // recent (mock)
    }, [query, sort]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
            <div className="space-y-8 p-6 max-w-7xl mx-auto">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <div className="text-xl font-semibold">Tài liệu</div>
                        <div className="text-sm text-muted-foreground">Upload, quản lý & chia sẻ</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2"><FolderOpen className="h-4 w-4"/>Thư mục</Button>
                        <Button className="gap-2"><Upload className="h-4 w-4"/>Upload</Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input placeholder="Tìm tài liệu…" className="pl-9" value={query}
                               onChange={e => setQuery(e.target.value)}/>
                    </div>
                    <Select value={sort} onValueChange={setSort}>
                        <SelectTrigger className="w-44"><SelectValue placeholder="Sắp xếp"/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recent">Gần đây</SelectItem>
                            <SelectItem value="name">Theo tên</SelectItem>
                            <SelectItem value="star">Đã gắn sao</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="gap-2"><Filter className="h-4 w-4"/>Bộ lọc</Button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {files.map(f => (
                        <Card key={f.id} className="group relative overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                    {iconFor(f.type)} {f.name}
                                    {f.starred && <Star className="h-4 w-4 text-amber-500"/>}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs text-muted-foreground">
                                <div>Kích thước: {f.size}</div>
                                <div>Cập nhật: {f.updatedAt}</div>
                                <div className="mt-2 flex items-center gap-2">
                                    <Button size="sm" variant="outline" className="gap-1" onClick={() => setPreview(f)}>
                                        <Eye className="h-4 w-4"/>Xem
                                    </Button>
                                    <Button size="sm" variant="outline" className="gap-1"><Download
                                        className="h-4 w-4"/>Tải</Button>
                                    <Button size="sm" variant="outline" className="gap-1"><Trash2
                                        className="h-4 w-4"/>Xoá</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Preview dialog (mock) */}
                <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">{preview?.name} <Badge
                                variant="secondary">{preview?.type}</Badge></DialogTitle>
                        </DialogHeader>
                        <div
                            className="h-[420px] rounded-md border bg-muted/40 flex items-center justify-center text-sm text-muted-foreground">
                            Preview khung tài liệu (PDF/IMG/Code) – gắn viewer thật sau
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" className="gap-1" onClick={() => setPreview(null)}><X
                                className="h-4 w-4"/>Đóng</Button>
                            <Button className="gap-1"><Download className="h-4 w-4"/>Tải</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

function iconFor(type: string) {
    if (type === "pdf") return <BookOpen className="h-4 w-4"/>;
    if (type === "csv") return <ListFilter className="h-4 w-4"/>;
    return <FileIcon/>;
}

function FileIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
             className="text-muted-foreground">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}
