import {Card, CardContent} from "@/components/ui/card.tsx"
import {TrendingUp} from "lucide-react"
// import {cn} from "@/lib/utils.ts"
// import * as Icons from "lucide-react"

export type QuickStat = {
    title: string
    value: string
    target?: string
    icon: string
    color?: string
}


export function QuickStats({ stats }: { stats: QuickStat[] }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => {
                // const Icon = Icons[stat.icon]
                return (
                    <Card key={i} className="hover:shadow-md transition-all duration-300 group">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                {/*{Icon ? <Icon className={cn("h-4 w-4", stat.color)} /> : <div />}*/}
                                <TrendingUp className="h-3 w-3 text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex items-baseline gap-1">
                                <div className="text-xl font-bold">{stat.value}</div>
                                {stat.target ? <div className="text-sm text-muted-foreground">{stat.target}</div> : null}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">{stat.title}</div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}