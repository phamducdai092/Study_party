import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Calendar, Clock, Users, Plus} from "lucide-react"
import {cn} from "@/lib/utils.ts"
import type {HTMLAttributes} from "react"

export type TodayEvent = {
    time: string
    title: string
    room: string
    type: string
    status: "upcoming" | "active" | "done"
    participants: number
    color?: string
}


interface ScheduleTodayProps extends HTMLAttributes<HTMLDivElement> {
    events: TodayEvent[]
    onJoin?: (e: TodayEvent) => void
    onView?: (e: TodayEvent) => void
    onAdd?: () => void
}

export function ScheduleToday({events, onJoin, onView, onAdd, className, ...rest}: ScheduleTodayProps) {
    return (
        <Card className={className} {...rest}>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary"/>
                        Lịch hôm nay
                    </CardTitle>
                    <div className="flex gap-2">
                        <Badge variant="secondary" className="text-xs">{events.length} phiên đã lên lịch</Badge>
                        <Button size="sm" variant="outline" className="h-8" onClick={onAdd}>
                            <Plus className="w-3 h-3 mr-1"/>Thêm
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {events.map((event, idx) => (
                    <Card key={idx}
                          className={cn("border-l-4 hover:shadow-md transition-all duration-300", event.color)}>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold">{event.title}</h3>
                                        <Badge
                                            className={cn(
                                                "text-xs px-2 py-0.5",
                                                event.status === "active" ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground"
                                            )}
                                        >
                                            {event.status === "active" ? "Đang diễn ra" : event.type}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1"><Clock
                                            className="h-3 w-3"/>{event.time}</span>
                                        <span className="flex items-center gap-1"><Users
                                            className="h-3 w-3"/>{event.participants} người</span>
                                        <span>{event.room}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {event.status === "active" ? (
                                        <Button size="sm" className="bg-success hover:bg-success/90"
                                                onClick={() => onJoin?.(event)}>Tham gia ngay</Button>
                                    ) : (
                                        <Button size="sm" variant="outline" onClick={() => onView?.(event)}>Xem chi
                                            tiết</Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
    )
}