export const formatList = (field) =>
    Array.isArray(field) ? field.join(", ") : field || "Không xác định";

export const toList = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field.filter(Boolean);
    return String(field)
        .split(/[\n,;]+/)
        .map((s) => s.trim())
        .filter(Boolean);
};

export const formatDateDMY = (input) => {
    if (!input) return "N/A";
    if (typeof input === "string") {
        const m = input.match(/^(\d{2})-(\d{2})-(\d{4})$/);
        if (m) return `${m[1]}/${m[2]}/${m[3]}`;
        const iso = Date.parse(input);
        if (!Number.isNaN(iso))
            return new Date(iso).toLocaleDateString("vi-VN");
        return input;
    }
    if (input instanceof Date) return input.toLocaleDateString("vi-VN");
    return "N/A";
};
