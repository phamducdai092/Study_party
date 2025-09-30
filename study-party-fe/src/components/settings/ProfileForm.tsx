import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import Field from "@/components/shared/Field";
import {Calendar as CalendarIcon, Phone, User2} from "lucide-react";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {toDateInput} from "@/utils/date";
import type {User} from "@/types/user.type";

export default function ProfileForm({
                                        user,
                                        onSubmit,
                                        saving
                                    }: {
    user: User;
    saving?: boolean;
    onSubmit: (data: { displayName?: string; bio?: string; phoneNumber?: string; dateOfBirth?: string }) => void;
}) {
    const [displayName, setDisplayName] = useState(user.displayName ?? "");
    const [bio, setBio] = useState(user.bio ?? "");
    const [phone, setPhone] = useState(user.phoneNumber ?? "");
    const [dob, setDob] = useState(toDateInput(user.dateOfBirth)); // yyyy-MM-dd

    return (
        <form
            className="space-y-6"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit({
                    displayName,
                    bio,
                    phoneNumber: phone,
                    dateOfBirth: dob ? new Date(dob).toISOString() : undefined,
                });
            }}
        >
            <Field label="Tên hiển thị" icon={User2}>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="VD: Đức Đại"/>
            </Field>

            <Field label="Giới thiệu">
                <Textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)}
                          placeholder="Một vài dòng về bạn…"/>
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Số điện thoại" icon={Phone}>
                    <Input type="number" value={phone} onChange={(e) => setPhone(e.target.value)}
                           placeholder="0987xxxxxx"/>
                </Field>
                <Field label="Ngày sinh" icon={CalendarIcon}>
                    <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)}/>
                </Field>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={saving}>
                    {saving ? "Đang lưu…" : "Lưu thay đổi"}
                </Button>
            </div>
        </form>
    );
}
