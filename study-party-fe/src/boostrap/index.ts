import {bootstrapAuth} from "./auth";
import {bootstrapEnums} from "./enum.ts";
import {bootstrapGroups} from "./group.ts";

/**
 * Chạy mọi tác vụ khởi động cần thiết cho app.
 * Có thể thêm: feature flags, settings, i18n, theme tokens...
 */
export async function runBootstrap() {
    await Promise.all([
        bootstrapAuth(),
        bootstrapEnums(),
        bootstrapGroups(),
    ]);
}
