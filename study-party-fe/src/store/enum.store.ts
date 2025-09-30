import {create} from "zustand";
import type {EnumDict, EnumGroup, EnumState} from "@/types/enum.type.ts";

function normalize(groups: EnumGroup[]): EnumDict {
    return groups.reduce<EnumDict>((acc, g) => {
        acc[g.name] = g.items;
        return acc;
    }, {});
}

export const useEnumStore = create<EnumState>((set, get) => ({
    enums: {},
    version: undefined,
    setEnums: (groups, version) =>
        set({
            enums: normalize(groups),
            version,
        }),
    get: (name) => get().enums[name] ?? [],
}));
