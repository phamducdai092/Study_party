import {useEffect, useState} from "react";
import {ArrowUp} from "lucide-react";
import {Button} from "@/components/ui/button";
import {getScrollContainer, scrollToTop, prefersReducedMotion} from "@/lib/scroll";

type Props = {
    /** px scroll xuống bao nhiêu thì hiện nút */
    showAfter?: number;
    /** container selector nếu không dùng window */
    containerSelector?: string;
    /** offset cho header dính */
    offset?: number;
    /** đặt vị trí */
    className?: string;
};

export default function BackToTop({
                                      showAfter = 500,
                                      containerSelector,
                                      offset = 0,
                                      className = "fixed bottom-6 right-6",
                                  }: Props) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const container = getScrollContainer(containerSelector);
        const target = container === window ? window : (container as HTMLElement);

        const onScroll = () => {
            const top =
                container === window
                    ? (window.scrollY || document.documentElement.scrollTop)
                    : (container as HTMLElement).scrollTop;
            setVisible(top > showAfter);
        };

        // khởi tạo
        onScroll();

        target.addEventListener("scroll", onScroll, {passive: true});
        return () => target.removeEventListener("scroll", onScroll as any);
    }, [containerSelector, showAfter]);

    if (!visible) return null;

    return (
        <div className={className}>
            <Button
                type="button"
                size="icon"
                className="rounded-full shadow-lg"
                onClick={() =>
                    scrollToTop({
                        containerSelector,
                        offset,
                        behavior: prefersReducedMotion() ? "auto" : "smooth",
                    })
                }
                aria-label="Back to top"
            >
                <ArrowUp className="h-24 w-24"/>
            </Button>
        </div>
    );
}
