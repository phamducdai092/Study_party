import { useEffect, useState } from "react";

/**
 * useDebounce Hook
 * @param value Giá trị cần debounce (thường là state từ ô input)
 * @param delay Thời gian chờ (ms) - Mặc định 500ms
 * @returns Giá trị đã được debounce
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
    // State lưu trữ giá trị đã debounce
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Tạo bộ đếm thời gian: Sau `delay` ms thì mới update state
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup function: Chạy khi value thay đổi hoặc component unmount
        // Nó sẽ xóa timer cũ đi để không bị update sai
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]); // Chỉ chạy lại khi value hoặc delay thay đổi

    return debouncedValue;
}