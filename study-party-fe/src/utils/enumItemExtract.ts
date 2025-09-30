import type {EnumItem} from "@/types/enum.type.ts";

export const getEnumItem = (enumItems: EnumItem[], code: string): EnumItem | undefined => {
    return enumItems.find(item => item.code === code);
};