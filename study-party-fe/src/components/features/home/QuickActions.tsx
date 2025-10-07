import {Button} from "@/components/ui/button.tsx"
import {cn} from "@/lib/utils.ts"
import {Users, FileText, Bell, Plus} from "lucide-react"


export function QuickActions({ onAction }: { onAction?: (key: "create" | "find" | "share" | "notify") => void }) {
    const actions = [
        { key: "create" as const, label: "Tạo phòng học", icon: Plus, color: "text-primary" },
        { key: "find" as const, label: "Tìm nhóm", icon: Users, color: "text-success" },
        { key: "share" as const, label: "Chia sẻ tài liệu", icon: FileText, color: "text-info" },
        { key: "notify" as const, label: "Thông báo", icon: Bell, color: "text-warning" },
    ]


    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {actions.map((action) => (
                <Button
                    key={action.key}
                    variant="outline"
                    className="h-auto p-3 flex-col gap-2 hover:bg-background"
                    onClick={() => onAction?.(action.key)}
                >
                    <action.icon className={cn("h-5 w-5", action.color)} />
                    <span className="text-xs">{action.label}</span>
                </Button>
            ))}
        </div>
    )
}