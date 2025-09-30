// src/components/common/ScrollToTop.tsx
import {useEffect, useRef} from "react";
import {useLocation} from "react-router-dom";
import {scrollToTop, prefersReducedMotion} from "@/lib/scroll";

/**
 * Auto scroll-to-top khi đổi route:
 * - Smooth nếu khoảng cách cuộn nhỏ (<= maxSmoothDistance)
 * - Auto nếu khoảng cách lớn để tránh chóng mặt
 */
export default function ScrollToTop({
                                        containerSelector,
                                        offset = 0,
                                        /** px: khoảng cách tối đa để dùng smooth */
                                        maxSmoothDistance = 300,
                                    }: {
    containerSelector?: string;
    offset?: number;
    maxSmoothDistance?: number;
}) {
    const {pathname, hash} = useLocation();
    const prevPath = useRef<string>(pathname);

    useEffect(() => {
        if (hash) return; // để browser xử lý anchor
        const currentTop =
            window.scrollY || document.documentElement.scrollTop || 0;

        const distance = currentTop; // ta đang cuộn về 0
        const behavior: ScrollBehavior =
            prefersReducedMotion() || distance > maxSmoothDistance ? "auto" : "smooth";

        // đợi 1 frame cho DOM settle rồi cuộn
        const id = requestAnimationFrame(() => {
            scrollToTop({containerSelector, offset, behavior});
        });

        prevPath.current = pathname;
        return () => cancelAnimationFrame(id);
    }, [pathname, hash, containerSelector, offset, maxSmoothDistance]);

    return null;
}
