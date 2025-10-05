import {NextResponse} from "next/server";

const COOKIE_NAME = "AT";

// public
const publicRoutes = [
    /^\/$/, // Home để public, tránh loop lúc hydrate
    /^\/login$/,
    /^\/register$/,
    /^\/about$/,
    /^\/contact$/,
    /^\/forgot-password$/,
    /^\/search$/,
    /^\/company\/company-search$/,
    /^\/company\/company-detail\/[^/]+$/,
    /^\/job-detail\/[^/]+$/,
];

// need login
const protectedPrefixes = [
    /^\/profile/,
    /^\/dashboard/,
    /^\/job-invitation/,
    /^\/notifications/,
    /^\/saved-jobs/,
    /^\/companyFollows/,
    /^\/managecV/,
    /^\/interviews(\/|$)/,
    /^\/jobs(\/|$)/,
    /^\/applications/,
    /^\/settings/,
    /^\/recruiter(\/.*)?$/, // toàn bộ khu recruiter
];

// recruiter only
const recruiterOnly = [
    /^\/recruiter(\/.*)?$/,
    /^\/recruiter-dashboard/,
    /^\/recruiter\/create-job/,
    /^\/company-profile/,
    /^\/manage-jobs/,
];

function getRoleFromJwt(token) {
    try {
        const parts = token.split(".");
        if (parts.length < 2) return null;
        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const json = JSON.parse(atob(base64));

        if (typeof json.role === "object") {
            return json.role.roleName?.toString().toUpperCase() || null;
        }
        return json.role?.toString().toUpperCase() || null;
    } catch {
        return null;
    }
}


export function middleware(req) {
    const {pathname, search} = req.nextUrl;

    // Bỏ qua tài nguyên tĩnh & api
    if (
        pathname.startsWith("/api") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    if (publicRoutes.some((r) => r.test(pathname))) {
        return NextResponse.next();
    }

    const needAuth = protectedPrefixes.some((r) => r.test(pathname));
    if (!needAuth) return NextResponse.next();

    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("redirect", pathname + search);
        return NextResponse.redirect(url);
    }

    const isRecruiterPath = recruiterOnly.some((r) => r.test(pathname));
    if (isRecruiterPath) {
        const role = getRoleFromJwt(token);
        if (role !== "RECRUITER") {
            const url = req.nextUrl.clone();
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
    }

    if (pathname === "/") {
        const role = getRoleFromJwt(token);
        if (role === "RECRUITER") {
            const url = req.nextUrl.clone();
            url.pathname = "/recruiter/dashboard";
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
