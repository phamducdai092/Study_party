import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useEffect} from "react";
import useAuthStore from "@/store/auth.store.ts";
import {getAccess} from "@/lib/token";

export default function PrivateRoute() {
    const location = useLocation();
    const hydrated = useAuthStore((s) => s._hydrated);
    const token = getAccess();
    const user = useAuthStore((s) => s.user);
    const status = useAuthStore((s) => s.meStatus);
    const loadMe = useAuthStore((s) => s.loadMeOnce);

    useEffect(() => {
        if (!hydrated) return;
        if (token && !user && (status === "idle" || status === "error")) {
            loadMe();
        }
    }, [hydrated, token, user, status, loadMe]);

    if (!hydrated) return null;
    if (!token) {
        return <Navigate to="/login" replace state={{from: location}}/>;
    }
    if (status === "loading" || (!user && (status === "idle" || status === "error"))) {
        return (
            <div className="min-h-screen grid place-items-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="size-2 rounded-full bg-primary animate-pulse"/>
                    <span>Đang kiểm tra phiên đăng nhập…</span>
                </div>
            </div>
        );
    }
    return <Outlet/>;
}
