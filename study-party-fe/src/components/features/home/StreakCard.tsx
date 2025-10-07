import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx"
import {Badge} from "@/components/ui/badge.tsx"
import {Progress} from "@/components/ui/progress.tsx"
import {Zap} from "lucide-react"


export function StreakCard({ streakDays, goalDays = 30 }: { streakDays: number; goalDays?: number }) {
    const pct = Math.min(100, (streakDays / goalDays) * 100)
    return (
        <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-success/5" />
            <CardHeader className="pb-3 relative z-10">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-success">
                        <Zap className="h-5 w-5" />
                        Streak
                    </CardTitle>
                    <Badge className="bg-success/20 text-success border-success/30">🔥 Hot streak!</Badge>
                </div>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="flex items-baseline gap-2 mb-4">
                    <div className="text-4xl font-bold text-success">{streakDays}</div>
                    <div className="text-sm text-muted-foreground">ngày liên tục</div>
                </div>
                <div className="space-y-2 mb-4">
                    <div className="flex gap-1">
                        {Array.from({ length: Math.min(streakDays, 7) }).map((_, i) => (
                            <div key={i} className="h-2 flex-1 rounded-full bg-gradient-to-r from-success to-success/80" />
                        ))}
                    </div>
                    <div className="text-xs text-muted-foreground text-center">Mục tiêu: {goalDays} ngày 🎯</div>
                </div>
                <Progress value={pct} className="h-2" />
            </CardContent>
        </Card>
    )
}