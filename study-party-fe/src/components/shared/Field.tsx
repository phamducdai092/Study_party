import * as React from "react";
import {Label} from "@/components/ui/label.tsx";

const Field = ({label, icon: Icon, children}: { label: string; icon?: React.ElementType; children: React.ReactNode }) => {
    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4"/>}
                {label}
            </Label>
            {children}
        </div>
    );
}

export default Field;
