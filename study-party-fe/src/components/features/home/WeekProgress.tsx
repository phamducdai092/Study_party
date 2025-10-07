import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx"
import {Progress} from "@/components/ui/progress.tsx"
import {Award, Target} from "lucide-react"


export type ProgressItem = { label: string; current: number; target: number }


export function WeekProgress({
                                 totalLabel,
                                 totalValue,
                                 totalPercent,
                                 items,
                                 achievement,
                             }: {
    totalLabel: string
    totalValue: string
    totalPercent: number
    items: ProgressItem[]
    achievement?: { title: string; current: number; target: number }
}) {
    return (
        <Card>
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-primary" />Tiến độ tuần</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span>{totalLabel}</span>
                        <span className="font-medium">{totalValue}</span>
                    </div>
                    <Progress value={totalPercent} className="h-3" />
                    <p className="text-xs text-muted-foreground mt-1">{totalPercent}% mục tiêu tuần này</p>
                </div>


                <div className="space-y-4">
                    {items.map((item, i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span>{item.label}</span>
                                <span className="font-medium">{item.current}/{item.target}</span>
                            </div>
                            <Progress value={(item.current / item.target) * 100} className="h-2" />
                        </div>
                    ))}
                </div>


                {achievement ? (
                    <div className="p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl">
                        <div className="flex items-center gap-2 mb-2"><Award className="h-4 w-4 text-primary" /><span className="text-sm font-medium">Thành tích sắp đạt</span></div>
                        <div className="text-xs text-muted-foreground mb-2">{achievement.title}</div>
                        <Progress value={(achievement.current / achievement.target) * 100} className="h-2" />
                        <div className="text-xs text-muted-foreground mt-1">{achievement.current}/{achievement.target} giờ học liên tục</div>
                    </div>
                ) : null}
            </CardContent>
        </Card>
    )
}