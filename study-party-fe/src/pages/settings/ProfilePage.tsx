import {Card, CardContent} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import InfoPill from "@/components/shared/InfoPill";
import {Mail} from "lucide-react";
import {useMemo} from "react";
import {calcAge} from "@/utils/date";
import useAuthStore from "@/store/auth.store";
import AvatarBannerPicker from "@/components/settings/AvatarBannerPicker";
import ProfileForm from "@/components/settings/ProfileForm";
import {useUserProfile} from "@/hooks/useUserProfile";

export default function ProfilePage() {
    const {user} = useAuthStore();
    const u = user!;

    const {
        saving, saveProfile,
        avatarInputRef, bannerInputRef,
        setAvatarFile,
        setBannerFile,
        avatarPreview, bannerPreview
    } = useUserProfile(u);

    const age = useMemo(() => calcAge(u.dateOfBirth), [u.dateOfBirth]);

    return (
        <div className="space-y-6">
            <Card>
                {/* banner + avatar */}
                <AvatarBannerPicker
                    avatarPreview={avatarPreview}
                    bannerPreview={bannerPreview}
                    onPickAvatar={setAvatarFile}
                    onPickBanner={setBannerFile}
                    avatarInputRef={avatarInputRef}
                    bannerInputRef={bannerInputRef}
                    displayName={u.displayName}
                />

                <div className="px-6 pt-4 pb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form trái */}
                    <div className="lg:col-span-2">
                        <ProfileForm user={u} saving={saving} onSubmit={saveProfile}/>
                    </div>

                    {/* Card phải */}
                    <div className="lg:col-span-1">
                        <Card className="border-primary/20 sticky top-4">
                            <CardContent className="p-4 space-y-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail className="h-4 w-4"/><span className="truncate">{u.email}</span>
                                </div>
                                <div className="text-xs text-muted-foreground">Email là định danh chính và không thể
                                    đổi.
                                </div>
                                <Separator/>
                                <div className="grid grid-cols-1 gap-3 text-xs">
                                    <InfoPill label="Trạng thái" value={u.verified ? "Đã xác minh" : "Chưa xác minh"}
                                              tone={u.verified ? "success" : "secondary"}/>
                                    <InfoPill label="Tuổi" value={age?.toString() ?? "—"}/>
                                    <InfoPill label="SĐT" value={u.phoneNumber || "Chưa cập nhật"}/>
                                    <InfoPill label="Hiển thị" value={u.displayName || "Chưa cập nhật"}/>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Card>
        </div>
    );
}
