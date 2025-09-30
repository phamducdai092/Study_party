import type {ScrollToTopOptions} from "@/types/scroll.type.ts";

export function getScrollContainer(selector?: string): HTMLElement | Window {
    if (!selector) return window;
    const el = document.querySelector<HTMLElement>(selector);
    return el || window;
}

export function scrollToTop(opts: ScrollToTopOptions = {}) {
    const {
        containerSelector,
        behavior = prefersReducedMotion() ? "auto" : "smooth",
        offset = 0,
    } = opts;

    const container = getScrollContainer(containerSelector);
    // Với window
    if (container === window) {
        window.scrollTo({top: Math.max(0, 0 - offset), behavior});
        return;
        // eslint-disable-next-line no-else-return
    } else {
        container.scrollTo({top: Math.max(0, 0 - offset), behavior});
    }
}

export function prefersReducedMotion() {
    return (
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
}