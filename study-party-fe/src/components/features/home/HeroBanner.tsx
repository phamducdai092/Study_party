import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx"
import {Badge} from "@/components/ui/badge.tsx"
import {Button} from "@/components/ui/button.tsx"
import {Calendar, PlayCircle, Target, Award, Zap} from "lucide-react"
import type {HTMLAttributes} from "react"
import {cn} from "@/lib/utils.ts"
import type {User} from "@/types/user.type.ts";

interface HeroBannerProps extends HTMLAttributes<HTMLDivElement> {
    user: User | null
    onStart?: () => void
    onViewToday?: () => void
}


export function HeroBanner({user, onStart, onViewToday, className, ...rest}: HeroBannerProps) {
    const initial = user?.email?.charAt(0)?.toUpperCase() || "U"
    const name = user?.displayName || user?.email?.split("@")[0] || "Học viên"


    return (
        <Card
            className={cn("relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10", className)} {...rest}>
            <div
                className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-[100px]"/>
            <CardHeader className="pb-4 relative z-10">
                <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/20">
                        <AvatarImage src={user?.avatarUrl || undefined}/>
                        <AvatarFallback
                            className="bg-primary/10 text-primary font-semibold text-lg">{initial}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-2xl mb-1">Chào mừng trở lại, {name}! 👋</CardTitle>
                        <p className="text-muted-foreground">"Small progress is still progress."</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Badge className="bg-success/10 text-success border-success/20 px-3 py-1">
                        <Zap className="w-3 h-3 mr-1"/>
                        Streak 7 ngày
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1">
                        <Target className="w-3 h-3 mr-1"/>
                        84% mục tiêu tuần
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">
                        <Award className="w-3 h-3 mr-1"/>
                        Level 3
                    </Badge>
                </div>
            </CardHeader>


            <CardContent className="pt-0 relative z-10">
                <div className="flex items-center gap-4">
                    <Button onClick={onStart}
                            className="bg-gradient-to-r from-primary to-primary/80 flex items-center gap-2">
                        <PlayCircle className="w-4 h-4"/>
                        Bắt đầu học ngay
                    </Button>
                    <Button variant="outline" onClick={onViewToday} className="flex items-center gap-2">
                        <Calendar className="w-4 h-4"/>
                        Xem lịch hôm nay
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}