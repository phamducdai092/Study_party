import React, {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {format} from "date-fns";
import {Loader2, Save, X, Paperclip, Check, ChevronsUpDown} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription} from "@/components/ui/form";
import {Badge} from "@/components/ui/badge";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

import {SubmissionType} from "@/types/enum/task.enum";
import {cn} from "@/lib/utils";
import {useGroupMembers} from "@/hooks/useGroupMember.ts";
import type {AssigneeResponse} from "@/types/user.type.ts";
import type {TaskDetailResponse} from "@/types/task/task.type.ts";
import AvatarDisplay from "@/components/shared/AvatarDisplay.tsx";

// Schema
const editSchema = z.object({
    title: z.string().min(5, "Tiêu đề ngắn quá (min 5)"),
    description: z.string().min(10, "Mô tả sơ sài quá (min 10)"),
    deadline: z.string().refine((val) => new Date(val) > new Date(), {
        message: "Deadline phải ở thì tương lai chứ bro!",
    }),
    submissionType: z.enum([SubmissionType.INDIVIDUAL, SubmissionType.GROUP]),
    assigneeIds: z.array(z.number()),
    isAssignAll: z.boolean(),
});

export type EditFormValues = z.infer<typeof editSchema>;

interface TaskEditFormProps {
    task: TaskDetailResponse;
    onSubmit: (values: EditFormValues, files: File[]) => void;
    onCancel: () => void;
    isPending: boolean;
}

export default function TaskEditForm({task, onSubmit, onCancel, isPending}: TaskEditFormProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [openCombobox, setOpenCombobox] = useState(false);

    // 1. Lấy danh sách thành viên
    const {data: memberData} = useGroupMembers(task?.groupId, {
        page: 0,
        size: 100,
        enabled: !!task?.groupId
    });
    const members = memberData?.items || [];

    const form = useForm<EditFormValues>({
        resolver: zodResolver(editSchema),
        defaultValues: {
            title: "",
            description: "",
            deadline: "",
            submissionType: SubmissionType.INDIVIDUAL,
            assigneeIds: [],
            isAssignAll: true,
        },
    });

    // 2. Load dữ liệu cũ vào Form
    useEffect(() => {
        if (task) {
            const currentAssigneeIds = task.assignees?.map((u: AssigneeResponse) => Number(u.id)) || [];

            // Logic: Nếu list rỗng thì coi như là Assign All (hoặc tùy logic BE của m)
            const isAll = (task.assignees || []).length === 0;

            form.reset({
                title: task.title,
                description: task.description,
                deadline: task.deadline ? format(new Date(task.deadline), "yyyy-MM-dd'T'HH:mm") : "",
                submissionType: task.submissionType,
                assigneeIds: currentAssigneeIds,
                isAssignAll: isAll
            });
            setFiles([]);
        }
    }, [task, form]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    // 🔥 FIX 2: Hàm Toggle chuẩn chỉ Number
    const toggleMember = (memberIdInput: number | string) => {
        const memberId = Number(memberIdInput); // 1. Ép kiểu về Number cho chắc

        // 2. Lấy list ID đang chọn hiện tại, ép hết về Number để so sánh
        const currentIds = (form.getValues("assigneeIds") || []).map(Number);

        if (currentIds.includes(memberId)) {
            // CASE: Đã có -> Xóa (Bỏ dấu tích)
            // Lọc bỏ thằng có id trùng ra khỏi mảng
            const newIds = currentIds.filter(id => id !== memberId);
            form.setValue("assigneeIds", newIds, { shouldValidate: true, shouldDirty: true });
        } else {
            // CASE: Chưa có -> Thêm vào (Hiện dấu tích)
            // Giữ nguyên mảng cũ + thằng mới
            const newIds = [...currentIds, memberId];
            form.setValue("assigneeIds", newIds, { shouldValidate: true, shouldDirty: true });
        }
    };

    // UI Variables
    const isAssignAll = form.watch("isAssignAll");
    const selectedAssigneeIds = form.watch("assigneeIds");

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => {
                const finalAssignees = values.isAssignAll ? [] : values.assigneeIds;
                onSubmit({...values, assigneeIds: finalAssignees}, files);
            })} className="space-y-6 px-1">

                {/* Basic Info Block */}
                <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="font-semibold">Tiêu đề</FormLabel>
                                <FormControl><Input className="bg-white dark:bg-slate-950" {...field} /></FormControl>
                                <FormMessage className="text-red-500"/>
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="deadline"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Hạn chót ⏳</FormLabel>
                                    <FormControl><Input type="datetime-local"
                                                        className="bg-white dark:bg-slate-950" {...field} /></FormControl>
                                    <FormMessage className="text-red-500"/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="submissionType"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Thể loại</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger
                                            className="bg-white dark:bg-slate-950"><SelectValue/></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value={SubmissionType.INDIVIDUAL}>👤 Cá nhân</SelectItem>
                                            <SelectItem value={SubmissionType.GROUP}>👥 Nhóm</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Mô tả chi tiết 📝</FormLabel>
                                <FormControl><Textarea
                                    className="min-h-[120px] bg-white dark:bg-slate-950" {...field} /></FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                {/* --- ASSIGNEES SECTION --- */}
                <div className="p-4 border rounded-2xl bg-white dark:bg-slate-950 space-y-4">
                    <FormField
                        control={form.control}
                        name="isAssignAll"
                        render={({field}) => (
                            <FormItem
                                className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-slate-50 dark:bg-slate-900">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base font-semibold">Giao cho tất cả</FormLabel>
                                    <FormDescription>Thay đổi người được giao bài tập này.</FormDescription>
                                </div>
                                <FormControl>
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 accent-primary cursor-pointer"
                                        checked={field.value}
                                        onChange={(e) => {
                                            field.onChange(e.target.checked);
                                            // Nếu chọn Assign All thì clear list custom đi cho sạch
                                            if (e.target.checked) {
                                                form.setValue("assigneeIds", []);
                                            }
                                        }}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {!isAssignAll && (
                        <FormField
                            control={form.control}
                            name="assigneeIds"
                            render={({field}) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Chọn thành viên cụ thể</FormLabel>
                                    <Popover modal={true} open={openCombobox} onOpenChange={setOpenCombobox}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn("w-full justify-between", !field.value?.length && "text-muted-foreground")}
                                                >
                                                    {field.value?.length > 0
                                                        ? `Đang chọn ${field.value.length} người`
                                                        : "Tìm kiếm thành viên..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[400px] p-0" align="start">
                                            <Command shouldFilter={true}>
                                                <CommandInput placeholder="Tìm theo tên..."/>
                                                <CommandList>
                                                    <CommandEmpty>Không tìm thấy ai.</CommandEmpty>
                                                    <div className="max-h-[200px] overflow-auto">
                                                        {members.map((item) => {
                                                            const mId = Number(item.member.id); // Ép kiểu ID của item dòng này

                                                            // Check xem ông này đã được chọn chưa (để hiện tích)
                                                            // field.value chính là cái assigneeIds m nói đó
                                                            const isSelected = field.value?.includes(mId);

                                                            return (
                                                                <CommandItem
                                                                    key={mId}
                                                                    value={`${item.member.displayName}-${mId}`} // Value để search
                                                                    onSelect={() => toggleMember(mId)} // Bấm vào gọi hàm toggle ở trên
                                                                    className="cursor-pointer"
                                                                >
                                                                    <div className="flex items-center gap-2 flex-1">
                                                                        {/* ICON DẤU TÍCH Ở ĐÂY */}
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4 text-primary",
                                                                                // Nếu isSelected = true -> Hiện (opacity-100), sai thì Ẩn
                                                                                isSelected ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />

                                                                        <AvatarDisplay
                                                                            src={item.member.avatarUrl}
                                                                            size={36}
                                                                            fallback={item.member.displayName}
                                                                            userId={item.member.id}
                                                                            showStatus={true}
                                                                        />
                                                                        <span>{item.member.displayName}</span>
                                                                    </div>
                                                                </CommandItem>
                                                            );
                                                        })}
                                                    </div>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>

                                    {selectedAssigneeIds?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {members
                                                .filter(m => selectedAssigneeIds.includes(Number(m.member.id)))
                                                .map(m => (
                                                    <Badge key={m.member.id} variant="secondary"
                                                           className="pl-1 pr-2 py-1 flex items-center gap-1">
                                                        <Avatar className="h-5 w-5">
                                                            <AvatarImage src={m.member.avatarUrl}/>
                                                            <AvatarFallback
                                                                className="text-[9px]">{m.member.displayName?.substring(0, 1)}</AvatarFallback>
                                                        </Avatar>
                                                        {m.member.displayName}
                                                        <X className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500"
                                                           onClick={() => toggleMember(m.member.id)}/>
                                                    </Badge>
                                                ))
                                            }
                                        </div>
                                    )}
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    )}
                </div>

                {/* File Upload Block */}
                <div
                    className="space-y-3 p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <FormLabel className="flex items-center gap-2 cursor-pointer"
                               onClick={() => document.getElementById('edit-file-upload')?.click()}>
                        <Paperclip className="h-4 w-4"/> Thêm tài liệu đính kèm
                    </FormLabel>
                    <Input id="edit-file-upload" type="file" multiple onChange={handleFileChange} className="hidden"/>
                    {files.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {files.map((f, i) => (
                                <Badge key={i} variant="secondary" onClick={() => removeFile(i)}
                                       className="cursor-pointer hover:bg-red-100 hover:text-red-600">
                                    {f.name} <X className="h-3 w-3 ml-1"/>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions Buttons */}
                <div className="flex gap-3 w-full justify-end pt-4 border-t">
                    <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending}
                            className="rounded-xl">
                        <X className="h-4 w-4 mr-2"/> Hủy bỏ
                    </Button>
                    <Button type="submit" disabled={isPending}
                            className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white">
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> :
                            <Save className="h-4 w-4 mr-2"/>}
                        Lưu thay đổi
                    </Button>
                </div>
            </form>
        </Form>
    );
}