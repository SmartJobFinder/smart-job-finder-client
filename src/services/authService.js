import api from "@/lib/api";

const authService = {
    async login(credentials) {
        const {data} = await api.post("/auth/login", credentials);
        return {
            user: data,
            message: "Login successful",
        };
    },

    async register(payload) {
        const {data} = await api.post("/auth/register", payload);
        return data;
    },

    async me() {
        const {data} = await api.get("/auth/me"); // lấy từ cookie httpOnly
        return {user: data};
    },

    async logout() {
        try {
            await api.post("/auth/logout");
        } catch {
        }
    },

    async activate(token) {
        try {
            const res = await api.get("/auth/activate", {params: {token}});
            return {
                message: res?.data?.message || "Account activated successfully. You can now log in.",
                status: res?.status || 200,
            };
        } catch (err) {
            const st = err?.response?.status;
            if (st === 404 || st === 405) {
                const res2 = await api.post("/auth/activate", {token});
                return {
                    message: res2?.data?.message || "Account activated successfully. You can now log in.",
                    status: res2?.status || 200,
                };
            }
            throw err;
        }
    },

    async resendActivation(email) {
        const res = await api.post("/auth/resendActivation", null, {params: {email}});

        const hdr = res?.headers?.["retry-after"];
        let cooldownSec = Number(hdr);

        if (!Number.isFinite(cooldownSec) || cooldownSec <= 0) {
            const d = res?.data || {};
            const v = Number(d.cooldown ?? d.retryAfterSec);
            cooldownSec = Number.isFinite(v) && v > 0 ? v : undefined;
        }

        return {
            cooldownSec,
            message:
                "If the email is valid and the account is not activated, a new activation link has been sent.",
        };
    },

    async forgotPassword(email) {
        await api.post("/auth/password/forgot", {email});
        return {message: "If the email exists, we have sent you a password reset link."};
    },

    async resetPassword({token, newPassword}) {
        await api.post("/auth/password/resetPassword", {token, newPassword});
        return {message: "Your password has been updated. You can now log in."};
    },

    async refresh() {
        await api.post("/auth/refresh"); // no content
        return {ok: true};
    },

    async sendSetPasswordLink(email) {
        await api.post("/auth/password/set-link", {email});
        return {message: "If eligible, a set-password link has been sent to your email."};
    },

    async setPassword({token, newPassword}) {
        await api.post("/auth/password/set", {token, newPassword});
        return {message: "Your password has been set. You can sign in with email/password now."};
    },
};


export default authService;
