export type ScrollToTopOptions = {
    /** CSS selector của container. Mặc định dùng window */
    containerSelector?: string;
    /** 'smooth' | 'auto' */
    behavior?: ScrollBehavior;
    /** offset px để không che header dính */
    offset?: number;
};