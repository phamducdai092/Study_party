import {Button} from "@/components/ui/button";
import {Image as ImageIcon, Camera} from "lucide-react";
import AvatarDisplay from "@/components/shared/AvatarDisplay";

export default function AvatarBannerPicker({
                                               avatarPreview, bannerPreview,
                                               onPickAvatar, onPickBanner,
                                               avatarInputRef, bannerInputRef,
                                               displayName
                                           }: any) {
    return (
        <>
            {/* Banner */}
            <div className="relative h-48 lg:h-56 bg-gradient-to-r from-[oklch(var(--hero-from))] to-[oklch(var(--hero-to))]">
                {bannerPreview ? (
                    <div className="absolute inset-0 bg-center rounded-lg bg-cover" style={{backgroundImage: `url(${bannerPreview})`}}/>
                ) : <div className="absolute inset-0 bg-muted"/>}
                <div className="absolute right-4 bottom-4">
                    <Button variant="secondary" size="sm" onClick={() => bannerInputRef.current?.click()} className="gap-2 bg-background/90 hover:bg-background">
                        <Camera className="h-4 w-4"/> Thay banner
                    </Button>
                    <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={(e)=>onPickBanner(e.target.files?.[0]??null)}/>
                </div>
            </div>

            {/* Avatar */}
            <div className="px-6 -mt-10">
                <div className="relative h-28 w-28 md:h-32 md:w-32 rounded-full border-4 border-background shadow-lg overflow-hidden bg-background ring-2 ring-primary/20">
                    <AvatarDisplay src={avatarPreview} fallback={displayName} alt={displayName} size={160}/>
                    <Button size="icon" variant="secondary" title="Thay avatar"
                            onClick={() => avatarInputRef.current?.click()}
                            className="bg-primary-foreground absolute -bottom-1 -right-1 h-8 w-8 rounded-full shadow-md">
                        <ImageIcon className="text-primary h-4 w-4"/>
                    </Button>
                    <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={(e)=>onPickAvatar(e.target.files?.[0]??null)}/>
                </div>
            </div>
        </>
    );
}
