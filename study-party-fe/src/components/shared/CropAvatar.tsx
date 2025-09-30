import * as React from "react";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

type Props = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    src?: string;                 // objectURL or remote URL
    onConfirm: (blob: Blob, previewUrl: string) => void;  // return cropped blob + preview
    aspect?: number;              // default 1 (square)
};

    export default function CropAvatar({
                                             open,
                                             onOpenChange,
                                             src,
                                             onConfirm,
                                             aspect = 1,
                                         }: Props) {
    const [crop, setCrop] = React.useState({ x: 0, y: 0 });
    const [zoom, setZoom] = React.useState(1);
    const [croppedPixels, setCroppedPixels] = React.useState<any>(null);
    const [saving, setSaving] = React.useState(false);

    // create <img>
    function createImage(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            // tránh CORS khi dùng ảnh Cloudinary/public
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = (e) => reject(e);
            img.src = url;
        });
    }

    async function getCroppedImg(imageSrc: string, pixelCrop: any, mime = "image/jpeg", quality = 0.9) {
        const image = await createImage(imageSrc);
        const canvas = document.createElement("canvas");
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(
            image,
            pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
            0, 0, pixelCrop.width, pixelCrop.height
        );
        return new Promise<{ blob: Blob; preview: string }>((resolve) => {
            canvas.toBlob((blob) => {
                // an toàn fallback PNG nếu trình duyệt không hỗ trợ mime
                const out = blob || new Blob([canvas.toDataURL("image/png")], { type: "image/png" });
                const preview = URL.createObjectURL(out);
                resolve({ blob: out, preview });
            }, mime, quality);
        });
    }

    const handleConfirm = async () => {
        if (!src || !croppedPixels) return;
        setSaving(true);
        try {
            const { blob, preview } = await getCroppedImg(src, croppedPixels, "image/jpeg", 0.92);
            onConfirm(blob, preview);
            onOpenChange(false);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl w-[95vw] gap-0 p-0 overflow-hidden">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle>Căn chỉnh ảnh đại diện</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_280px]">
                    {/* khu crop */}
                    <div className="relative h-[60vh] min-h-[320px] bg-black/80">
                        {!!src && (
                            <Cropper
                                image={src}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspect}         // 1:1
                                cropShape="rect"        // crop hình vuông; preview sẽ là tròn
                                showGrid={false}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={(_, pixels) => setCroppedPixels(pixels)}
                                objectFit="contain"
                            />
                        )}

                        {/* thanh điều khiển zoom */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[60%] bg-black/40 rounded-full px-4 py-2">
                            <div className="flex items-center gap-3">
                                <span className="text-white text-xs w-10">Zoom</span>
                                <Slider
                                    min={1}
                                    max={3}
                                    step={0.01}
                                    value={[zoom]}
                                    onValueChange={(v) => setZoom(v[0] ?? 1)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* preview tròn kiểu FB */}
                    <div className="p-4 space-y-4">
                        <div className="text-sm text-muted-foreground">Xem trước</div>
                        <div className="flex items-center justify-center">
                            <div className="size-40 rounded-full overflow-hidden border bg-background shadow">
                                {/* trick: dùng cùng ảnh + transform để “ước lượng” preview realtime */}
                                {!!src && (
                                    <CropGhostPreview
                                        src={src}
                                        crop={crop}
                                        zoom={zoom}
                                        area={croppedPixels}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
                            <Button onClick={handleConfirm} disabled={saving}>
                                {saving ? "Đang lưu…" : "Lưu vùng crop"}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

/**
 * Preview “ảo” dạng tròn: ước lượng position/scale bằng CSS
 * để cho cảm giác giống FB trong lúc kéo/zoom.
 */
function CropGhostPreview({
                              src,
                              crop,
                              zoom,
                              area,
                          }: {
    src: string;
    crop: { x: number; y: number };
    zoom: number;
    area: { width: number; height: number; x: number; y: number } | null;
}) {
    if (!area) return null;
    // tính transform cơ bản: scale = zoom; translate theo crop
    // react-easy-crop dùng crop.x/y là % canvas, nên Ghost chỉ để cảm giác tương đối thôi
    const translateX = (-crop.x * zoom) / 2;
    const translateY = (-crop.y * zoom) / 2;
    return (
        <img
            src={src}
            alt="preview"
            className="w-full h-full"
            style={{
                objectFit: "cover",
                transform: `scale(${zoom}) translate(${translateX}px, ${translateY}px)`,
                transformOrigin: "center center",
            }}
        />
    );
}
