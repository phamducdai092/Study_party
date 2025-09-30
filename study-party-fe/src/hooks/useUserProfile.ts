import {useState, useMemo, useRef} from "react";
import {toast} from "sonner";
import useAuthStore from "@/store/auth.store";
import {uploadToCloudinary} from "@/lib/cloudinary";
import {updateUserProfile} from "@/services/user.service";
import {loadMe} from "@/services/auth.service";
import type {User, UserInformationUpdatePayload} from "@/types/user.type";

export function useUserProfile(user: User) {
    const {setUser} = useAuthStore();
    const [saving, setSaving] = useState(false);

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);

    const avatarPreview = useMemo(
        () => (avatarFile ? URL.createObjectURL(avatarFile) : user.avatarUrl || undefined),
        [avatarFile, user.avatarUrl]
    );
    const bannerPreview = useMemo(
        () => (bannerFile ? URL.createObjectURL(bannerFile) : user.bannerUrl || undefined),
        [bannerFile, user.bannerUrl]
    );

    async function saveProfile(fields: Partial<UserInformationUpdatePayload>) {
        try {
            setSaving(true);
            const [avatarRes, bannerRes] = await Promise.all([
                avatarFile ? uploadToCloudinary(avatarFile, {folder: "study-party/avatars"}) : null,
                bannerFile ? uploadToCloudinary(bannerFile, {folder: "study-party/banners"}) : null,
            ]);

            const payload: UserInformationUpdatePayload = {
                avatarUrl: avatarRes?.secure_url ?? user.avatarUrl ?? undefined,
                bannerUrl: bannerRes?.secure_url ?? user.bannerUrl ?? undefined,
                displayName: fields.displayName?.trim() || undefined,
                bio: fields.bio?.trim() || undefined,
                phoneNumber: fields.phoneNumber?.trim() || undefined,
                dateOfBirth: fields.dateOfBirth || undefined,
            };
            const body = Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined));

            await updateUserProfile(body);
            const res = await loadMe();
            setUser?.(res?.data?.user ?? res?.data);
            toast.success("Cập nhật thông tin thành công!");
        } catch (e: any) {
            console.error("Update failed:", e?.response?.status, e?.response?.data || e);
            toast.error(e?.response?.data?.error?.message || "Có lỗi xảy ra, vui lòng thử lại.");
            throw e;
        } finally {
            setSaving(false);
        }
    }

    return {
        saving,
        saveProfile,
        avatarInputRef, bannerInputRef,
        avatarFile, setAvatarFile,
        bannerFile, setBannerFile,
        avatarPreview, bannerPreview,
    };
}
