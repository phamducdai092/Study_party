import {useMemo, useState} from "react";
import {cn} from "@/lib/utils";
import {
    Layers,
    Plus,
    Play,
    RotateCcw,
    Shuffle,
    Tag,
    Timer,
    BookOpen,
    Search,
    ListFilter,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {Progress} from "@/components/ui/progress";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

// ---------------------- MOCK DATA ----------------------
const mockDecks = [
    {
        id: "alg-basics",
        name: "Algorithms – Basics",
        cards: 112,
        due: 24,
        color: "bg-blue-100 text-blue-700",
        tags: ["DSA", "Sort", "Graph"]
    },
    {
        id: "ielts-vocab",
        name: "IELTS Vocab – 6.5+",
        cards: 280,
        due: 42,
        color: "bg-violet-100 text-violet-700",
        tags: ["English", "IELTS"]
    },
    {
        id: "discrete-math",
        name: "Discrete Math",
        cards: 156,
        due: 12,
        color: "bg-emerald-100 text-emerald-700",
        tags: ["Math", "Set", "Logic"]
    },
];


// Utility for card flip
function useFlip() {
    const [flipped, setFlipped] = useState(false);
    return {flipped, toggle: () => setFlipped(s => !s), reset: () => setFlipped(false)};
}

// ---------------------- FLASHCARDS PAGE ----------------------
export function FlashcardsPage() {
    const [tab, setTab] = useState("decks");
    const [filter, setFilter] = useState("");
    const [currentIdx, setCurrentIdx] = useState(0);
    const {flipped, toggle, reset} = useFlip();

    // mock study session data
    const session = {
        deck: mockDecks[0],
        cards: [
            {q: "Độ phức tạp của binary search là?", a: "O(log n)"},
            {q: "Cấu trúc dữ liệu cho BFS?", a: "Queue (hàng đợi)"},
            {q: "Định nghĩa stable sort?", a: "Giữ nguyên thứ tự phần tử bằng nhau"},
        ],
    };
    const progress = Math.round(((currentIdx) / session.cards.length) * 100);

    const visibleDecks = useMemo(() => mockDecks.filter(d => d.name.toLowerCase().includes(filter.toLowerCase())), [filter]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
            <div className="space-y-8 p-6 max-w-7xl mx-auto">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <div className="text-xl font-semibold">Flashcards</div>
                        <div className="text-sm text-muted-foreground">Ôn tập theo kiểu Spaced Repetition</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2"><Plus className="h-4 w-4"/>Tạo bộ thẻ</Button>
                        <Button className="gap-2"><Shuffle className="h-4 w-4"/>Luyện ngẫu nhiên</Button>
                    </div>
                </div>

                <Tabs value={tab} onValueChange={setTab}>
                    <TabsList>
                        <TabsTrigger value="decks" className="gap-1"><Layers className="h-4 w-4"/>Bộ thẻ</TabsTrigger>
                        <TabsTrigger value="study" className="gap-1"><Play className="h-4 w-4"/>Học</TabsTrigger>
                        <TabsTrigger value="manage" className="gap-1"><ListFilter className="h-4 w-4"/>Quản
                            lý</TabsTrigger>
                    </TabsList>

                    {/* Decks */}
                    <TabsContent value="decks" className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1 min-w-64">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                                <Input placeholder="Tìm bộ thẻ…" className="pl-9" value={filter}
                                       onChange={(e) => setFilter(e.target.value)}/>
                            </div>
                            <Select>
                                <SelectTrigger className="w-44"><SelectValue placeholder="Sắp xếp"/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="recent">Cập nhật gần đây</SelectItem>
                                    <SelectItem value="name">Theo tên</SelectItem>
                                    <SelectItem value="due">Thẻ đến hạn</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {visibleDecks.map((d) => (
                                <Card key={d.id} className="overflow-hidden gap-2">
                                    <div
                                        className={cn("h-2 w-full", d.id === "alg-basics" && "bg-blue-400", d.id === "ielts-vocab" && "bg-violet-400", d.id === "discrete-math" && "bg-emerald-400")}/>
                                    <CardHeader className="py-2">
                                        <CardTitle className="text-base flex gap-2">
                                            <span className="text-left grow">{d.name}</span>
                                            <Badge variant="secondary" className={cn("rounded-full flex-none", d.color)}> {d.cards} cards</Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-muted-foreground space-y-2">
                                        <div className="mb-4">Đến hạn hôm nay: <b>{d.due}</b></div>
                                        <div className="flex items-center gap-2">
                                            <Button className="gap-2 grow"><Play className="h-4 w-4"/>Học
                                                ngay</Button>
                                            <Button variant="outline" className="grow">Chỉnh sửa</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Study */}
                    <TabsContent value="study">
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                            <div className="lg:col-span-2 space-y-4">
                                <Card className="overflow-hidden">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="flex items-center gap-2">
                                            <BookOpen className="h-5 w-5" />
                                            Đang học: {session.deck.name}
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="flex flex-col items-center gap-4">
                                            {/* KHUNG: tạo chiều sâu cho 3D */}
                                            <div className="relative w-full max-w-xl [perspective:1200px]">
                                                {/* ROTATOR: chỉ xoay thằng này */}
                                                <div
                                                    onClick={toggle}
                                                    className={cn(
                                                        "relative h-56 w-full rounded-2xl border p-0 text-center",
                                                        // animation mượt
                                                        "transition-transform duration-500 ease-out will-change-transform",
                                                        // chuẩn 3D
                                                        "[transform-style:preserve-3d] [transform:translateZ(0)]",
                                                        // hiệu ứng hover cho vui
                                                        "cursor-pointer select-none hover:shadow-md active:scale-[0.995]",
                                                        // khi lật
                                                        flipped && "[transform:rotateY(180deg)]"
                                                    )}
                                                >
                                                    {/* FRONT */}
                                                    <div className="absolute inset-0 grid place-items-center px-6 text-2xl backface-hidden">
                                                        {session.cards[currentIdx].q}
                                                    </div>

                                                    {/* BACK */}
                                                    <div className="absolute inset-0 grid place-items-center px-6 text-2xl backface-hidden [transform:rotateY(180deg)]">
                                                        {session.cards[currentIdx].a}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Controls */}
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setCurrentIdx((i) => Math.max(0, i - 1));
                                                        reset();
                                                    }}
                                                >
                                                    Trước
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        setCurrentIdx((i) => Math.min(session.cards.length - 1, i + 1));
                                                        reset();
                                                    }}
                                                >
                                                    Tiếp
                                                </Button>
                                                <Button variant="outline" className="gap-2">
                                                    <Timer className="h-4 w-4" />
                                                    Pomodoro
                                                </Button>
                                                <Button variant="outline" className="gap-2">
                                                    <Tag className="h-4 w-4" />
                                                    Đánh tag
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle>Tiến độ phiên học</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-sm text-muted-foreground">
                                            {currentIdx}/{session.cards.length} thẻ
                                        </div>
                                        <Progress value={progress} className="mt-2" />
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-4">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle>Thiết lập (mock)</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm">
                                        <div>
                                            <Label>Chế độ lặp</Label>
                                            <Select defaultValue="sr">
                                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="sr">Spaced Repetition</SelectItem>
                                                    <SelectItem value="cram">Cram mode</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Order</Label>
                                            <Select defaultValue="shuffle">
                                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="orig">Theo thứ tự</SelectItem>
                                                    <SelectItem value="shuffle">Ngẫu nhiên</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle>Thêm thẻ nhanh</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 text-sm">
                                        <Input placeholder="Thuật ngữ (trước)" />
                                        <Textarea placeholder="Định nghĩa (sau)" />
                                        <Button className="gap-2">
                                            <Plus className="h-4 w-4" />
                                            Thêm
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>


                    {/* Manage */}
                    <TabsContent value="manage">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle>Quản lý bộ thẻ</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Tên bộ thẻ</Label>
                                        <Input defaultValue="Algorithms – Basics"/>
                                        <Label>Tag</Label>
                                        <Input placeholder="DSA, Sort, Graph"/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Màu chủ đề</Label>
                                        <Select defaultValue="blue">
                                            <SelectTrigger><SelectValue/></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="blue">Xanh</SelectItem>
                                                <SelectItem value="violet">Tím</SelectItem>
                                                <SelectItem value="emerald">Lục</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                    <Button>Lưu</Button>
                                    <Button variant="outline" className="gap-2"><RotateCcw className="h-4 w-4"/>Hoàn
                                        tác</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
