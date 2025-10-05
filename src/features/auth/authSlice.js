import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import authService from "@/services/authService";

function toApiError(err, fallbackMessage = "Request failed", extra = {}) {
    const r = err?.response;
    if (r?.data) {
        return {
            ...r.data,
            status: r.status ?? r.data.status,
            ...extra,
        };
    }
    return {
        status: 0,
        code: "NETWORK_ERROR",
        message: err?.message || fallbackMessage,
        extra: {},
        ...extra,
    };
}

export const loginThunk = createAsyncThunk(
    "auth/login",
    async (credentials, {rejectWithValue}) => {
        try {
            return await authService.login(credentials);
        } catch (err) {
            return rejectWithValue(
                toApiError(err, "Login failed", {email: credentials?.email})
            );
        }
    }
);

export const registerThunk = createAsyncThunk(
    "auth/register",
    async (payload, {rejectWithValue}) => {
        try {
            return await authService.register(payload);
        } catch (err) {
            return rejectWithValue(toApiError(err, "Register failed"));
        }
    },
);

export const meThunk = createAsyncThunk(
    "auth/me",
    async (_, {rejectWithValue}) => {
        try {
            const res = await authService.me();
            return res.user;
        } catch (e) {
            return rejectWithValue(toApiError(err, "Not authenticated"));
        }
    },
);

export const logoutThunk = createAsyncThunk(
    "auth/logout",
    async (_, {rejectWithValue}) => {
        try {
            await authService.logout();

            return true;
        } catch (err) {
            return rejectWithValue(toApiError(err, "Logout failed"));
        } finally {
            try {
                localStorage.removeItem("authState");
            } catch {
            }
        }
    },
);

export const activateThunk = createAsyncThunk(
    "auth/activate",
    async (token, {rejectWithValue}) => {
        try {
            return await authService.activate(token);
        } catch (err) {
            return rejectWithValue(toApiError(err, "Activation failed"));
        }
    }
);

export const resendActivationThunk = createAsyncThunk(
    "auth/resendActivation",
    async (email, {rejectWithValue}) => {
        try {
            return await authService.resendActivation(email);
        } catch (err) {
            return rejectWithValue(toApiError(err, "Resend failed"));
        }
    }
);

export const forgotPasswordThunk = createAsyncThunk(
    "auth/forgotPassword",
    async (email, {rejectWithValue}) => {
        try {
            return await authService.forgotPassword(email);
        } catch (err) {
            return rejectWithValue(toApiError(err, "Request failed"));
        }
    }
);

export const resetPasswordThunk = createAsyncThunk(
    "auth/resetPassword",
    async ({token, newPassword}, {rejectWithValue}) => {
        try {
            return await authService.resetPassword({token, newPassword});
        } catch (err) {
            return rejectWithValue(toApiError(err, "Reset failed"));
        }
    }
);

// gọi khi app init để lấy AT mới nếu RT cũ vần còn date
export const refreshThunk = createAsyncThunk(
    "auth/refresh",
    async (_, {rejectWithValue}) => {
        try {
            return await authService.refresh();
        } catch (err) {
            return rejectWithValue(toApiError(err, "Refresh failed"));
        }
    }
);

export const sendSetPasswordLinkThunk = createAsyncThunk(
    "auth/sendSetPasswordLink",
    async (email, {rejectWithValue}) => {
        try {
            return await authService.sendSetPasswordLink(email);
        } catch (err) {
            return rejectWithValue(toApiError(err, "Request failed"));
        }
    }
);

export const setPasswordThunk = createAsyncThunk(
    "auth/set",
    async ({token, newPassword}, {rejectWithValue}) => {
        try {
            return await authService.setPassword({token, newPassword});
        } catch (err) {
            return rejectWithValue(toApiError(err, "Set password failed"));
        }
    }
);

const initialState = {
    user: null,
    loading: false,
    error: null,
    hydrated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload || null;
            state.hydrated = true;
        },
        clearError(state) {
            state.error = null;
        },
        authHydrated: (state, action) => {
            state.user = action.payload?.user ?? null;
            state.hydrated = true;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginThunk.pending, (s) => {
                s.loading = true;
                s.error = null;
            })
            .addCase(loginThunk.fulfilled, (s, a) => {
                s.loading = false;
                s.user = a.payload?.user ?? s.user ?? null;
                s.hydrated = true;
            })
            .addCase(loginThunk.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload || "Login failed";
            })
            // Register
            .addCase(registerThunk.pending, (s) => {
                s.loading = true;
                s.error = null;
            })
            .addCase(registerThunk.fulfilled, (s) => {
                s.loading = false;
            })
            .addCase(registerThunk.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload || "Register failed";
            })
            // Me
            .addCase(meThunk.fulfilled, (s, a) => {
                s.user = a.payload || null;
                s.hydrated = true;
            })
            .addCase(meThunk.rejected, (s) => {
                s.user = null;
                s.hydrated = true;
            })
            // Logout
            .addCase(logoutThunk.fulfilled, (s) => {
                s.user = null;
                s.error = null;
                s.hydrated = true;
            })
            .addCase(logoutThunk.rejected, (s) => {
                s.user = null;
                s.hydrated = true;
            })
            // Activate account
            .addCase(activateThunk.pending, (s) => {
                s.loading = true;
                s.error = null;
            })
            .addCase(activateThunk.fulfilled, (s) => {
                s.loading = false;
            })
            .addCase(activateThunk.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload || "Activation failed";
            })
            // Resend activation
            .addCase(resendActivationThunk.pending, (s) => {
                s.loading = true;
                s.error = null;
            })
            .addCase(resendActivationThunk.fulfilled, (s) => {
                s.loading = false;
            })
            .addCase(resendActivationThunk.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload || "Resend failed";
            })
            // Forgot password
            .addCase(forgotPasswordThunk.pending, (s) => {
                s.loading = true;
                s.error = null;
            })
            .addCase(forgotPasswordThunk.fulfilled, (s) => {
                s.loading = false;
            })
            .addCase(forgotPasswordThunk.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload || "Request failed";
            })
            // Reset password
            .addCase(resetPasswordThunk.pending, (s) => {
                s.loading = true;
                s.error = null;
            })
            .addCase(resetPasswordThunk.fulfilled, (s) => {
                s.loading = false;
            })
            .addCase(resetPasswordThunk.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload || "Reset failed";
            })
            // Send set-password link
            .addCase(sendSetPasswordLinkThunk.pending, (s) => {
                s.loading = true;
                s.error = null;
            })
            .addCase(sendSetPasswordLinkThunk.fulfilled, (s) => {
                s.loading = false;
            })
            .addCase(sendSetPasswordLinkThunk.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload || "Request failed";
            })
            // Set password
            .addCase(setPasswordThunk.pending, (s) => {
                s.loading = true;
                s.error = null;
            })
            .addCase(setPasswordThunk.fulfilled, (s) => {
                s.loading = false;
            })
            .addCase(setPasswordThunk.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload || "Set password failed";
            });

    },
});

export const {authHydrated} = authSlice.actions;
export default authSlice.reducer;
