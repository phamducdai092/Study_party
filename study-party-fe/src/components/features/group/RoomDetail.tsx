import React, {useState, useEffect} from "react";
import {cn} from "@/lib/utils";
import {
    PhoneOff,
    Mic,
    MicOff,
    Video,
    VideoOff,
    MonitorUp,
    Settings,
    Users,
    MessageSquareText,
    Files,
    Signal,
    Hand,
    Search,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs";
import {Input} from "@/components/ui/input";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {Popover, PopoverTrigger, PopoverContent} from "@/components/ui/popover";
import {ScrollArea} from "@/components/ui/scroll-area";
import Pomodoro from "@/components/shared/Pomodoro.tsx";

// --- Mock call hook (wire this to your SDK: Daily/LiveKit/Twilio later)
function useCallMock() {
    const [joined, setJoined] = useState(true);
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const [screenOn, setScreenOn] = useState(false);
    const [handUp, setHandUp] = useState(false);
    const [quality, setQuality] = useState<"good" | "fair" | "poor">("good");
    const [time, setTime] = useState(0);

    useEffect(() => {
        if (!joined) return;
        const t = setInterval(() => setTime((s) => s + 1), 1000);
        return () => clearInterval(t);
    }, [joined]);

    useEffect(() => {
        // randomize quality (mock)
        const t = setInterval(() => {
            const v = Math.random();
            setQuality(v > 0.8 ? "poor" : v > 0.5 ? "fair" : "good");
        }, 5000);
        return () => clearInterval(t);
    }, []);

    const mm = String(Math.floor(time / 60)).padStart(2, "0");
    const ss = String(time % 60).padStart(2, "0");

    return {
        joined,
        micOn,
        camOn,
        screenOn,
        handUp,
        quality,
        callTime: `${mm}:${ss}`,
        toggleMic: () => setMicOn((s) => !s),
        toggleCam: () => setCamOn((s) => !s),
        toggleScreen: () => setScreenOn((s) => !s),
        toggleHand: () => setHandUp((s) => !s),
        leave: () => setJoined(false),
        join: () => setJoined(true),
    };
}

export default function RoomDetailCallUI() {
    const call = useCallMock();

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
            <div className="mx-auto max-w-7xl p-6 space-y-6">
                {/* Top bar */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="text-xl font-semibold">CNPM Review – Room</div>
                        <Badge variant="secondary">{call.joined ? "Đang trong cuộc gọi" : "Đã rời"}</Badge>
                        <div
                            className={cn("flex items-center gap-1 text-xs", call.quality === "good" && "text-emerald-600", call.quality === "fair" && "text-amber-600", call.quality === "poor" && "text-red-600")}>
                            <Signal className="h-4 w-4"/> {call.quality}
                        </div>
                        <div className="text-xs text-muted-foreground">• {call.callTime}</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2"><Files className="h-4 w-4"/>Chia sẻ tài
                            liệu</Button>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="gap-2"><Settings className="h-4 w-4"/>Thiết
                                    bị</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-72" align="end">
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <div className="mb-1 text-xs text-muted-foreground">Micro</div>
                                        <select className="w-full rounded-md border bg-background p-2">
                                            <option>Default – Realtek Mic</option>
                                            <option>USB Mic (Podcast)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <div className="mb-1 text-xs text-muted-foreground">Camera</div>
                                        <select className="w-full rounded-md border bg-background p-2">
                                            <option>Integrated – 720p</option>
                                            <option>USB Cam – 1080p</option>
                                        </select>
                                    </div>
                                    <div>
                                        <div className="mb-1 text-xs text-muted-foreground">Loa</div>
                                        <select className="w-full rounded-md border bg-background p-2">
                                            <option>Default – Speakers</option>
                                            <option>Headset</option>
                                        </select>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Stage */}
                    <div className="space-y-4 lg:col-span-2">
                        <Card className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="relative aspect-video w-full bg-muted">
                                    {/* Remote tiles grid (mock) */}
                                    <div className="grid h-full w-full grid-cols-2 gap-2 p-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="relative overflow-hidden rounded-lg bg-black/80">
                                                {/* Replace with <Video /> from SDK */}
                                                <div
                                                    className="absolute inset-0 flex items-center justify-center text-white/70">Remote {i}</div>
                                                <div
                                                    className="absolute left-2 top-2 flex items-center gap-1 rounded bg-white/10 px-2 py-1 text-xs text-white">
                                                    <span
                                                        className="inline-block h-2 w-2 rounded-full bg-emerald-400"/> Online
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Local preview */}
                                    <div
                                        className="absolute bottom-3 right-3 h-28 w-48 overflow-hidden rounded-lg border bg-black/70">
                                        <div
                                            className="absolute inset-0 flex items-center justify-center text-white/70">Bạn
                                        </div>
                                        {!call.camOn && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Avatar className="h-12 w-12 border-2 border-white/30">
                                                    <AvatarImage src="https://i.pravatar.cc/120?img=5"/>
                                                    <AvatarFallback>U</AvatarFallback>
                                                </Avatar>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bottom controls */}
                                    <div
                                        className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center pb-4">
                                        <div
                                            className="pointer-events-auto flex items-center gap-2 rounded-full border bg-background/90 px-2 py-1 backdrop-blur">
                                            <ControlButton
                                                active={call.micOn}
                                                onClick={call.toggleMic}
                                                iconOn={<Mic className="h-5 w-5"/>}
                                                iconOff={<MicOff className="h-5 w-5"/>}
                                                label={call.micOn ? "Mic on" : "Mic off"}
                                            />
                                            <ControlButton
                                                active={call.camOn}
                                                onClick={call.toggleCam}
                                                iconOn={<Video className="h-5 w-5"/>}
                                                iconOff={<VideoOff className="h-5 w-5"/>}
                                                label={call.camOn ? "Cam on" : "Cam off"}
                                            />
                                            <ControlButton
                                                active={call.screenOn}
                                                onClick={call.toggleScreen}
                                                iconOn={<MonitorUp className="h-5 w-5"/>}
                                                iconOff={<MonitorUp className="h-5 w-5"/>}
                                                label={call.screenOn ? "Đang share" : "Share màn hình"}
                                            />
                                            <ControlButton
                                                active={call.handUp}
                                                onClick={call.toggleHand}
                                                iconOn={<Hand className="h-5 w-5"/>}
                                                iconOff={<Hand className="h-5 w-5"/>}
                                                label={call.handUp ? "Đã giơ tay" : "Giơ tay"}
                                            />
                                            <Button size="icon" className="rounded-full bg-red-600 hover:bg-red-700"
                                                    onClick={call.leave}>
                                                <PhoneOff className="h-5 w-5 text-white"/>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pomodoro inline under stage */}
                        <Pomodoro title="Pomodoro nhóm"/>
                    </div>

                    {/* Right rail */}
                    <div className="space-y-4">
                        <Tabs defaultValue="chat" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="chat">Chat</TabsTrigger>
                                <TabsTrigger value="people">Thành viên</TabsTrigger>
                                <TabsTrigger value="files">Tài liệu</TabsTrigger>
                            </TabsList>
                            <TabsContent value="chat">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="flex items-center gap-2"><MessageSquareText
                                            className="h-5 w-5"/> Chat nhóm</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ScrollArea className="text-left h-60 rounded-md border p-3 text-sm">
                                            {["Mai: Bắt đầu task 2 nha", "Teo: Okeee", "An: Tớ share ERD lên rồi"].map((m, i) => (
                                                <div key={i} className="mb-2">{m}</div>
                                            ))}
                                        </ScrollArea>
                                        <div className="mt-2 flex items-center gap-2">
                                            <Input placeholder="Nhắn gì đó cho team…"/>
                                            <Button>Gửi</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="people">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="flex items-center gap-2"><Users
                                            className="h-5 w-5"/> Thành viên (12)</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="relative mb-2">
                                            <Search
                                                className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                                            <Input placeholder="Tìm thành viên" className="pl-8"/>
                                        </div>
                                        <ScrollArea className="h-60 space-y-2">
                                            {[
                                                {name: "Teo", role: "Leader", img: "https://i.pravatar.cc/120?img=5"},
                                                {name: "Mai", role: "Member", img: "https://i.pravatar.cc/120?img=15"},
                                                {name: "An", role: "Member", img: "https://i.pravatar.cc/120?img=30"},
                                            ].map((u, i) => (
                                                <div key={i}
                                                     className="flex items-center justify-between rounded-md border p-2">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-8 w-8"><AvatarImage
                                                            src={u.img}/><AvatarFallback>{u.name[0]}</AvatarFallback></Avatar>
                                                        <div>
                                                            <div className="text-sm font-medium">{u.name}</div>
                                                            <div
                                                                className="text-xs text-muted-foreground">{u.role}</div>
                                                        </div>
                                                    </div>
                                                    <Badge variant="secondary">online</Badge>
                                                </div>
                                            ))}
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="files">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="flex items-center gap-2"><Files className="h-5 w-5"/> Tài
                                            liệu đã chia sẻ</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 text-sm">
                                        {["DSA-cheatsheet.pdf", "cnpm-seq.puml", "erd-v2.drawio"].map((f, i) => (
                                            <div key={i}
                                                 className="flex items-center justify-between rounded-md border p-2">
                                                <div>{f}</div>
                                                <Button variant="outline" size="sm">Tải</Button>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                {/* Footer hints */}
                <div className="text-xs text-muted-foreground">
                    Phím tắt: <kbd className="rounded bg-muted px-1">M</kbd> bật/tắt mic · <kbd
                    className="rounded bg-muted px-1">V</kbd> bật/tắt cam · <kbd
                    className="rounded bg-muted px-1">S</kbd> share màn hình · <kbd
                    className="rounded bg-muted px-1">H</kbd> giơ tay · <kbd
                    className="rounded bg-muted px-1">L</kbd> rời call
                </div>
            </div>
        </div>
    );
}

function ControlButton({
                           active,
                           onClick,
                           iconOn,
                           iconOff,
                           label,
                       }: {
    active: boolean;
    onClick: () => void;
    iconOn: React.ReactNode;
    iconOff: React.ReactNode;
    label: string;
}) {
    return (
        <Button
            type="button"
            size="icon"
            variant={active ? "default" : "secondary"}
            className={cn("rounded-full", !active && "opacity-80")}
            onClick={onClick}
        >
            <span className="sr-only">{label}</span>
            {active ? iconOn : iconOff}
        </Button>
    );
}
