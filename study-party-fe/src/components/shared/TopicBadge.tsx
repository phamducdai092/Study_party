import {Badge} from "@/components/ui/badge";
import {getIcon, topicColorMap} from "@/utils/color.ts";
import {cn} from "@/lib/utils";
import type {EnumItem} from "@/types/enum.type.ts";

type Props = {
    enumItem?: EnumItem;
    fallback?: string; // nếu không có enumItem thì hiển thị slug/topic code
};


export function TopicBadge({enumItem, fallback}: Props) {
    if (!enumItem) {
        return (
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
                {fallback}
            </Badge>
        );
    }

    const Icon = getIcon(enumItem?.icon);
    const colorClass = topicColorMap[enumItem.color] ?? "bg-gray-100 text-gray-700";

    return (
        <Badge
            variant="secondary"
            className={cn("flex items-center gap-1 text-xs px-2 py-0.5", colorClass)}
        >
            {Icon && <Icon className="w-3 h-3"/>}
            {enumItem.label}
        </Badge>
    );
}
