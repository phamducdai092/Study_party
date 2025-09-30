
export const calcAge = (iso?: string | null) => {
    if (!iso) return null;
    const b = new Date(iso);
    const n = new Date();
    let age = n.getFullYear() - b.getFullYear();
    const m = n.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && n.getDate() < b.getDate())) age--;
    return age;
}

export const toDateInput =(iso?: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
}

export const fmtDateTime = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(d);
};

export const initials = (name: string | undefined) => {
    if (!name) return "";
    const parts = name.split(" ").filter(Boolean);
    return parts.slice(0, 2).map(p => p[0]?.toUpperCase() ?? "").join("");
};