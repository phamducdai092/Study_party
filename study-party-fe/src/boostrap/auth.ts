import useAuthStore from "@/store/auth.store";
import { getAccess } from "@/lib/token";

/**
 * Khởi động phiên đăng nhập nếu đã có access token trong storage.
 * Tự nuốt lỗi (không ném toast) để boot êm.
 */
export async function bootstrapAuth() {
    const token = getAccess();
    if (!token || token === "null" || token === "undefined" || token.trim() === "") {
        return;
    }
    try {
        await useAuthStore.getState().loadMe();
    } catch {
        // ignore: có thể token hết hạn, FE sẽ tự refresh / flow khác xử lý
    }
}
