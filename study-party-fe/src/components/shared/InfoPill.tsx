import {cn} from "@/lib/utils.ts";

const InfoPill = ({label, value, tone = "secondary"}: {
    label: string;
    value: string;
    tone?: "secondary" | "success"
}) => {
    return (
        <div className="flex flex-col gap-1 p-3 rounded-lg border bg-muted/20">
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                {label}
            </span>
            <span className={cn(
                "text-sm font-medium truncate",
                tone === "success" && "text-success"
            )}>
                {value}
            </span>
        </div>
    );
}

export default InfoPill;
