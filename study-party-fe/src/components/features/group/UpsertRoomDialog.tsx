import React, {useEffect, useMemo} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {Globe, Lock, MailQuestion, PlusCircle, UserPlus, Users} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Slider} from "@/components/ui/slider";

import type {EnumItem} from "@/types/enum.type";
import {createRoomSchema, type CreateRoomFormValues} from "@/types/schema/group.schema";
import {groupService} from "@/services/group.service";
import {reBootstrapGroups} from "@/bootstrap/bootstrap";
import OptionCard from "@/components/features/group/OptionCard";

type Mode = "create" | "edit";

export type UpsertRoomDialogProps = {
    mode: Mode;
    /**
     * Chỉ cần khi mode="edit"
     */
    slug?: string;
    /**
     * Data initial khi edit. Có thể là GroupDetailResponse BE trả về.
     */
    room?: Partial<{
        name: string;
        description?: string | null;
        joinPolicy: string;     // "OPEN" | "ASK" | "INVITE_ONLY"
        groupPrivacy: string;   // "PUBLIC" | "PRIVATE"
        topic: string;
        maxMembers?: number;
    }>;
    groupTopics?: EnumItem[] | unknown;
    /**
     * Custom trigger để xài icon/nút tùy ngữ cảnh
     */
    trigger?: React.ReactNode;
    /**
     * Callback khi submit xong (để refresh UI cục bộ)
     */
    onSuccess?: () => void;
};

export default function UpsertRoomDialog({
                                             mode,
                                             slug,
                                             room,
                                             groupTopics = [],
                                             trigger,
                                             onSuccess,
                                         }: UpsertRoomDialogProps) {
    const topics: EnumItem[] = Array.isArray(groupTopics) ? groupTopics : [];

    const form = useForm<CreateRoomFormValues>({
        resolver: zodResolver(createRoomSchema),
        defaultValues: {
            name: "",
            description: "",
            joinPolicy: "OPEN",
            groupPrivacy: "PUBLIC",
            topic: "",
            maxMembers: 50,
        },
        mode: "onChange",
    });

    const {isSubmitting, isValid} = form.formState;

    // Hydrate default values when edit
    useEffect(() => {
        if (mode === "edit" && room) {
            form.reset({
                name: room.name ?? "",
                description: room.description ?? "",
                joinPolicy: (room.joinPolicy as any) ?? "OPEN",
                groupPrivacy: (room.groupPrivacy as any) ?? "PUBLIC",
                topic: room.topic ?? "",
                maxMembers: room.maxMembers ?? 50,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, room?.name, room?.description, room?.joinPolicy, room?.groupPrivacy, room?.topic, room?.maxMembers]);

    const topicOptions = useMemo(
        () =>
            topics?.map((t) => (
                <SelectItem key={t.code} value={t.code}>
                    {t.label}
                </SelectItem>
            )) ?? [],
        [topics]
    );

    async function onSubmit(data: CreateRoomFormValues) {
        const payload = createRoomSchema.parse(data);
        try {
            if (mode === "create") {
                await groupService.createRoom(payload);
                toast.success(`Đã tạo "${payload.name}" thành công 🎉`);
            } else {
                if (!slug) throw new Error("Thiếu slug để chỉnh sửa");
                await groupService.updateRoom(slug, payload);
                toast.success(`Đã cập nhật "${payload.name}" ✅`);
            }
            await reBootstrapGroups();
            onSuccess?.();
            // Với create thì reset form cho lần tạo tiếp theo
            if (mode === "create") form.reset();
        } catch (err: any) {
            const msg = err?.response?.data?.message || (mode === "create" ? "Tạo phòng thất bại 😭" : "Cập nhật phòng thất bại 😭");
            toast.error(msg);
        }
    }

    const maxMembersVal = form.watch("maxMembers");

    // icons reuse
    const globe = <Globe className="h-[18px] w-[18px]"/>;
    const lock = <Lock className="h-[18px] w-[18px]"/>;
    const open = <Users className="h-[18px] w-[18px]"/>;
    const ask = <MailQuestion className="h-[18px] w-[18px]"/>;
    const invite = <UserPlus className="h-[18px] w-[18px]"/>;

    const title = mode === "create" ? "Tạo phòng học mới" : "Chỉnh sửa phòng học";
    const desc =
        mode === "create"
            ? "Dựng “đại bản doanh” học tập của mình — rõ ràng, gọn gàng, vào là làm ngay 💼"
            : "Cập nhật thông tin phòng để anh em dễ bề vào học cho mượt 😎";
    const submitText = isSubmitting ? (mode === "create" ? "Đang tạo..." : "Đang lưu...") : (mode === "create" ? "Xác nhận tạo phòng" : "Lưu thay đổi");

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger ?? (
                    <Button size="default" className="gap-2">
                        <PlusCircle className="h-4 w-4"/>
                        Tạo phòng mới
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[800px] md:max-w-[1280px] max-h-[90vh] overflow-hidden rounded-2xl">
                <DialogHeader className="px-1">
                    <DialogTitle className="text-xl">{title}</DialogTitle>
                    <DialogDescription>{desc}</DialogDescription>
                </DialogHeader>

                <div className="relative">
                    <div className="max-h-[58vh] overflow-y-auto pr-1">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                {/* ===== Left column ===== */}
                                <div className="space-y-6">
                                    {/* Name */}
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Tên phòng *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="VD: Hội mê code, không mê game..."
                                                        className="h-11 rounded-xl"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Topic */}
                                    <FormField
                                        control={form.control}
                                        name="topic"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Chủ đề *</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-11 rounded-xl w-full">
                                                            <SelectValue placeholder="Chọn chủ đề cho phòng..."/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="rounded-xl">{topicOptions}</SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Max members */}
                                    <FormField
                                        control={form.control}
                                        name="maxMembers"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Giới hạn thành viên</FormLabel>
                                                <div className="flex items-center gap-4 ">
                                                    <FormControl>
                                                        <Slider
                                                            min={2}
                                                            max={200}
                                                            step={1}
                                                            value={[field.value]}
                                                            onValueChange={(v) => field.onChange(v[0])}
                                                            className="w-full"
                                                        />
                                                    </FormControl>
                                                    <Input
                                                        value={maxMembersVal}
                                                        onChange={(e) => {
                                                            const n = Number(e.target.value.replace(/\D/g, ""));
                                                            if (Number.isFinite(n)) field.onChange(Math.max(2, Math.min(200, n)));
                                                        }}
                                                        className="w-20 text-center rounded-xl"
                                                        inputMode="numeric"
                                                    />
                                                </div>
                                                <FormDescription className="mt-1 mb-4">
                                                    Từ 2 đến 200 người. Mặc định: 50.
                                                </FormDescription>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* ===== Right column ===== */}
                                <div className="space-y-6 my-6 md:col-span-1 md:ml-10">
                                    {/* Privacy */}
                                    <FormField
                                        control={form.control}
                                        name="groupPrivacy"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Quyền riêng tư *</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-4"
                                                    >
                                                        <label className="cursor-pointer">
                                                            <div className="flex items-start gap-3">
                                                                <RadioGroupItem value="PUBLIC" className="mt-2 "/>
                                                                <OptionCard
                                                                    selected={field.value === "PUBLIC"}
                                                                    icon={globe}
                                                                    title="Công khai"
                                                                    desc="Ai cũng có thể tìm và xem thông tin cơ bản của phòng."
                                                                />
                                                            </div>
                                                        </label>

                                                        <label className="cursor-pointer">
                                                            <div className="flex items-start gap-3">
                                                                <RadioGroupItem value="PRIVATE" className="mt-2"/>
                                                                <OptionCard
                                                                    selected={field.value === "PRIVATE"}
                                                                    icon={lock}
                                                                    title="Riêng tư"
                                                                    desc="Chỉ thành viên mới thấy nội dung và hoạt động trong phòng."
                                                                />
                                                            </div>
                                                        </label>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Join policy */}
                                    <FormField
                                        control={form.control}
                                        name="joinPolicy"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Chính sách tham gia *</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
                                                    >
                                                        <label className="cursor-pointer">
                                                            <div className="flex items-start gap-3">
                                                                <RadioGroupItem value="OPEN" className="mt-2"/>
                                                                <OptionCard
                                                                    selected={field.value === "OPEN"}
                                                                    icon={open}
                                                                    title="Mở"
                                                                    desc="Vào là chơi. Không cần duyệt."
                                                                />
                                                            </div>
                                                        </label>

                                                        <label className="cursor-pointer">
                                                            <div className="flex items-start gap-3">
                                                                <RadioGroupItem value="ASK" className="mt-2"/>
                                                                <OptionCard
                                                                    selected={field.value === "ASK"}
                                                                    icon={ask}
                                                                    title="Duyệt"
                                                                    desc="Thành viên gửi yêu cầu, chủ phòng duyệt."
                                                                />
                                                            </div>
                                                        </label>

                                                        <label className="cursor-pointer">
                                                            <div className="flex items-start gap-3">
                                                                <RadioGroupItem value="INVITE_ONLY" className="mt-2"/>
                                                                <OptionCard
                                                                    selected={field.value === "INVITE_ONLY"}
                                                                    icon={invite}
                                                                    title="Mời"
                                                                    desc="Chỉ có thể vào qua lời mời."
                                                                />
                                                            </div>
                                                        </label>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Mô tả (không bắt buộc)</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Ghi mục tiêu, nội quy, lịch học…"
                                                        className="min-h-28 resize-y rounded-xl"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* hidden submit for Enter */}
                                <button type="submit" className="hidden"/>
                            </form>
                        </Form>
                    </div>

                    <DialogFooter
                        className="sticky bottom-0 -mx-6 mt-4 flex items-center justify-end gap-2 border-t bg-background/70 px-6 py-4 backdrop-blur">
                        <Button
                            type="submit"
                            onClick={form.handleSubmit(onSubmit)}
                            disabled={isSubmitting || !isValid}
                            className="rounded-xl"
                        >
                            {submitText}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
