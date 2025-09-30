import {Dialog, DialogContent} from "@/components/ui/dialog.tsx";
import {X} from "lucide-react";

const Lightbox = ({open, onOpenChange, src}: { open: boolean; onOpenChange: (v: boolean) => void; src?: string }) => {
    if (!open) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/90 border-0">
                <button
                    className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
                    onClick={() => onOpenChange(false)}
                >
                    <X className="h-5 w-5"/>
                </button>
                {src ? (
                    <img
                        src={src}
                        alt="preview"
                        className="w-full h-full object-contain max-h-[95vh]"
                    />
                ) : null}
            </DialogContent>
        </Dialog>
    );
}

export default Lightbox;
