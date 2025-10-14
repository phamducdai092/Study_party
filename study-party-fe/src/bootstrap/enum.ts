import { useEnumStore } from "@/store/enum.store";
import { getAllEnums } from "@/services/enum.service.ts";

/**
 * Prefetch toàn bộ enum cho FE dùng xuyên suốt.
 * Nếu BE có ETag/Version header thì gắn vào version luôn (để revalidate sau).
 */
export async function bootstrapEnums() {
    const groups = await getAllEnums();
    const etag = undefined; // nếu dùng axios interceptor -> lấy từ res.headers['etag']
    useEnumStore.getState().setEnums(groups.data ?? [], etag);
}
