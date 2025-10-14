import useAuthStore from "@/store/auth.store";
import { getAccess, scheduleProactiveRefresh } from "@/lib/token";

/**
 * Khởi động phiên đăng nhập và đặt lịch làm mới token.
 */
export async function bootstrapAuth() {
    const token = getAccess();
    if (!token || token === "null" || token === "undefined" || token.trim() === "") {
        return;
    }

    // 👈 2. Đặt lịch refresh ngay khi phát hiện có token
    // Dù cho việc loadMe() có thể thất bại (do token hết hạn),
    // cơ chế refresh trong http.ts vẫn sẽ xử lý được.
    scheduleProactiveRefresh(token);

    try {
        // Tải thông tin người dùng
        await useAuthStore.getState().loadMe();
    } catch {
        // Bỏ qua lỗi ở đây. Nếu token hết hạn, interceptor sẽ tự động refresh
        // ở lần gọi API tiếp theo.
    }
}