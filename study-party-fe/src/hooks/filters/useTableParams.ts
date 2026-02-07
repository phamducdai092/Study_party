import { useState, useCallback } from "react";

const DEFAULT_PARAMS = {
    page: 0,
    size: 10,
    sort: "createdAt,desc",
    keyword: "",
    filters: {},
};

export const useTableParams = <T extends Record<string, any>>(initialOverrides: Partial<typeof DEFAULT_PARAMS> = {}) => {
    const [params, setParams] = useState({ ...DEFAULT_PARAMS, ...initialOverrides });

    // 1. Handle Pagination
    const handlePageChange = useCallback((newPage: number) => {
        setParams((prev) => ({ ...prev, page: newPage }));
    }, []);

    // 2. Handle Sort (Click vào header cột)
    const handleSortChange = useCallback((field: string) => {
        setParams((prev) => {
            // Logic toggle: desc -> asc -> bỏ sort (hoặc về default)
            const [currentField, currentDir] = (prev.sort || "").split(",");
            let newSort = `${field},desc`;

            if (currentField === field) {
                if (currentDir === "desc") newSort = `${field},asc`;
                else newSort = DEFAULT_PARAMS.sort; // Reset về default
            }
            return { ...prev, sort: newSort };
        });
    }, []);

    // 3. Handle Search (Reset về trang 1)
    const handleSearch = useCallback((keyword: string) => {
        setParams((prev) => ({ ...prev, keyword, page: 0 }));
    }, []);

    // 4. Handle Filter (Reset về trang 1)
    const handleFilterChange = useCallback((newFilters: Partial<T>) => {
        setParams((prev) => ({
            ...prev,
            filters: { ...prev.filters, ...newFilters },
            page: 0,
        }));
    }, []);

    return {
        params,
        handlePageChange,
        handleSortChange,
        handleSearch,
        handleFilterChange,
    };
};