import {Outlet} from "react-router-dom";
import {ScrollArea} from "@/components/ui/scroll-area";


export default function SettingsLayout() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6 px-4 py-6">
            <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="pr-2">
                    <Outlet/>
                </div>
            </ScrollArea>
        </div>
    );
}
