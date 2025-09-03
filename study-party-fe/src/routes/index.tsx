
import { userRoutes } from "./UserRoutes.tsx";
import { adminRoutes } from "./AdminRoutes.tsx";

export const routes = [...userRoutes, ...adminRoutes];